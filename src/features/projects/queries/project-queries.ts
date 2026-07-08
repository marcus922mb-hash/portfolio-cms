import { createClient } from "@/lib/supabase/server";
import type { Project, ProjectStatus } from "@/features/projects/types";
import { PROJECT_STATUSES } from "@/features/projects/types";

export async function getProjects(params?: {
  q?: string;
  status?: string;
}): Promise<{ data: Project[]; error: string | null }> {
  const supabase = await createClient();

  let query = supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (params?.q?.trim()) {
    const safe = params.q.trim().replace(/[%_\\]/g, "\\$&");
    query = query.ilike("name", `%${safe}%`);
  }

  const statusParam = params?.status?.trim();
  if (statusParam && (PROJECT_STATUSES as readonly string[]).includes(statusParam)) {
    query = query.eq("status", statusParam as ProjectStatus);
  }

  const { data, error } = await query;
  if (error) return { data: [], error: error.message };
  return { data: (data ?? []) as Project[], error: null };
}

export async function getProjectById(
  id: string
): Promise<{ data: Project | null; error: string | null }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return { data: null, error: error.message };
  return { data: data as Project, error: null };
}

export async function getProjectsByClientId(
  clientId: string
): Promise<{ data: Project[]; error: string | null }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });
  if (error) return { data: [], error: error.message };
  return { data: (data ?? []) as Project[], error: null };
}

export async function getUpcomingDeadlines(limit = 5): Promise<
  Array<{ id: string; name: string; deadline: string; status: ProjectStatus }>
> {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];
  const { data } = await supabase
    .from("projects")
    .select("id, name, deadline, status")
    .not("deadline", "is", null)
    .gte("deadline", today)
    .not("status", "eq", "closed")
    .order("deadline", { ascending: true })
    .limit(limit);
  return (data ?? []) as Array<{ id: string; name: string; deadline: string; status: ProjectStatus }>;
}

export async function getProjectCount(): Promise<number> {
  const supabase = await createClient();
  const { count } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true });
  return count ?? 0;
}
