import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { getClientDisplayName, getClientInitials, type ClientStatus } from "@/features/clients/types";
import {
  ESTIMATE_STATUS_LABELS,
  WEBSITE_TYPE_LABELS,
  type EstimateStatus,
} from "@/features/estimates/types";
import type { RecentItem } from "@/components/dashboard/recent-table";

type ActivityType = "client" | "estimate" | "demo" | "project";

type RecentEstimateRow = {
  id: string;
  created_at: string;
  website_type: string;
  final_price: number | null;
  status: EstimateStatus;
  clients: { first_name: string; last_name: string; company_name: string | null } | null;
};

type RecentClientRow = {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  company_name: string | null;
  email: string | null;
  status: ClientStatus;
};

export type DashboardActivityItem = {
  id: string;
  type: ActivityType;
  label: string;
  time: string;
};

type ActivityLogRow = {
  id: string;
  created_at: string;
  entity_type: string;
  action: string;
  description: string | null;
};

export type DashboardData = {
  stats: {
    clients: number;
    projects: number;
    estimates: number;
    demos: number;
    pendingEstimates: number;
    activeDemos: number;
    aiOutputs: number;
    aiErrors: number;
  };
  activity: DashboardActivityItem[];
  recentClients: RecentItem[];
  recentEstimates: RecentItem[];
  recentAIOutputs: { id: string; tool_name: string; created_at: string; provider: string }[];
};

function formatRelativeTime(value: string) {
  const diff = Date.now() - new Date(value).getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) return "teraz";
  if (diff < hour) return `${Math.max(1, Math.floor(diff / minute))} min temu`;
  if (diff < day) return `${Math.max(1, Math.floor(diff / hour))} godz. temu`;
  if (diff < 2 * day) return "wczoraj";
  return `${Math.max(2, Math.floor(diff / day))} dni temu`;
}

function activityType(entityType: string): ActivityType {
  if (entityType === "estimate") return "estimate";
  if (entityType === "demo") return "demo";
  if (entityType === "project") return "project";
  return "client";
}

function estimateBadge(status: EstimateStatus) {
  if (status === "accepted") return "completed";
  if (status === "sent" || status === "prepared") return "pending";
  return "lead";
}

export async function getDashboardData(): Promise<{ data: DashboardData; error: string | null }> {
  const supabase = await createSupabaseClient();

  const [
    clientsCount,
    projectsCount,
    estimatesCount,
    demosCount,
    pendingEstimatesCount,
    activeDemosCount,
    aiOutputsCount,
    aiErrorsCount,
    activityResult,
    clientsResult,
    estimatesResult,
    recentAIResult,
  ] = await Promise.all([
    supabase.from("clients").select("id", { count: "exact", head: true }),
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("estimates").select("id", { count: "exact", head: true }),
    supabase.from("demos").select("id", { count: "exact", head: true }),
    supabase
      .from("estimates")
      .select("id", { count: "exact", head: true })
      .in("status", ["prepared", "sent"]),
    supabase
      .from("demos")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true),
    supabase.from("ai_tool_outputs").select("id", { count: "exact", head: true }),
    supabase
      .from("ai_generations")
      .select("id", { count: "exact", head: true })
      .eq("status", "error"),
    supabase
      .from("activity_logs")
      .select("id, created_at, entity_type, action, description")
      .order("created_at", { ascending: false })
      .limit(6),
    supabase
      .from("clients")
      .select("id, created_at, first_name, last_name, company_name, email, status")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("estimates")
      .select("id, created_at, website_type, final_price, status, clients(first_name, last_name, company_name)")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("ai_tool_outputs")
      .select("id, tool_name, created_at, provider")
      .order("created_at", { ascending: false })
      .limit(4),
  ]);

  const error =
    clientsCount.error ??
    projectsCount.error ??
    estimatesCount.error ??
    demosCount.error ??
    pendingEstimatesCount.error ??
    activeDemosCount.error ??
    activityResult.error ??
    clientsResult.error ??
    estimatesResult.error;

  const emptyData: DashboardData = {
    stats: {
      clients: 0,
      projects: 0,
      estimates: 0,
      demos: 0,
      pendingEstimates: 0,
      activeDemos: 0,
      aiOutputs: 0,
      aiErrors: 0,
    },
    activity: [],
    recentClients: [],
    recentEstimates: [],
    recentAIOutputs: [],
  };

  if (error) {
    return { data: emptyData, error: error.message };
  }

  const activity = ((activityResult.data ?? []) as ActivityLogRow[]).map((item) => ({
    id: item.id,
    type: activityType(item.entity_type),
    label: item.description || item.action,
    time: formatRelativeTime(item.created_at),
  }));

  const recentClients = (clientsResult.data ?? [] as RecentClientRow[]).map((client) => ({
    id: client.id,
    initials: getClientInitials(client),
    name: getClientDisplayName(client),
    meta: `${client.email || "brak e-maila"} - ${formatRelativeTime(client.created_at)}`,
    badge: client.status === ("new" satisfies ClientStatus) ? "lead" : "active",
    badgeLabel: client.status === "new" ? "Lead" : "Klient",
  })) satisfies RecentItem[];

  const recentEstimates = (estimatesResult.data ?? [] as RecentEstimateRow[]).map((estimate) => {
    const status = estimate.status;

    return {
      id: estimate.id,
      initials: "#",
      name: `${WEBSITE_TYPE_LABELS[estimate.website_type as keyof typeof WEBSITE_TYPE_LABELS] ?? estimate.website_type} - ${estimate.clients ? [estimate.clients.first_name, estimate.clients.last_name].filter(Boolean).join(" ") : "—"}`,
      meta: `${estimate.final_price ? `${estimate.final_price} zł` : "bez ceny"} - ${formatRelativeTime(estimate.created_at)}`,
      badge: estimateBadge(status),
      badgeLabel: ESTIMATE_STATUS_LABELS[status] ?? status,
    };
  }) satisfies RecentItem[];

  return {
    data: {
      stats: {
        clients: clientsCount.count ?? 0,
        projects: projectsCount.count ?? 0,
        estimates: estimatesCount.count ?? 0,
        demos: demosCount.count ?? 0,
        pendingEstimates: pendingEstimatesCount.count ?? 0,
        activeDemos: activeDemosCount.count ?? 0,
        aiOutputs: aiOutputsCount.count ?? 0,
        aiErrors: aiErrorsCount.count ?? 0,
      },
      activity,
      recentClients,
      recentEstimates,
      recentAIOutputs: (recentAIResult.data ?? []) as { id: string; tool_name: string; created_at: string; provider: string }[],
    },
    error: null,
  };
}
