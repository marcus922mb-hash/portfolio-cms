import type {
  AIModelCandidate,
  AIProvider,
  AITask,
} from "@/lib/ai/router/types";
import { CF_WEBSITE_GENERATION_FALLBACKS } from "@/lib/ai/cloudflare/models";

// Domyślna kolejność fallbacków dla CF — pobierana z centralnego rejestru
const DEFAULT_MODELS: Record<AIProvider, string[]> = {
  openrouter: ["meta-llama/llama-3.3-70b-instruct:free"],
  cloudflare: [...CF_WEBSITE_GENERATION_FALLBACKS],
  gemini: ["gemini-1.5-flash"],
  groq: ["llama-3.1-8b-instant"],
  local: ["local-model"],
};

const DEFAULT_PROVIDER_ORDER: AIProvider[] = [
  "openrouter",
  "cloudflare",
  "gemini",
  "groq",
  "local",
];

const PROVIDER_ENV_PREFIX: Record<AIProvider, string> = {
  openrouter: "OPENROUTER",
  cloudflare: "CLOUDFLARE",
  gemini: "GEMINI",
  groq: "GROQ",
  local: "LOCAL_AI",
};

function positiveInteger(value: string | undefined, fallback: number) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

function commaSeparated(value: string | undefined) {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function isAIProvider(value: string): value is AIProvider {
  return DEFAULT_PROVIDER_ORDER.includes(value as AIProvider);
}

function taskEnvName(task: AITask) {
  return `AI_${task.toUpperCase()}_MODELS`;
}

export function getAIRouterRuntimeConfig() {
  const configuredOrder = commaSeparated(process.env.AI_PROVIDER_ORDER).filter(isAIProvider);

  return {
    providerOrder: configuredOrder.length ? configuredOrder : DEFAULT_PROVIDER_ORDER,
    timeoutMs: positiveInteger(process.env.AI_TIMEOUT_MS, 30_000),
    retries: positiveInteger(process.env.AI_RETRY_COUNT, 2),
    retryBaseDelayMs: positiveInteger(process.env.AI_RETRY_BASE_DELAY_MS, 350),
  };
}

export function getProviderModels(provider: AIProvider) {
  const prefix = PROVIDER_ENV_PREFIX[provider];
  const models = commaSeparated(process.env[`${prefix}_MODELS`]);
  const legacyModel = process.env[`${prefix}_MODEL`]?.trim();

  if (models.length) return models;
  if (legacyModel) return [legacyModel];
  return DEFAULT_MODELS[provider];
}

export function getModelCandidates(
  task: AITask,
  preferredProvider?: AIProvider
): AIModelCandidate[] {
  const config = getAIRouterRuntimeConfig();
  const providers = preferredProvider
    ? [
        preferredProvider,
        ...config.providerOrder.filter((provider) => provider !== preferredProvider),
      ]
    : config.providerOrder;
  const taskModels = commaSeparated(process.env[taskEnvName(task)]);

  if (taskModels.length) {
    const parsed = taskModels.flatMap((entry) => {
      const separator = entry.indexOf(":");
      if (separator < 1) return [];
      const provider = entry.slice(0, separator);
      const model = entry.slice(separator + 1);
      return isAIProvider(provider) && model ? [{ provider, model }] : [];
    });
    if (parsed.length) return parsed;
  }

  return providers.flatMap((provider) =>
    getProviderModels(provider).map((model) => ({ provider, model }))
  );
}

export function isProviderConfigured(provider: AIProvider) {
  switch (provider) {
    case "openrouter":
      return Boolean(process.env.OPENROUTER_API_KEY);
    case "cloudflare":
      return Boolean(
        (process.env.CLOUDFLARE_WORKERS_AI_URL &&
          process.env.CLOUDFLARE_WORKERS_AI_SECRET) ||
          (process.env.CLOUDFLARE_ACCOUNT_ID &&
            process.env.CLOUDFLARE_API_TOKEN)
      );
    case "gemini":
      return Boolean(process.env.GEMINI_API_KEY);
    case "groq":
      return Boolean(process.env.GROQ_API_KEY);
    case "local":
      return Boolean(process.env.LOCAL_AI_BASE_URL);
  }
}
