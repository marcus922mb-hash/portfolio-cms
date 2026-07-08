import type { DemoContent } from "@/features/demos/types";
import type { AIProvider } from "@/lib/ai/router";
import type { Json } from "@/types/database";

export type { AIProvider } from "@/lib/ai/router";

export type AIModelConfig = {
  provider: AIProvider;
  model: string;
  apiKeyEnv: string;
  enabled: boolean;
};

export type GenerateDemoContentInput = {
  demoId: string;
  companyName: string | null;
  clientName: string | null;
  industry: string | null;
  city: string | null;
  websiteType: string | null;
  style: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  businessDescription: string | null;
  services: string | null;
  targetAudience: string | null;
  tone: string | null;
  generationMode?: "quick" | "full" | "premium" | "publish";
  estimate: {
    websiteType: string | null;
    pagesCount: number | null;
    finalPrice: number | null;
    notes: string | null;
  } | null;
  currentContent: Json | null;
};

export type GenerateDemoContentOutput = {
  content: DemoContent;
  provider: AIProvider;
  model: string;
  generatedAt: string;
};

export type AIGenerationStatus = "pending" | "completed" | "error";

export type AIGenerationLog = {
  id: string;
  created_at: string;
  demo_id: string | null;
  provider: string;
  model: string;
  prompt: string;
  response: string | null;
  status: AIGenerationStatus;
  error: string | null;
};

export type AIProviderResult = {
  provider: AIProvider;
  model: string;
  rawText: string;
};
