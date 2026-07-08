import { createAdminClient } from "@/lib/supabase/admin";
import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import {
  DEMO_INDUSTRIES,
  DEMO_STATUSES,
  type Demo,
  type DemoActivity,
  type DemoIndustry,
  type DemoStatus,
} from "@/features/demos/types";
import type { DemoEmailLog } from "@/features/emails/types";

function escapeIlike(str: string) {
  return str.replace(/[%_\\]/g, "\\$&");
}

export async function getDemos(params?: {
  q?: string;
  status?: string;
  industry?: string;
}): Promise<{ data: Demo[]; error: string | null }> {
  const supabase = await createSupabaseClient();

  let query = supabase
    .from("demos")
    .select("*, clients(first_name, last_name, company_name, email), estimates(id, website_type, final_price)")
    .order("created_at", { ascending: false });

  if (params?.q?.trim()) {
    const safe = escapeIlike(params.q.trim());
    const like = `%${safe}%`;
    query = query.or(`title.ilike.${like},slug.ilike.${like}`);
  }

  const status = params?.status?.trim();
  if (status && (DEMO_STATUSES as readonly string[]).includes(status)) {
    query = query.eq("status", status as DemoStatus);
  }

  const industry = params?.industry?.trim();
  if (industry && (DEMO_INDUSTRIES as readonly string[]).includes(industry)) {
    query = query.eq("industry", industry as DemoIndustry);
  }

  const { data, error } = await query;
  if (error) return { data: [], error: error.message };
  return { data: (data ?? []) as Demo[], error: null };
}

export async function getDemoById(id: string): Promise<{ data: Demo | null; error: string | null }> {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase
    .from("demos")
    .select("*, clients(first_name, last_name, company_name, email), estimates(id, website_type, final_price)")
    .eq("id", id)
    .single();

  if (error) return { data: null, error: error.message };
  return { data: data as Demo, error: null };
}

export async function getDemosByClientId(clientId: string) {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase
    .from("demos")
    .select("*, clients(first_name, last_name, company_name, email), estimates(id, website_type, final_price)")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });

  if (error) return { data: [] as Demo[], error: error.message };
  return { data: (data ?? []) as Demo[], error: null };
}

export async function getDemosByEstimateId(estimateId: string) {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase
    .from("demos")
    .select("*, clients(first_name, last_name, company_name, email), estimates(id, website_type, final_price)")
    .eq("estimate_id", estimateId)
    .order("created_at", { ascending: false });

  if (error) return { data: [] as Demo[], error: error.message };
  return { data: (data ?? []) as Demo[], error: null };
}

export async function getDemoActivity(demoId: string, limit = 30) {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase
    .from("activity_logs")
    .select("id, created_at, action, description, metadata")
    .eq("entity_type", "demo")
    .eq("entity_id", demoId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return { data: [] as DemoActivity[], error: error.message };
  return { data: (data ?? []) as DemoActivity[], error: null };
}

export async function getDemoEmailLogs(demoId: string, limit = 20) {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase
    .from("email_logs")
    .select("id, created_at, client_id, demo_id, to_email, subject, body, provider, status, error")
    .eq("demo_id", demoId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return { data: [] as DemoEmailLog[], error: error.message };
  return { data: (data ?? []) as DemoEmailLog[], error: null };
}

export async function getPublicDemoBySlug(slug: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("demos")
    .select("*, clients(first_name, last_name, company_name, email)")
    .eq("slug", slug)
    .single();

  if (error) return { data: null as Demo | null, error: error.message };
  return { data: data as Demo, error: null };
}

export async function trackPublicDemoView(demo: Demo) {
  const supabase = createAdminClient();
  const now = new Date().toISOString();
  const nextStatus = demo.status === "sent" ? "viewed" : demo.status;

  const { error } = await supabase
    .from("demos")
    .update({
      views_count: (demo.views_count ?? 0) + 1,
      first_viewed_at: demo.first_viewed_at ?? now,
      status: nextStatus,
    })
    .eq("id", demo.id);

  if (error) return { error: error.message };

  await supabase.from("activity_logs").insert({
    entity_type: "demo",
    entity_id: demo.id,
    action: "viewed",
    description: "Publiczne demo zostało otwarte przez klienta",
    metadata: { slug: demo.slug, previous_status: demo.status, status: nextStatus },
  });

  return { error: null };
}

export async function isDemoSlugTaken(slug: string, exceptId?: string) {
  const supabase = await createSupabaseClient();
  let query = supabase.from("demos").select("id").eq("slug", slug).limit(1);
  if (exceptId) query = query.neq("id", exceptId);
  const { data, error } = await query;
  if (error) return true;
  return (data ?? []).length > 0;
}

export function isPastIsoDate(iso: string) {
  return Date.now() > Date.parse(iso);
}
