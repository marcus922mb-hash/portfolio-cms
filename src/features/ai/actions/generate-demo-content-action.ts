"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { DemoGeneratedContentSchema } from "@/features/demos/schemas/demo-schema";
import { DEMO_INDUSTRY_LABELS, DEMO_STYLE_LABELS, type DemoContent } from "@/features/demos/types";
import { createProgressReporter } from "@/features/ai/progress/progress-reporter";
import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { generateDemoContent } from "@/lib/ai/generate-demo-content";
import type { AIProgressReporter } from "@/lib/ai/progress";
import type { AIProvider, GenerateDemoContentInput, GenerateDemoContentOutput } from "@/lib/ai/types";
import type { Json } from "@/types/database";

const aiGenerateInputSchema = z.object({
  demoId: z.string().uuid(),
  runId: z.string().uuid(),
  provider: z.enum(["openrouter", "gemini", "groq", "cloudflare", "local"]).optional(),
  businessDescription: z.string().max(2000).optional(),
  services: z.string().max(2000).optional(),
  targetAudience: z.string().max(1000).optional(),
  tone: z.string().max(500).optional(),
});

const aiSaveInputSchema = z.object({
  demoId: z.string().uuid(),
  content: DemoGeneratedContentSchema,
  provider: z.string().optional(),
  model: z.string().optional(),
});

export type GenerateDemoContentActionState =
  | {
      success: true;
      data: GenerateDemoContentOutput;
    }
  | {
      success: false;
      error: string;
    };

export type SaveGeneratedDemoContentState =
  | {
      success: true;
      statusChanged: boolean;
    }
  | {
      success: false;
      error: string;
    };

