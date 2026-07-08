"use server";

import { aiRouter } from "@/lib/ai/router";
import type { AIProvider } from "@/lib/ai/router/types";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type ModelConfig = {
  id: string;
  provider: AIProvider;
  model: string;
  label: string;
};

export type ModelResponse = {
  modelId: string;
  label: string;
  provider: string;
  model: string;
  text: string;
  durationMs: number;
  error?: string;
};

export async function multiChatAction(
  history: ChatMessage[],
  selectedModels: ModelConfig[],
  systemPrompt: string
): Promise<ModelResponse[]> {
  const messages = systemPrompt
    ? [{ role: "system" as const, content: systemPrompt }, ...history]
    : history;

  const results = await Promise.allSettled(
    selectedModels.map(async (m) => {
      const t0 = Date.now();
      try {
        const res = await aiRouter.generate({
          task: "general",
          messages,
          temperature: 0.7,
          maxTokens: 2000,
          preferredProvider: m.provider,
          preferredModel: m.model,
        });
        return {
          modelId: m.id,
          label: m.label,
          provider: res.provider,
          model: res.model,
          text: res.text,
          durationMs: Date.now() - t0,
        } satisfies ModelResponse;
      } catch (err) {
        return {
          modelId: m.id,
          label: m.label,
          provider: m.provider,
          model: m.model,
          text: "",
          durationMs: Date.now() - t0,
          error: err instanceof Error ? err.message : "Błąd generowania.",
        } satisfies ModelResponse;
      }
    })
  );

  return results.map((r) =>
    r.status === "fulfilled"
      ? r.value
      : {
          modelId: "unknown",
          label: "Błąd",
          provider: "unknown",
          model: "unknown",
          text: "",
          durationMs: 0,
          error: "Nieoczekiwany błąd.",
        }
  );
}
