import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import type {
  WordPressConnectionOption,
  WooCommerceActivity,
  WooCommerceConnection,
} from "@/features/woocommerce/types";

export async function getWooCommerceConnections() {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase
    .from("woocommerce_connections")
    .select("*, clients(first_name, last_name, company_name)")
    .order("created_at", { ascending: false });

  if (error) return { data: [] as WooCommerceConnection[], error: error.message };

  const connections = (data ?? []) as WooCommerceConnection[];
  const ids = connections.map((item) => item.id);

  if (ids.length === 0) {
    return { data: connections, error: null };
  }

  const { data: activityLogs } = await supabase
    .from("activity_logs")
    .select("entity_id, created_at, metadata")
    .eq("entity_type", "woocommerce_connection")
    .in("entity_id", ids)
    .order("created_at", { ascending: false });

  const counts = new Map<string, number>();

  for (const log of activityLogs ?? []) {
    if (!log.entity_id || counts.has(log.entity_id)) continue;
    const metadata = log.metadata as { product_count?: number } | null;
    if (typeof metadata?.product_count === "number") {
      counts.set(log.entity_id, metadata.product_count);
    }
  }

  return {
    data: connections.map((item) => ({
      ...item,
      last_product_count: counts.get(item.id) ?? null,
    })),
    error: null,
  };
}

export async function getWooCommerceConnectionById(id: string) {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase
    .from("woocommerce_connections")
    .select("*, clients(first_name, last_name, company_name)")
    .eq("id", id)
    .single();

  if (error) return { data: null as WooCommerceConnection | null, error: error.message };

  const connection = data as WooCommerceConnection;
  let wordpressConnection: WooCommerceConnection["wordpress_connection"] = null;

  if (connection.wordpress_connection_id) {
    // wordpress_connections is not in generated Supabase types yet
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wpResult = await (supabase as any)
      .from("wordpress_connections")
      .select("*")
      .eq("id", connection.wordpress_connection_id)
      .single();

    if (!wpResult.error && wpResult.data) {
      wordpressConnection = {
        id: wpResult.data.id,
        name: wpResult.data.name,
        site_url: wpResult.data.site_url,
        status: wpResult.data.status,
      };
    }
  }

  return {
    data: {
      ...connection,
      wordpress_connection: wordpressConnection,
    },
    error: null,
  };
}

export async function getWooCommerceConnectionRawById(id: string) {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase
    .from("woocommerce_connections")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return { data: null as WooCommerceConnection | null, error: error.message };
  return { data: data as WooCommerceConnection, error: null };
}

export async function getWooCommerceConnectionActivity(connectionId: string, limit = 20) {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase
    .from("activity_logs")
    .select("id, created_at, action, description, metadata")
    .eq("entity_type", "woocommerce_connection")
    .eq("entity_id", connectionId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return { data: [] as WooCommerceActivity[], error: error.message };
  return { data: (data ?? []) as WooCommerceActivity[], error: null };
}

export async function getWooCommerceConnectionsByClientId(clientId: string) {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase
    .from("woocommerce_connections")
    .select("*, clients(first_name, last_name, company_name)")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });

  if (error) return { data: [] as WooCommerceConnection[], error: error.message };
  return { data: (data ?? []) as WooCommerceConnection[], error: null };
}

export async function getWordPressConnectionOptions() {
  const supabase = await createSupabaseClient();

  try {
    // wordpress_connections is not in generated Supabase types yet
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from("wordpress_connections")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return { data: [] as WordPressConnectionOption[], error: error.message };

    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: (data ?? []).map((item: any) => ({
        id: item.id,
        client_id: item.client_id ?? null,
        name: item.name ?? null,
        site_url: item.site_url,
        status: item.status ?? "draft",
      })) as WordPressConnectionOption[],
      error: null,
    };
  } catch {
    return { data: [] as WordPressConnectionOption[], error: null };
  }
}
