"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { estimateSchema } from "@/features/estimates/schemas/estimate-schema";
import type { EstimateStatus } from "@/features/estimates/types";
import { ESTIMATE_STATUS_LABELS, WEBSITE_TYPE_LABELS } from "@/features/estimates/types";

export type EstimateActionState = {
  error?: string;
  fieldErrors?: Partial<Record<string, string[]>>;
} | null;

export type StatusActionState = {
  error?: string;
  success?: boolean;
} | null;

// ── Tworzenie wyceny ──────────────────────────────────────────

export async function createEstimateAction(
  _prevState: EstimateActionState,
  formData: FormData
): Promise<EstimateActionState> {
  const supabase = await createSupabaseClient();

  const parsed = estimateSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return {
      error: "Formularz zawiera błędy — sprawdź pola poniżej.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const d = parsed.data;

  const { data: estimate, error } = await supabase
    .from("estimates")
    .insert({
      client_id: d.client_id,
      website_type: d.website_type,
      pages_count: d.pages_count,
      needs_wordpress: d.needs_wordpress,
      needs_woocommerce: d.needs_woocommerce,
      needs_nextjs: d.needs_nextjs,
      needs_seo: d.needs_seo,
      needs_ai: d.needs_ai,
      needs_copywriting: d.needs_copywriting,
      needs_branding: d.needs_branding,
      needs_maintenance: d.needs_maintenance,
      base_price: d.base_price,
      final_price: d.final_price,
      status: d.status,
      notes: d.notes || null,
    })
    .select("id, website_type")
    .single();

  if (error) {
    return { error: `Nie udało się zapisać wyceny: ${error.message}` };
  }

  await supabase.from("activity_logs").insert({
    entity_type: "estimate",
    entity_id: estimate.id,
    action: "created",
    description: `Utworzono wycenę: ${WEBSITE_TYPE_LABELS[estimate.website_type as keyof typeof WEBSITE_TYPE_LABELS] ?? estimate.website_type}`,
  });

  redirect(`/panel/wyceny/${estimate.id}`);
}

// ── Edycja wyceny ─────────────────────────────────────────────

export async function updateEstimateAction(
  estimateId: string,
  _prevState: EstimateActionState,
  formData: FormData
): Promise<EstimateActionState> {
  const supabase = await createSupabaseClient();

  const parsed = estimateSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return {
      error: "Formularz zawiera błędy — sprawdź pola poniżej.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const d = parsed.data;
  const prevFinalPrice = formData.get("_prev_final_price");

  const { data: estimate, error } = await supabase
    .from("estimates")
    .update({
      client_id: d.client_id,
      website_type: d.website_type,
      pages_count: d.pages_count,
      needs_wordpress: d.needs_wordpress,
      needs_woocommerce: d.needs_woocommerce,
      needs_nextjs: d.needs_nextjs,
      needs_seo: d.needs_seo,
      needs_ai: d.needs_ai,
      needs_copywriting: d.needs_copywriting,
      needs_branding: d.needs_branding,
      needs_maintenance: d.needs_maintenance,
      base_price: d.base_price,
      final_price: d.final_price,
      status: d.status,
      notes: d.notes || null,
    })
    .eq("id", estimateId)
    .select("id, website_type, final_price")
    .single();

  if (error) {
    return { error: `Nie udało się zaktualizować wyceny: ${error.message}` };
  }

  await supabase.from("activity_logs").insert({
    entity_type: "estimate",
    entity_id: estimate.id,
    action: "updated",
    description: `Zaktualizowano wycenę`,
  });

  const prevPrice = prevFinalPrice ? Number(prevFinalPrice) : null;
  if (prevPrice !== null && prevPrice !== estimate.final_price) {
    await supabase.from("activity_logs").insert({
      entity_type: "estimate",
      entity_id: estimate.id,
      action: "price_changed",
      description: `Zmieniono cenę finalną: ${prevPrice} zł → ${estimate.final_price} zł`,
      metadata: { prev_price: prevPrice, new_price: estimate.final_price },
    });
  }

  revalidatePath(`/panel/wyceny/${estimateId}`);
  redirect(`/panel/wyceny/${estimateId}`);
}

// ── Zmiana statusu wyceny ──────────────────────────────────────

export async function updateEstimateStatusAction(
  estimateId: string,
  _prevState: StatusActionState,
  formData: FormData
): Promise<StatusActionState> {
  const newStatus = formData.get("status") as EstimateStatus | null;

  if (!newStatus) return { error: "Brak statusu." };

  const supabase = await createSupabaseClient();

  const { error } = await supabase
    .from("estimates")
    .update({ status: newStatus })
    .eq("id", estimateId);

  if (error) return { error: `Nie udało się zmienić statusu: ${error.message}` };

  await supabase.from("activity_logs").insert({
    entity_type: "estimate",
    entity_id: estimateId,
    action: "status_changed",
    description: `Zmieniono status na: ${ESTIMATE_STATUS_LABELS[newStatus]}`,
    metadata: { status: newStatus },
  });

  revalidatePath(`/panel/wyceny/${estimateId}`);
  return { success: true };
}
