import {
  openAICompatibleBody,
  parseOpenAICompatibleResponse,
  readJsonResponse,
  type OpenAICompatibleResponse,
} from "@/lib/ai/router/http";
import type {
  AIProviderAdapter,
  AIProviderRequest,
} from "@/lib/ai/router/types";
import {
  assertServerOnly,
  requestHeaders,
} from "@/lib/ai/providers/provider-utils";

export const openRouterProvider: AIProviderAdapter = {
  id: "openrouter",

  isConfigured() {
    return Boolean(process.env.OPENROUTER_API_KEY);
  },

  async generate(request: AIProviderRequest) {
    assertServerOnly();
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error("Brakuje OPENROUTER_API_KEY.");

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        ...requestHeaders(apiKey),
        "HTTP-Referer":
          process.env.NEXT_PUBLIC_SITE_URL || "",
        "X-Title": process.env.OPENROUTER_APP_NAME || "MA Atelier Studio",
      },
      body: JSON.stringify(
        openAICompatibleBody({
          ...request,
          messages: request.messages,
        })
      ),
      signal: request.signal,
    });

    return parseOpenAICompatibleResponse(
      await readJsonResponse<OpenAICompatibleResponse>(response)
    );
  },
};

