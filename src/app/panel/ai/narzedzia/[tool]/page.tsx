import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getToolById, TOOL_CATEGORIES } from "@/features/ai-hub/tools";
import { AdminToolWorkspace } from "@/features/ai-hub/components/admin-tool-workspace";
import { DeployableChatWorkspace } from "@/features/ai-hub/components/deployable-chat-workspace";
import { createClient } from "@/lib/supabase/server";

type Props = { params: Promise<{ tool: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tool: toolId } = await params;
  const tool = getToolById(toolId);
  return { title: tool ? tool.name : "Narzędzie AI" };
}

async function getRecentOutputs(toolId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("ai_tool_outputs")
    .select("id, created_at, label, status, provider")
    .eq("tool_id", toolId)
    .order("created_at", { ascending: false })
    .limit(5);
  return data ?? [];
}

export default async function PanelToolPage({ params }: Props) {
  const { tool: toolId } = await params;
  const tool = getToolById(toolId);
  if (!tool) notFound();

  const recent = await getRecentOutputs(toolId);
  const categoryLabel = TOOL_CATEGORIES[tool.category] ?? tool.category;

  return (
    <>
      <div className="crm-page-header">
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link href="/panel/ai/narzedzia" className="crm-btn crm-btn--sm">
            <ArrowLeft size={13} />
          </Link>
          <div>
            <p style={{ fontSize: ".65rem", color: "rgba(232,232,232,.4)", marginBottom: ".2rem", textTransform: "uppercase", letterSpacing: ".1em" }}>
              {categoryLabel}
            </p>
            <h1 className="crm-page-title">{tool.name}</h1>
          </div>
        </div>
        <Link
          href={`/narzedzia-ai/${toolId}`}
          target="_blank"
          className="crm-btn crm-btn--sm"
          title="Podgląd publiczny"
        >
          <ExternalLink size={13} />
          Publiczny
        </Link>
      </div>

      <p className="crm-page-desc" style={{ marginBottom: "1.5rem" }}>{tool.description}</p>

      <div className="crm-detail-layout">
        <div className="crm-detail-main">
          <div className="panel-card">
            <div className="panel-card-header">
              <span className="panel-card-title">Generator</span>
            </div>
            <div className="panel-card-body">
              {tool.id === "generator-czatu-ai" ? (
                <DeployableChatWorkspace />
              ) : (
                <AdminToolWorkspace tool={{ id: tool.id, fields: tool.fields }} />
              )}
            </div>
          </div>
        </div>

        <div className="crm-detail-sidebar">
          {/* Hint */}
          <div className="panel-card" style={{ marginBottom: "1rem" }}>
            <div className="panel-card-header">
              <span className="panel-card-title">Przykładowy wynik</span>
            </div>
            <div className="panel-card-body">
              <pre className="pa-snippet">{tool.exampleSnippet}</pre>
            </div>
          </div>

          {/* Recent outputs */}
          {recent.length > 0 && (
            <div className="panel-card">
              <div className="panel-card-header">
                <span className="panel-card-title">Ostatnie wyniki</span>
                <Link href="/panel/ai/wyniki" className="crm-action-link">Wszystkie</Link>
              </div>
              <div className="panel-card-body" style={{ padding: 0 }}>
                {recent.map((r) => (
                  <div key={r.id} className="pa-recent-item">
                    <div>
                      <p style={{ fontSize: ".75rem", fontWeight: 600 }}>
                        {r.label ?? "Bez nazwy"}
                      </p>
                      <p className="crm-td-muted" style={{ fontSize: ".65rem" }}>
                        {new Date(r.created_at).toLocaleString("pl-PL", {
                          day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit",
                        })} · {r.provider}
                      </p>
                    </div>
                    <span className={`crm-badge crm-badge--sm ai-badge--${r.status === "saved" ? "completed" : r.status === "new" ? "pending" : "error"}`}>
                      {r.status === "saved" ? "Zapisany" : r.status === "new" ? "Nowy" : "Arch."}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
