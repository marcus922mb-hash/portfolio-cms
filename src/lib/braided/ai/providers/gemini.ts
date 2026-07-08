import { AIProviderError } from "@/lib/ai/router/errors";
import { readJsonResponse } from "@/lib/ai/router/http";
import type {
  AIProviderAdapter,
  AIProviderRequest,
} from "@/lib/ai/router/types";
import { assertServerOnly } from "@/lib/ai/providers/provider-utils";

type GeminiResponse = {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
  }>;
  usageMetadata?: {
    promptTokenCount?: number;
    candidatesTokenCount?: number;
  };
};

export const geminiProvider: AIProviderAdapter = {
  id: "gemini",

  isConfigured() {
    return Boolean(process.env.GEMINI_API_KEY);
  },

  async generate(request: AIProviderRequest) {
    assertServerOnly();
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Brakuje GEMINI_API_KEY.");

    const system = request.messages
      .filter((message) => message.role === "system")
      .map((message) => message.content)
      .join("\n\n");
    const contents = request.messages
      .filter((message) => message.role !== "system")
      .map((message) => ({
        role: message.role === "assistant" ? "model" : "user",
        parts: [{ text: message.content }],
      }));
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(request.model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(system
            ? { systemInstruction: { parts: [{ text: system }] } }
            : {}),
          contents,
          generationConfig: {
            temperature: request.temperature,
            maxOutputTokens: request.maxTokens,
            ...(request.responseFormat === "json"
              ? { responseMimeType: "application/json" }
              : {}),
          },
        }),
        signal: request.signal,
      }
    );
    const payload = await readJsonResponse<GeminiResponse>(response);
    const text = payload.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!text) throw new AIProviderError("Gemini nie zwrócił treści.");

    return {
      text,
      usage: {
        inputTokens: payload.usageMetadata?.promptTokenCount,
        outputTokens: payload.usageMetadata?.candidatesTokenCount,
      },
    };
  },
};

