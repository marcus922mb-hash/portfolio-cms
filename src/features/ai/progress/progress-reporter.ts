import "server-only";

import type { AIProgressReporter } from "@/lib/ai/progress";
import type { createClient } from "@/lib/supabase/server";
import type { Json } from "@/types/database";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

export function createProgressReporter(
  supabase: SupabaseServerClient,
  demoId: string,
  runId: string
): AIProgressReporter {
  let sequence = 0;

  return async (update) => {
    sequence += 1;
    const { error } = await supabase.from("activity_logs").insert({
      entity_type: "demo",
      entity_id: demoId,
      action: "ai_generation_progress",
      description: update.message,
      metadata: {
        run_id: runId,
        sequence,
        stage: update.stage,
        status: update.status,
        progress: Math.min(100, Math.max(0, Math.round(update.progress))),
        details: update.details ?? {},
      } as Json,
    });

    if (error) {
      console.error("[ai-progress] Nie udało się zapisać zdarzenia", {
        demoId,
        runId,
        stage: update.stage,
        error: error.message,
      });
    }
  };
}