function textOrNull(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

async function requireUser() {
  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Brak dostępu. Zaloguj się ponownie.");

  return { supabase, user };
}

function clientName(client: { first_name: string; last_name: string }) {
  return [client.first_name, client.last_name].filter(Boolean).join(" ") || null;
}

export async function generateDemoContentAction(input: {
  demoId: string;
  runId: string;
  provider?: AIProvider;
  businessDescription?: string;
  services?: string;
  targetAudience?: string;
  tone?: string;
}): Promise<GenerateDemoContentActionState> {
  const parsed = aiGenerateInputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Nieprawidłowe dane wejściowe do generowania AI." };
  }

  let reportProgress: AIProgressReporter | undefined;

  try {
    const { supabase, user } = await requireUser();
    reportProgress = createProgressReporter(
      supabase,
      parsed.data.demoId,
      parsed.data.runId
    );
    await reportProgress({
      stage: "request_received",
      status: "completed",
      progress: 3,
      message: "Backend przyjął i uwierzytelnił żądanie generowania.",
      details: {
        requestedProvider: parsed.data.provider ?? "ustawienia użytkownika lub fallback",
      },
    });
    const userMeta = user.user_metadata ?? {};
    const userPreferredProvider = typeof userMeta.ai_preferred_provider === "string"
      ? userMeta.ai_preferred_provider as AIProvider
      : undefined;
    const userPreferredModel = typeof userMeta.ai_preferred_model === "string" && userMeta.ai_preferred_model
      ? userMeta.ai_preferred_model
      : undefined;

    await reportProgress({
      stage: "loading_context",
      status: "running",
      progress: 8,
      message: "Pobieranie danych demo, klienta i wyceny z CRM.",
    });

    const { data: demo, error: demoError } = await supabase
      .from("demos")
      .select("*")
      .eq("id", parsed.data.demoId)
      .single();

    if (demoError || !demo) {
      throw new Error("Nie znaleziono demo.");
    }

    await supabase.from("activity_logs").insert({
      entity_type: "demo",
      entity_id: demo.id,
      action: "ai_generation_started",
      description: "Rozpoczęto generowanie treści AI",
      metadata: { provider: parsed.data.provider ?? "fallback" },
    });

    const [clientResult, estimateResult] = await Promise.all([
      demo.client_id
        ? supabase.from("clients").select("*").eq("id", demo.client_id).single()
        : Promise.resolve({ data: null }),
      demo.estimate_id
        ? supabase.from("estimates").select("*").eq("id", demo.estimate_id).single()
        : Promise.resolve({ data: null }),
    ]);
    const client = clientResult.data;
    const estimate = estimateResult.data;

    await reportProgress({
      stage: "context_loaded",
      status: "completed",
      progress: 15,
      message: "Załadowano rzeczywiste dane biznesowe do generowania.",
      details: {
        demoTitle: demo.title,
        company: client?.company_name ?? clientName(client ?? { first_name: "", last_name: "" }) ?? "brak",
        industry: demo.industry ?? client?.industry ?? "brak",
        city: client?.city ?? "brak",
        websiteType: estimate?.website_type ?? "brak",
        hasExistingContent: Boolean(demo.content),
        hasEstimate: Boolean(estimate),
      },
    });

    const aiInput: GenerateDemoContentInput = {
      demoId: demo.id,
      companyName: client?.company_name ?? null,
      clientName: client ? clientName(client) : null,
      industry: demo.industry ?? client?.industry ?? null,
      city: client?.city ?? null,
      websiteType: estimate?.website_type ?? null,
      style: demo.style ?? null,
      primaryColor: demo.primary_color ?? null,
      secondaryColor: demo.secondary_color ?? null,
      businessDescription: textOrNull(parsed.data.businessDescription) ?? client?.notes ?? null,
      services: textOrNull(parsed.data.services),
      targetAudience: textOrNull(parsed.data.targetAudience),
      tone: textOrNull(parsed.data.tone),
      generationMode: (demo.generation_mode as GenerateDemoContentInput["generationMode"]) ?? "full",
      estimate: estimate
        ? {
            websiteType: estimate.website_type,
            pagesCount: estimate.pages_count,
            finalPrice: estimate.final_price != null ? Number(estimate.final_price) : null,
            notes: estimate.notes,
          }
        : null,
      currentContent: demo.content,
    };

    const result = await generateDemoContent(aiInput, {
      preferredProvider: parsed.data.provider ?? userPreferredProvider,
      preferredModel: userPreferredModel,
      onProgress: reportProgress,
      onAttemptStart: async (provider, model, prompt) => {
        const { data: log } = await supabase
          .from("ai_generations")
          .insert({
            demo_id: demo.id,
            provider,
            model,
            prompt,
            status: "pending",
          })
          .select("id")
          .single();
        return log?.id ?? null;
      },
      onAttemptEnd: async (logId, attemptResult) => {
        if (!logId) return;
        await supabase
          .from("ai_generations")
          .update({
            response: attemptResult.response ?? null,
            status: attemptResult.error ? "error" : "completed",
            error: attemptResult.error ?? null,
          })
          .eq("id", logId);
      },
    });

    const allImages = [
      result.content.hero.image,
      result.content.about.image,
      ...result.content.gallery.items,
      result.content.seo.ogImage,
    ];
    await reportProgress({
      stage: "generation_completed",
      status: "completed",
      progress: 100,
      message: "Kompletne demo zostało wygenerowane i jest gotowe do sprawdzenia.",
      details: {
        provider: result.provider,
        model: result.model,
        sections: result.content.structure.filter((section) => section.visible).length,
        services: result.content.services.length,
        faqItems: result.content.faq.length,
        realImages: allImages.filter((image) => Boolean(image.url)).length,
        placeholders: allImages.filter((image) => !image.url).length,
      },
    });

    await supabase.from("activity_logs").insert({
      entity_type: "demo",
      entity_id: demo.id,
      action: "ai_generation_completed",
      description: "Wygenerowano treści AI",
      metadata: {
        provider: result.provider,
        model: result.model,
        industry: DEMO_INDUSTRY_LABELS[demo.industry as keyof typeof DEMO_INDUSTRY_LABELS] ?? demo.industry,
        style: DEMO_STYLE_LABELS[demo.style as keyof typeof DEMO_STYLE_LABELS] ?? demo.style,
      },
    });

    return { success: true, data: result };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nie udało się wygenerować treści AI.";
    await reportProgress?.({
      stage: "generation_failed",
      status: "error",
      progress: 100,
      message: "Generowanie zakończyło się błędem.",
      details: { error: message.slice(0, 1000) },
    });

    try {
      const supabase = await createSupabaseClient();
      await supabase.from("activity_logs").insert({
        entity_type: "demo",
        entity_id: parsed.data.demoId,
        action: "ai_generation_error",
        description: "Błąd generowania treści AI",
        metadata: { error: message },
      });
    } catch {
      // Best-effort activity logging.
    }

    return { success: false, error: message };
  }
}

export async function saveGeneratedDemoContentAction(input: {
  demoId: string;
  content: DemoContent;
  provider?: string;
  model?: string;
}): Promise<SaveGeneratedDemoContentState> {
  const parsed = aiSaveInputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Wygenerowane treści nie pasują do struktury demo." };
  }

  try {
    const { supabase } = await requireUser();
    const { data: demo, error: demoError } = await supabase
      .from("demos")
      .select("id, slug, status")
      .eq("id", parsed.data.demoId)
      .single();

    if (demoError || !demo) return { success: false, error: "Nie znaleziono demo." };

    const statusChanged = demo.status === "draft";
    const { error } = await supabase
      .from("demos")
      .update({
        content: parsed.data.content as unknown as Json,
        status: statusChanged ? "generated" : demo.status,
        is_active: true,
      })
      .eq("id", parsed.data.demoId);

    if (error) {
      return { success: false, error: `Nie udało się zapisać treści AI: ${error.message}` };
    }

    await supabase.from("activity_logs").insert({
      entity_type: "demo",
      entity_id: parsed.data.demoId,
      action: "ai_content_saved",
      description: "Zapisano treści AI do demo",
      metadata: {
        provider: parsed.data.provider ?? null,
        model: parsed.data.model ?? null,
        status_changed: statusChanged,
      },
    });

    revalidatePath(`/panel/demo/${parsed.data.demoId}`);
    revalidatePath("/panel/demo");
    revalidatePath(`/demo/${demo.slug}`);

    return { success: true, statusChanged };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Nie udało się zapisać treści AI.",
    };
  }
}
