export type AIProvider =
  | "openrouter"
  | "cloudflare"
  | "gemini"
  | "groq"
  | "local";

export type AITask =
  | "demo_generation"
  | "content_generation"
  | "seo_generation"
  | "general";

export type AIMessageRole = "system" | "user" | "assistant";

export type AIMessage = {
  role: AIMessageRole;
  content: string;
};

export type AIResponseFormat = "text" | "json";

export type AIRouterRequest = {
  task: AITask;
  messages: AIMessage[];
  temperature?: number;
  maxTokens?: number;
  responseFormat?: AIResponseFormat;
  preferredProvider?: AIProvider;
  preferredModel?: string;
  metadata?: Record<string, string | number | boolean | null>;
  validateResponse?: (text: string) => void;
};

export type AIProviderRequest = Omit<AIRouterRequest, "validateResponse"> & {
  model: string;
  signal: AbortSignal;
};

export type AIProviderResponse = {
  text: string;
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
  };
};

export type AIRouterResponse = AIProviderResponse & {
  provider: AIProvider;
  model: string;
  attempts: number;
  durationMs: number;
};

export type AIProviderAdapter = {
  readonly id: AIProvider;
  isConfigured(): boolean;
  generate(request: AIProviderRequest): Promise<AIProviderResponse>;
};

export type AIAttemptContext = {
  task: AITask;
  provider: AIProvider;
  model: string;
  attempt: number;
  prompt: string;
};

export type AIAttemptResult = {
  response?: string;
  error?: string;
  durationMs: number;
};

export type AIRouterHooks = {
  onAttemptStart?: (context: AIAttemptContext) => Promise<string | null>;
  onAttemptEnd?: (
    logId: string | null,
    context: AIAttemptContext,
    result: AIAttemptResult
  ) => Promise<void>;
};

export type AIModelCandidate = {
  provider: AIProvider;
  model: string;
};
