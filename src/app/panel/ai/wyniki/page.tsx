import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AdminResultsTable } from "@/features/ai-hub/components/admin-results-table";
import { TOOL_CATEGORIES } from "@/features/ai-hub/tools";
import type { AIToolOutput } from "@/features/ai-hub/actions/admin-tool-actions";

export const metadata: Metadata = { title: "Wyniki AI" };
export const dynamic = "force-dynamic";

async function getOutputs(): Promise<AIToolOutput[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("ai_tool_outputs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);
  return (data ?? []) as AIToolOutput[];
}

async function getClients() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("clients")
    .select("id, first_name, last_name, company_name")
    .order("last_name");
  return (data ?? []).map((c) => ({
    id: c.id,
    label: c.company_name
      ? `${c.company_name} (${c.first_name} ${c.last_name})`
      : `${c.first_name} ${c.last_name}`,
  }));
}

async function getStats() {
  const supabase = await createClient();
  const { data } = await supabase.from("ai_tool_outputs").select("status, tool_id, tool_category");
  const total = data?.length ?? 0;
  const saved = data?.filter((r) => r.status === "saved").length ?? 0;
  const byCategory: Record<string, number> = {};
  for (const r of data ?? []) {
    byCategory[r.tool_category] = (byCategory[r.tool_category] ?? 0) + 1;
  }
  return { total, saved, byCategory };
}

export default async function PanelAIWynikiPage() {
  const [outputs, clients, stats] = await Promise.all([
    getOutputs(),
    getClients(),
    getStats(),
  ]);

  return (
    <>
      <div className="crm-page-header">
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link href="/panel/ai/narzedzia" className="crm-btn crm-btn--sm">
            <ArrowLeft size={13} />
          </Link>
          <div>
            <h1 className="crm-page-title">Wyniki AI</h1>
            <p className="crm-page-desc">Wszystkie wygenerowane treści — zarządzanie i archiwum</p>
          </div>
        </div>
        <Link href="/panel/ai/narzedzia" className="crm-btn crm-btn--primary crm-btn--sm">
          <Sparkles size={13} />
          Nowe generowanie
        </Link>
      </div>

      {/* Stats */}
      <div className="crm-stats-row" style={{ marginBottom: "1.5rem" }}>
        <div className="panel-card crm-stat-card">
          <span className="crm-stat-label">Łącznie wyników</span>
          <span className="crm-stat-value">{stats.total}</span>
        </div>
        <div className="panel-card crm-stat-card">
          <span className="crm-stat-label">Zapisanych</span>
          <span className="crm-stat-value" style={{ color: "#4caf7a" }}>{stats.saved}</span>
        </div>
        {Object.entries(stats.byCategory)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 2)
          .map(([cat, count]) => (
            <div key={cat} className="panel-card crm-stat-card">
              <span className="crm-stat-label">{TOOL_CATEGORIES[cat] ?? cat}</span>
              <span className="crm-stat-value">{count}</span>
            </div>
          ))}
      </div>

      {/* Table */}
      <div className="panel-card">
        <div className="panel-card-header">
          <span className="panel-card-title">Wygenerowane treści ({outputs.length})</span>
        </div>
        <div className="panel-card-body" style={{ padding: 0 }}>
          <AdminResultsTable outputs={outputs} clients={clients} />
        </div>
      </div>
    </>
  );
}
