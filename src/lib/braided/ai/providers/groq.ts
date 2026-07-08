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

export const groqProvider: AIProviderAdapter = {
  id: "groq",

  isConfigured() {
    return Boolean(process.env.GROQ_API_KEY);
  },

  async generate(request: AIProviderRequest) {
    assertServerOnly();
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error("Brakuje GROQ_API_KEY.");

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: requestHeaders(apiKey),
        body: JSON.stringify(
          openAICompatibleBody({ ...request, messages: request.messages })
        ),
        signal: request.signal,
      }
    );

    return parseOpenAICompatibleResponse(
      await readJsonResponse<OpenAICompatibleResponse>(response)
    );
  },
};

