import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import type { Client, ClientNote, ClientActivity, ClientStatus } from "@/features/clients/types";
import { CLIENT_STATUSES } from "@/features/clients/types";

function escapeIlike(str: string) {
  return str.replace(/[%_\\]/g, "\\$&");
}

export async function getClients(params?: {
  q?: string;
  status?: string;
}): Promise<{ data: Client[]; error: string | null }> {
  const supabase = await createSupabaseClient();

  let query = supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

  if (params?.q?.trim()) {
    const safe = escapeIlike(params.q.trim());
    const like = `%${safe}%`;
    query = query.or(
      `first_name.ilike.${like},last_name.ilike.${like},company_name.ilike.${like},email.ilike.${like}`
    );
  }

  const statusParam = params?.status?.trim();
  if (statusParam && (CLIENT_STATUSES as readonly string[]).includes(statusParam)) {
    query = query.eq("status", statusParam as ClientStatus);
  }

  const { data, error } = await query;

  if (error) return { data: [], error: error.message };
  return { data: (data ?? []) as Client[], error: null };
}

export async function getClientById(
  id: string
): Promise<{ data: Client | null; error: string | null }> {
  const supabase = await createSupabaseClient();

  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return { data: null, error: error.message };
  return { data: data as Client, error: null };
}

export async function getClientNotes(
  clientId: string
): Promise<{ data: ClientNote[]; error: string | null }> {
  const supabase = await createSupabaseClient();

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });

  if (error) return { data: [], error: error.message };
  return { data: (data ?? []) as ClientNote[], error: null };
}

export async function getClientActivity(
  clientId: string,
  limit = 20
): Promise<{ data: ClientActivity[]; error: string | null }> {
  const supabase = await createSupabaseClient();

  const { data, error } = await supabase
    .from("activity_logs")
    .select("*")
    .eq("entity_type", "client")
    .eq("entity_id", clientId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return { data: [], error: error.message };
  return { data: (data ?? []) as ClientActivity[], error: null };
}

export async function getClientCount(): Promise<number> {
  const supabase = await createSupabaseClient();
  const { count } = await supabase
    .from("clients")
    .select("*", { count: "exact", head: true });
  return count ?? 0;
}

export async function getClientStatuses(): Promise<
  { status: ClientStatus; count: number }[]
> {
  const supabase = await createSupabaseClient();
  const { data } = await supabase.from("clients").select("status");

  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    counts[row.status] = (counts[row.status] ?? 0) + 1;
  }

  return Object.entries(counts).map(([status, count]) => ({
    status: status as ClientStatus,
    count,
  }));
}
