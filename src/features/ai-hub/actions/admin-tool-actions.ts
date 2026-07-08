"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { aiRouter } from "@/lib/ai/router";
import { getToolById } from "@/features/ai-hub/tools";
import type { ToolResult } from "@/features/ai-hub/types";
import { revalidatePath } from "next/cache";

// ── Types ──────────────────────────────────────────────────────────────────
export type AIToolOutput = {
  id: string;
  created_at: string;
  updated_at: string;
  tool_id: string;
  tool_name: string;
  tool_category: string;
  input_values: Record<string, string>;
  output_text: string;
  provider: string;
  model: string;
  label: string | null;
  notes: string | null;
  status: "new" | "saved" | "archived";
  client_id: string | null;
  lead_id: string | null;
};

export type RunAdminToolState =
  | { success: true; output: AIToolOutput }
  | { success: false; error: string };

export type SaveActionState = { success: boolean; error?: string };

// ── Generate + auto-save ───────────────────────────────────────────────────
export async function runAdminToolAction(
  toolId: string,
  values: Record<string, string>
): Promise<RunAdminToolState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Brak autoryzacji." };

  const tool = getToolById(toolId);
  if (!tool) return { success: false, error: "Nieznane narzędzie." };

  const prompt = tool.buildPrompt(values);
  const task =
    toolId.includes("seo") || toolId.includes("wizytowki")
      ? ("seo_generation" as const)
      : ("content_generation" as const);

  let result: { text: string; provider: string; model: string };
  try {
    result = await aiRouter.generate({
      task,
      messages: [
        { role: "system", content: tool.systemPrompt },
        { role: "user", content: prompt },
      ],
      temperature: 0.72,
      maxTokens: 4000,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Błąd AI.";
    return { success: false, error: msg };
  }

  const { data, error } = await supabase
    .from("ai_tool_outputs")
    .insert({
      tool_id: toolId,
      tool_name: tool.name,
      tool_category: tool.category,
      input_values: values,
      output_text: result.text,
      provider: result.provider,
      model: result.model,
      status: "new",
    })
    .select()
    .single();

  if (error || !data) {
    return { success: false, error: "Nie udało się zapisać wyniku: " + (error?.message ?? "") };
  }

  revalidatePath("/panel/ai/wyniki");
  return { success: true, output: data as AIToolOutput };
}

// ── Update label/notes/status ──────────────────────────────────────────────
export async function updateToolOutputAction(
  id: string,
  patch: Partial<Pick<AIToolOutput, "label" | "notes" | "status">>
): Promise<SaveActionState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("ai_tool_outputs")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/panel/ai/wyniki");
  return { success: true };
}

// ── Assign to client ───────────────────────────────────────────────────────
export async function assignToolOutputToClientAction(
  outputId: string,
  clientId: string | null
): Promise<SaveActionState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("ai_tool_outputs")
    .update({ client_id: clientId, updated_at: new Date().toISOString() })
    .eq("id", outputId);
  if (error) return { success: false, error: error.message };
  revalidatePath("/panel/ai/wyniki");
  return { success: true };
}

// ── Update output text (edit) ──────────────────────────────────────────────
export async function updateOutputTextAction(
  id: string,
  text: string
): Promise<SaveActionState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("ai_tool_outputs")
    .update({ output_text: text, status: "saved", updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/panel/ai/wyniki");
  revalidatePath(`/panel/ai/wyniki/${id}`);
  return { success: true };
}

// ── Delete ─────────────────────────────────────────────────────────────────
export async function deleteToolOutputAction(id: string): Promise<SaveActionState> {
  const supabase = await createClient();
  const { error } = await supabase.from("ai_tool_outputs").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/panel/ai/wyniki");
  return { success: true };
}

// ── List all outputs ───────────────────────────────────────────────────────
export type ListOutputsFilter = {
  toolId?: string;
  status?: AIToolOutput["status"];
  clientId?: string;
  limit?: number;
};

export async function listToolOutputsAction(
  filter: ListOutputsFilter = {}
): Promise<AIToolOutput[]> {
  const supabase = await createClient();
  let q = supabase
    .from("ai_tool_outputs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(filter.limit ?? 100);

  if (filter.toolId) q = q.eq("tool_id", filter.toolId);
  if (filter.status) q = q.eq("status", filter.status);
  if (filter.clientId) q = q.eq("client_id", filter.clientId);

  const { data } = await q;
  return (data ?? []) as AIToolOutput[];
}

// ── Get single output ──────────────────────────────────────────────────────
export async function getToolOutputAction(id: string): Promise<AIToolOutput | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("ai_tool_outputs")
    .select("*")
    .eq("id", id)
    .single();
  return data as AIToolOutput | null;
}

// ── Regenerate (run again with same inputs) ────────────────────────────────
export async function regenerateToolOutputAction(
  id: string
): Promise<RunAdminToolState> {
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("ai_tool_outputs")
    .select("tool_id, input_values")
    .eq("id", id)
    .single();
  if (!existing) return { success: false, error: "Nie znaleziono wyniku." };
  return runAdminToolAction(existing.tool_id, existing.input_values as Record<string, string>);
}
