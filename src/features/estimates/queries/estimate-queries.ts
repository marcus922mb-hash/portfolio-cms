import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import type { Estimate, EstimateStatus, EstimateType } from "@/features/estimates/types";
import { ESTIMATE_STATUSES, WEBSITE_TYPES } from "@/features/estimates/types";

function escapeIlike(str: string) {
  return str.replace(/[%_\\]/g, "\\$&");
}

export async function getEstimates(params?: {
  q?: string;
  status?: string;
  type?: string;
}): Promise<{ data: Estimate[]; error: string | null }> {
  const supabase = await createSupabaseClient();

  let query = supabase
    .from("estimates")
    .select("*, clients(first_name, last_name, company_name)")
    .order("created_at", { ascending: false });

  if (params?.q?.trim()) {
    const safe = escapeIlike(params.q.trim());
    const like = `%${safe}%`;
    query = query.or(
      `clients.first_name.ilike.${like},clients.last_name.ilike.${like},clients.company_name.ilike.${like}`
    );
  }

  const statusParam = params?.status?.trim();
  if (statusParam && (ESTIMATE_STATUSES as readonly string[]).includes(statusParam)) {
    query = query.eq("status", statusParam as EstimateStatus);
  }

  const typeParam = params?.type?.trim();
  if (typeParam && (WEBSITE_TYPES as readonly string[]).includes(typeParam)) {
    query = query.eq("website_type", typeParam as EstimateType);
  }

  const { data, error } = await query;

  if (error) return { data: [], error: error.message };
  return { data: (data ?? []) as Estimate[], error: null };
}

export async function getEstimateById(
  id: string
): Promise<{ data: Estimate | null; error: string | null }> {
  const supabase = await createSupabaseClient();

  const { data, error } = await supabase
    .from("estimates")
    .select("*, clients(first_name, last_name, company_name)")
    .eq("id", id)
    .single();

  if (error) return { data: null, error: error.message };
  return { data: data as Estimate, error: null };
}

export async function getEstimatesByClientId(
  clientId: string
): Promise<{ data: Estimate[]; error: string | null }> {
  const supabase = await createSupabaseClient();

  const { data, error } = await supabase
    .from("estimates")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });

  if (error) return { data: [], error: error.message };
  return { data: (data ?? []) as Estimate[], error: null };
}

export async function getEstimateCount(): Promise<number> {
  const supabase = await createSupabaseClient();
  const { count } = await supabase
    .from("estimates")
    .select("*", { count: "exact", head: true });
  return count ?? 0;
}

export async function getEstimateActivity(
  estimateId: string,
  limit = 20
): Promise<{ data: { id: string; created_at: string; action: string; description: string | null }[]; error: string | null }> {
  const supabase = await createSupabaseClient();

  const { data, error } = await supabase
    .from("activity_logs")
    .select("id, created_at, action, description")
    .eq("entity_type", "estimate")
    .eq("entity_id", estimateId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return { data: [], error: error.message };
  return { data: data ?? [], error: null };
}
