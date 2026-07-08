import {
  getAIRouterRuntimeConfig,
  getModelCandidates,
} from "@/lib/ai/router/config";
import {
  AIRouterError,
  getAIErrorMessage,
  isRetryableError,
} from "@/lib/ai/router/errors";
import { isModelAvailable } from "@/lib/ai/cloudflare/model-health";
import type {
  AIProvider,
  AIProviderAdapter,
  AIRouterHooks,
  AIRouterRequest,
  AIRouterResponse,
} from "@/lib/ai/router/types";
import { cloudflareProvider } from "@/lib/ai/providers/cloudflare";
import { geminiProvider } from "@/lib/ai/providers/gemini";
import { groqProvider } from "@/lib/ai/providers/groq";
import { localAIProvider } from "@/lib/ai/providers/local";
import { openRouterProvider } from "@/lib/ai/providers/openrouter";

const defaultProviders: AIProviderAdapter[] = [
  openRouterProvider,
  cloudflareProvider,
  geminiProvider,
  groqProvider,
  localAIProvider,
];

function delay(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function promptForLogging(request: AIRouterRequest) {
  return request.messages.map((message) => message.content).join("\n\n");
}

export class AIRouter {
  private readonly providers: Map<AIProvider, AIProviderAdapter>;

  constructor(providers: AIProviderAdapter[] = defaultProviders) {
    this.providers = new Map(providers.map((provider) => [provider.id, provider]));
  }

  async generate(
    request: AIRouterRequest,
    hooks: AIRouterHooks = {}
  ): Promise<AIRouterResponse> {
    const runtime = getAIRouterRuntimeConfig();
    const candidates = getModelCandidates(request.task, request.preferredProvider);
    if (request.preferredProvider && request.preferredModel) {
      candidates.unshift({ provider: request.preferredProvider, model: request.preferredModel });
    }
    const seen = new Set<string>();
    const dedupedCandidates = candidates.filter(({ provider, model }) => {
      const key = `${provider}:${model}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    const configured = dedupedCandidates.filter((candidate) => {
      if (!this.providers.get(candidate.provider)?.isConfigured()) return false;
      // Pomiń modele Cloudflare oznaczone jako niedostępne w health cache
      if (candidate.provider === "cloudflare" && !isModelAvailable(candidate.model)) {
        console.info(`[ai-router] Pomijam niedostępny model CF: ${candidate.model}`);
        return false;
      }
      return true;
    });

    if (!configured.length) {
      throw new AIRouterError(
        "Nie skonfigurowano żadnego dostawcy AI. Uzupełnij zmienne w .env.local."
      );
    }

    const startedAt = Date.now();
    const failures: AIRouterError["failures"] = [];
    let totalAttempts = 0;

    for (const candidate of configured) {
      const provider = this.providers.get(candidate.provider);
      if (!provider) continue;

      for (let retry = 0; retry <= runtime.retries; retry += 1) {
        totalAttempts += 1;
        const attemptStartedAt = Date.now();
        const context = {
          task: request.task,
          provider: candidate.provider,
          model: candidate.model,
          attempt: retry + 1,
          prompt: promptForLogging(request),
        };
        const logId = await hooks.onAttemptStart?.(context);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), runtime.timeoutMs);

        try {
          const { validateResponse, ...providerRequest } = request;
          const result = await provider.generate({
            ...providerRequest,
            model: candidate.model,
            signal: controller.signal,
          });
          validateResponse?.(result.text);
          await hooks.onAttemptEnd?.(logId ?? null, context, {
            response: result.text,
            durationMs: Date.now() - attemptStartedAt,
          });

          return {
            ...result,
            provider: candidate.provider,
            model: candidate.model,
            attempts: totalAttempts,
            durationMs: Date.now() - startedAt,
          };
        } catch (error) {
          const message =
            controller.signal.aborted
              ? `Przekroczono limit czasu ${runtime.timeoutMs} ms.`
              : getAIErrorMessage(error);
          await hooks.onAttemptEnd?.(logId ?? null, context, {
            error: message,
            durationMs: Date.now() - attemptStartedAt,
          });
          console.error("[ai-router] Próba zakończona błędem", {
            task: request.task,
            provider: candidate.provider,
            model: candidate.model,
            attempt: retry + 1,
            error: message,
          });

          const retryable = controller.signal.aborted || isRetryableError(error);
          if (!retryable || retry === runtime.retries) {
            failures.push({ ...candidate, message });
            break;
          }
          await delay(runtime.retryBaseDelayMs * 2 ** retry);
        } finally {
          clearTimeout(timeout);
        }
      }
    }

    throw new AIRouterError(
      `Nie udało się wykonać zadania AI. ${failures
        .map(({ provider, model, message }) => `${provider}/${model}: ${message}`)
        .join(" | ")}`,
      failures
    );
  }
}

export const aiRouter = new AIRouter();
