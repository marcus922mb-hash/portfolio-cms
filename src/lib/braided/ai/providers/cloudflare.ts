import {
  isModelUnavailableError,
  markModelUnavailable,
} from "@/lib/ai/cloudflare/model-health";
import { AIProviderError } from "@/lib/ai/router/errors";
import { readJsonResponse } from "@/lib/ai/router/http";
import type {
  AIProviderAdapter,
  AIProviderRequest,
} from "@/lib/ai/router/types";
import {
  assertServerOnly,
  cloudflareMessages,
  requestHeaders,
} from "@/lib/ai/providers/provider-utils";

type CloudflareResponse = {
  success?: boolean;
  result?: {
    // Cloudflare AI zwraca response jako string ALBO obiekt gdy model wygeneruje poprawny JSON
    response?: string | Record<string, unknown>;
    usage?: { prompt_tokens?: number; completion_tokens?: number };
  };
  errors?: Array<{ message?: string; code?: number }>;
};

export const cloudflareProvider: AIProviderAdapter = {
  id: "cloudflare",

  isConfigured() {
    const workerConfigured = Boolean(
      process.env.CLOUDFLARE_WORKERS_AI_URL &&
        process.env.CLOUDFLARE_WORKERS_AI_SECRET
    );
    const restConfigured = Boolean(
      process.env.CLOUDFLARE_ACCOUNT_ID &&
        process.env.CLOUDFLARE_API_TOKEN
    );
    return workerConfigured || restConfigured;
  },

  async generate(request: AIProviderRequest) {
    assertServerOnly();
    const workerUrl = process.env.CLOUDFLARE_WORKERS_AI_URL?.replace(/\/+$/, "");
    const workerSecret = process.env.CLOUDFLARE_WORKERS_AI_SECRET;
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;

    if ((!workerUrl || !workerSecret) && (!accountId || !apiToken)) {
      throw new Error("Brakuje konfiguracji Cloudflare Workers AI.");
    }

    const model = request.model.replace(/^\/+/, "");
    const useWorker = Boolean(workerUrl && workerSecret);

    const endpoint = useWorker
      ? `${workerUrl}/v1/generate`
      : `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(accountId!)}/ai/run/${model}`;

    const payload = useWorker
      ? {
          model: request.model,
          messages: cloudflareMessages(request),
          temperature: request.temperature,
          maxTokens: request.maxTokens,
        }
      : {
          messages: cloudflareMessages(request),
          temperature: request.temperature,
          max_tokens: request.maxTokens,
        };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: requestHeaders(useWorker ? workerSecret! : apiToken!),
      body: JSON.stringify(payload),
      signal: request.signal,
    });

    const result = await readJsonResponse<CloudflareResponse>(response);

    // Jeśli model jest wycofany lub niedostępny — oznacz i nie rób retry
    if (!result.success || !result.result?.response) {
      const errorMsg =
        result.errors?.[0]?.message ??
        `HTTP ${response.status}: Cloudflare Workers AI nie zwrócił treści.`;
      const errorCode = result.errors?.[0]?.code;

      if (
        response.status === 410 ||
        isModelUnavailableError(errorMsg, response.status) ||
        (errorCode && [5007, 5028, 404].includes(errorCode))
      ) {
        markModelUnavailable(request.model, errorMsg);
        throw new AIProviderError(
          `Model ${request.model} jest wycofany lub niedostępny: ${errorMsg}`,
          { retryable: false }
        );
      }

      throw new AIProviderError(errorMsg, { retryable: false });
    }

    // CF API zwraca response jako string lub jako już sparsowany obiekt JSON
    const raw = result.result.response;
    const text = (typeof raw === "string" ? raw : JSON.stringify(raw)).trim();
    if (!text) {
      throw new AIProviderError(
        "Cloudflare Workers AI zwrócił pustą odpowiedź.",
        { retryable: false }
      );
    }

    return {
      text,
      usage: {
        inputTokens: result.result.usage?.prompt_tokens,
        outputTokens: result.result.usage?.completion_tokens,
      },
    };
  },
};
