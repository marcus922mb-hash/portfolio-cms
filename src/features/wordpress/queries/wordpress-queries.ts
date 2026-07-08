import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import {
  WP_CONNECTION_STATUSES,
  type WordPressConnection,
  type WPConnectionActivity,
  type WPConnectionStatus,
} from "@/features/wordpress/types";

export async function getWordPressConnections(): Promise<{
  data: WordPressConnection[];
  error: string | null;
}> {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase
    .from("wordpress_connections")
    .select("*, clients(first_name, last_name, company_name)")
    .order("created_at", { ascending: false });

  if (error) return { data: [], error: error.message };
  return { data: (data ?? []) as WordPressConnection[], error: null };
}

export async function getWordPressConnectionById(id: string): Promise<{
  data: WordPressConnection | null;
  error: string | null;
}> {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase
    .from("wordpress_connections")
    .select("*, clients(first_name, last_name, company_name)")
    .eq("id", id)
    .single();

  if (error) return { data: null, error: error.message };
  return { data: data as WordPressConnection, error: null };
}

export async function getWordPressConnectionsByClientId(clientId: string): Promise<{
  data: WordPressConnection[];
  error: string | null;
}> {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase
    .from("wordpress_connections")
    .select("id, created_at, updated_at, client_id, name, site_url, api_base_url, auth_type, username, status, last_sync_at, notes, clients(first_name, last_name, company_name)")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });

  if (error) return { data: [], error: error.message };
  return { data: (data ?? []) as WordPressConnection[], error: null };
}

export async function getWordPressConnectionActivity(
  connectionId: string,
  limit = 20
): Promise<{ data: WPConnectionActivity[]; error: string | null }> {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase
    .from("activity_logs")
    .select("id, created_at, action, description")
    .eq("entity_type", "wordpress_connection")
    .eq("entity_id", connectionId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return { data: [], error: error.message };
  return { data: (data ?? []) as WPConnectionActivity[], error: null };
}

export async function getWordPressConnectionCount(): Promise<number> {
  const supabase = await createSupabaseClient();
  const { count } = await supabase
    .from("wordpress_connections")
    .select("id", { count: "exact", head: true });
  return count ?? 0;
}

export async function getWordPressConnectionRawById(id: string) {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase
    .from("wordpress_connections")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}
