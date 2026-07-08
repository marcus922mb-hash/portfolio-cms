import type { AIProviderRequest } from "@/lib/ai/router/types";

export function assertServerOnly() {
  if (typeof window !== "undefined") {
    throw new Error("Provider AI może działać wyłącznie po stronie serwera.");
  }
}

export function requestHeaders(apiKey: string) {
  return {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };
}

export function cloudflareMessages(request: AIProviderRequest) {
  return request.messages.map(({ role, content }) => ({ role, content }));
}

