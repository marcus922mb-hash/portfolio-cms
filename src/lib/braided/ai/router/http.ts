import { AIProviderError } from "@/lib/ai/router/errors";

export async function readJsonResponse<T>(response: Response): Promise<T> {
  const body = await response.text();
  let payload: T | null = null;

  try {
    payload = JSON.parse(body) as T;
  } catch {
    // The status below still provides useful context without logging response secrets.
  }

  if (!response.ok) {
    throw new AIProviderError(
      getPayloadError(payload) || `Dostawca AI zwrócił status ${response.status}.`,
      {
        status: response.status,
        retryable:
          response.status === 408 ||
          response.status === 409 ||
          response.status === 429 ||
          response.status >= 500,
      }
    );
  }

  if (!payload) {
    throw new AIProviderError("Dostawca AI zwrócił niepoprawną odpowiedź JSON.");
  }

  return payload;
}

function getPayloadError(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const error = "error" in payload ? payload.error : null;
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error) {
    return typeof error.message === "string" ? error.message : null;
  }
  const errors = "errors" in payload ? payload.errors : null;
  if (Array.isArray(errors)) {
    const first = errors[0];
    if (first && typeof first === "object" && "message" in first) {
      return typeof first.message === "string" ? first.message : null;
    }
  }
  return null;
}

export function openAICompatibleBody(input: {
  model: string;
  messages: Array<{ role: string; content: string }>;
  temperature?: number;
  maxTokens?: number;
  responseFormat?: "text" | "json";
}) {
  return {
    model: input.model,
    messages: input.messages,
    temperature: input.temperature,
    max_tokens: input.maxTokens,
    ...(input.responseFormat === "json"
      ? { response_format: { type: "json_object" } }
      : {}),
  };
}

export type OpenAICompatibleResponse = {
  choices?: Array<{ message?: { content?: string } }>;
  usage?: { prompt_tokens?: number; completion_tokens?: number };
  error?: { message?: string };
};

export function parseOpenAICompatibleResponse(payload: OpenAICompatibleResponse) {
  const text = payload.choices?.[0]?.message?.content?.trim();
  if (!text) {
    throw new AIProviderError("Dostawca AI nie zwrócił treści.");
  }
  return {
    text,
    usage: {
      inputTokens: payload.usage?.prompt_tokens,
      outputTokens: payload.usage?.completion_tokens,
    },
  };
}
