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

export const localAIProvider: AIProviderAdapter = {
  id: "local",

  isConfigured() {
    return Boolean(process.env.LOCAL_AI_BASE_URL);
  },

  async generate(request: AIProviderRequest) {
    assertServerOnly();
    const baseUrl = process.env.LOCAL_AI_BASE_URL?.replace(/\/+$/, "");
    if (!baseUrl) throw new Error("Brakuje LOCAL_AI_BASE_URL.");
    const apiKey = process.env.LOCAL_AI_API_KEY || "local";

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: requestHeaders(apiKey),
      body: JSON.stringify(
        openAICompatibleBody({ ...request, messages: request.messages })
      ),
      signal: request.signal,
    });

    return parseOpenAICompatibleResponse(
      await readJsonResponse<OpenAICompatibleResponse>(response)
    );
  },
};

