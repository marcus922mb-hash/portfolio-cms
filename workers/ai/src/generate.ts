import { errorResponse, json } from "./http";
import type {
  GenerateRequest,
  GenerateResponse,
  MessageRole,
  WorkerEnv,
} from "./types";

const MAX_MESSAGES = 40;
const MAX_CONTENT_LENGTH = 120_000;
const DEFAULT_MAX_TOKENS = 4_096;

function isRole(value: unknown): value is MessageRole {
  return value === "system" || value === "user" || value === "assistant";
}

function allowedModels(env: WorkerEnv) {
  return new Set(
    env.ALLOWED_MODELS.split(",")
      .map((model) => model.trim())
      .filter(Boolean)
  );
}

function numberInRange(
  value: unknown,
  minimum: number,
  maximum: number,
  fallback: number
) {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.min(maximum, Math.max(minimum, value))
    : fallback;
}

function normalizeRequest(body: GenerateRequest, env: WorkerEnv) {
  const model = body.model?.trim() || env.DEFAULT_MODEL;
  if (!allowedModels(env).has(model)) {
    throw new Error("Wybrany model Workers AI nie znajduje się na liście dozwolonych.");
  }
  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    throw new Error("Pole messages musi być niepustą tablicą.");
  }
  if (body.messages.length > MAX_MESSAGES) {
    throw new Error(`Maksymalna liczba wiadomości to ${MAX_MESSAGES}.`);
  }

  let contentLength = 0;
  const messages = body.messages.map((message) => {
    if (!isRole(message.role) || typeof message.content !== "string") {
      throw new Error("Każda wiadomość musi mieć poprawne pola role i content.");
    }
    const content = message.content.trim();
    if (!content) throw new Error("Treść wiadomości nie może być pusta.");
    contentLength += content.length;
    return { role: message.role, content };
  });
  if (contentLength > MAX_CONTENT_LENGTH) {
    throw new Error(`Łączna długość wiadomości przekracza ${MAX_CONTENT_LENGTH} znaków.`);
  }

  return {
    model,
    input: {
      messages,
      temperature: numberInRange(body.temperature, 0, 2, 0.55),
      max_tokens: Math.round(
        numberInRange(body.maxTokens, 1, 8_192, DEFAULT_MAX_TOKENS)
      ),
    },
  };
}

function outputText(output: unknown) {
  if (!output || typeof output !== "object") return "";
  if ("response" in output && typeof output.response === "string") {
    return output.response.trim();
  }
  if ("text" in output && typeof output.text === "string") {
    return output.text.trim();
  }
  if ("output_text" in output && typeof output.output_text === "string") {
    return output.output_text.trim();
  }
  if ("choices" in output && Array.isArray(output.choices)) {
    const first = output.choices[0];
    if (first && typeof first === "object" && "message" in first) {
      const message = first.message;
      if (
        message &&
        typeof message === "object" &&
        "content" in message &&
        typeof message.content === "string"
      ) {
        return message.content.trim();
      }
    }
  }
  return "";
}

function outputUsage(output: unknown) {
  if (!output || typeof output !== "object" || !("usage" in output)) {
    return undefined;
  }
  const usage = output.usage;
  if (!usage || typeof usage !== "object") return undefined;
  const promptTokens =
    "prompt_tokens" in usage && typeof usage.prompt_tokens === "number"
      ? usage.prompt_tokens
      : undefined;
  const completionTokens =
    "completion_tokens" in usage && typeof usage.completion_tokens === "number"
      ? usage.completion_tokens
      : undefined;
  return {
    prompt_tokens: promptTokens,
    completion_tokens: completionTokens,
  };
}

export async function generate(
  request: Request,
  env: WorkerEnv,
  requestId: string
) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 512_000) {
    return errorResponse(requestId, "Żądanie jest zbyt duże.", 413);
  }

  let body: GenerateRequest;
  try {
    body = await request.json<GenerateRequest>();
  } catch {
    return errorResponse(requestId, "Niepoprawny JSON żądania.", 400);
  }

  let normalized: ReturnType<typeof normalizeRequest>;
  try {
    normalized = normalizeRequest(body, env);
  } catch (error) {
    return errorResponse(
      requestId,
      error instanceof Error ? error.message : "Niepoprawne dane wejściowe.",
      400
    );
  }

  try {
    const output = await env.AI.run(
      normalized.model as Parameters<typeof env.AI.run>[0],
      normalized.input as Parameters<typeof env.AI.run>[1]
    );
    const response = outputText(output);
    if (!response) {
      return errorResponse(requestId, "Workers AI nie zwróciło treści.", 502);
    }

    const payload: GenerateResponse = {
      success: true,
      result: {
        response,
        usage: outputUsage(output),
      },
      errors: [],
      requestId,
    };
    return json(payload);
  } catch (error) {
    console.error("[workers-ai] Inference failed", {
      requestId,
      model: normalized.model,
      error: error instanceof Error ? error.message : String(error),
    });
    return errorResponse(
      requestId,
      error instanceof Error ? error.message : "Workers AI inference failed.",
      502
    );
  }
}
