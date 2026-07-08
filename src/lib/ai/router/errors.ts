import type { AIProvider } from "@/lib/ai/router/types";

export class AIProviderError extends Error {
  readonly retryable: boolean;
  readonly status?: number;

  constructor(
    message: string,
    options?: { retryable?: boolean; status?: number; cause?: unknown }
  ) {
    super(message, { cause: options?.cause });
    this.name = "AIProviderError";
    this.retryable = options?.retryable ?? false;
    this.status = options?.status;
  }
}

export class AIRouterError extends Error {
  readonly failures: Array<{
    provider: AIProvider;
    model: string;
    message: string;
  }>;

  constructor(
    message: string,
    failures: AIRouterError["failures"] = []
  ) {
    super(message);
    this.name = "AIRouterError";
    this.failures = failures;
  }
}

export function isRetryableError(error: unknown) {
  if (error instanceof AIProviderError) return error.retryable;
  if (error instanceof DOMException && error.name === "AbortError") return true;
  return error instanceof TypeError;
}

export function getAIErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Nieznany błąd dostawcy AI.";
}

