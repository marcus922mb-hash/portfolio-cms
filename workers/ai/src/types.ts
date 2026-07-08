export type MessageRole = "system" | "user" | "assistant";

export type GenerateRequest = {
  model?: string;
  messages?: Array<{
    role?: MessageRole;
    content?: string;
  }>;
  temperature?: number;
  maxTokens?: number;
  responseFormat?: "text" | "json";
};

export type GenerateResponse = {
  success: true;
  result: {
    response: string;
    usage?: {
      prompt_tokens?: number;
      completion_tokens?: number;
    };
  };
  errors: [];
  requestId: string;
};

export type WorkerEnv = {
  AI: Ai;
  AI_ROUTER_SHARED_SECRET: string;
  ENVIRONMENT: string;
  DEFAULT_MODEL: string;
  ALLOWED_MODELS: string;
};

