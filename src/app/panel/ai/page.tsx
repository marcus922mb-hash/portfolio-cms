import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, XCircle, Sparkles, Layout, Zap } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getAIModelConfig, AI_PROVIDER_FALLBACK_ORDER } from "@/lib/ai/model-config";
import type { AIGenerationLog, AIProvider } from "@/lib/ai/types";

export const metadata: Metadata = { title: "AI" };

const PROVIDER_LABELS: Record<AIProvider, string> = {
  openrouter: "OpenRouter",
  gemini: "Google Gemini",
  groq: "Groq",
  cloudflare: "Cloudflare Workers AI",
  local: "Model lokalny",
};

async function getRecentGenerations(): Promise<AIGenerationLog[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("ai_generations")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(15);
  return (data ?? []) as AIGenerationLog[];
}

async function getGenerationStats() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("ai_generations")
    .select("status, provider");

  const total = data?.length ?? 0;
  const completed = data?.filter((r) => r.status === "completed").length ?? 0;
  const errors = data?.filter((r) => r.status === "error").length ?? 0;

  const byProvider: Record<string, number> = {};
  for (const row of data ?? []) {
    byProvider[row.provider] = (byProvider[row.provider] ?? 0) + 1;
  }

  return { total, completed, errors, byProvider };
}

export default async function PanelAIPage() {
  const [generations, stats] = await Promise.all([
    getRecentGenerations(),
    getGenerationStats(),
  ]);

  const providers = AI_PROVIDER_FALLBACK_ORDER.map((p) => ({
    id: p,
    label: PROVIDER_LABELS[p],
    config: getAIModelConfig(p),
  }));

  const activeProvider = providers.find((p) => p.config.enabled);

  return (
    <>
      <div className="crm-page-header">
        <div>
          <h1 className="crm-page-title">AI</h1>
          <p className="crm-page-desc">Generowanie treści dla demo stron i opisów projektów</p>
        </div>
        <Link href="/panel/demo" className="crm-btn crm-btn--primary crm-btn--sm">
          <Layout size={13} />
          Przejdź do Demo
        </Link>
      </div>

      {/* Stats */}
      <div className="crm-stats-row" style={{ marginBottom: "1.5rem" }}>
        <div className="panel-card crm-stat-card">
          <span className="crm-stat-label">Łączne generowania</span>
          <span className="crm-stat-value">{stats.total}</span>
        </div>
        <div className="panel-card crm-stat-card">
          <span className="crm-stat-label">Zakończone</span>
          <span className="crm-stat-value" style={{ color: "#4caf7a" }}>{stats.completed}</span>
        </div>
        <div className="panel-card crm-stat-card">
          <span className="crm-stat-label">Błędy</span>
          <span className="crm-stat-value" style={{ color: stats.errors > 0 ? "#e05555" : undefined }}>{stats.errors}</span>
        </div>
        <div className="panel-card crm-stat-card">
          <span className="crm-stat-label">Aktywny provider</span>
          <span className="crm-stat-value" style={{ fontSize: "1rem" }}>
            {activeProvider ? activeProvider.label : "—"}
          </span>
        </div>
      </div>

      <div className="crm-detail-layout">
        <div className="crm-detail-main">
          {/* Historia generowań */}
          <div className="panel-card">
            <div className="panel-card-header">
              <span className="panel-card-title">Historia generowań</span>
            </div>
            <div className="panel-card-body">
              {generations.length === 0 ? (
                <div style={{ textAlign: "center", padding: "2rem 0" }}>
                  <Sparkles size={32} strokeWidth={1.2} style={{ margin: "0 auto .75rem", opacity: .3, display: "block" }} />
                  <p className="crm-placeholder-text">
                    Brak generowań AI. Otwórz dowolne demo i kliknij{" "}
                    <strong>Generuj treść AI</strong>.
                  </p>
                  <Link href="/panel/demo" className="crm-btn crm-btn--sm" style={{ marginTop: ".75rem", display: "inline-flex" }}>
                    <Layout size={12} />
                    Przejdź do Demo
                  </Link>
                </div>
              ) : (
                <div className="crm-table-wrap">
                  <table className="crm-table">
                    <thead>
                      <tr>
                        <th>Data</th>
                        <th>Provider / Model</th>
                        <th>Status</th>
                        <th className="crm-th-hide-md">Demo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {generations.map((gen) => (
                        <tr key={gen.id} className="crm-table-row">
                          <td className="crm-td-muted" style={{ whiteSpace: "nowrap" }}>
                            {new Date(gen.created_at).toLocaleString("pl-PL", {
                              day: "2-digit", month: "2-digit", year: "2-digit",
                              hour: "2-digit", minute: "2-digit",
                            })}
                          </td>
                          <td>
                            <span style={{ fontWeight: 560, fontSize: ".76rem" }}>
                              {PROVIDER_LABELS[gen.provider as AIProvider] ?? gen.provider}
                            </span>
                            <div className="crm-td-muted" style={{ fontSize: ".65rem" }}>{gen.model}</div>
                          </td>
                          <td>
                            <span className={`crm-badge crm-badge--sm ai-badge--${gen.status}`}>
                              {gen.status === "completed" ? "Ukończono" : gen.status === "error" ? "Błąd" : "W toku"}
                            </span>
                            {gen.status === "error" && gen.error && (
                              <div className="crm-td-muted" style={{ fontSize: ".62rem", marginTop: ".2rem", color: "#e05555" }}>
                                {gen.error.slice(0, 80)}
                              </div>
                            )}
                          </td>
                          <td className="crm-th-hide-md">
                            {gen.demo_id ? (
                              <Link href={`/panel/demo/${gen.demo_id}`} className="crm-action-link" style={{ fontSize: ".72rem" }}>
                                Otwórz demo
                              </Link>
                            ) : (
                              <span className="crm-td-muted">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="crm-detail-sidebar">
          {/* Providery */}
          <div className="panel-card" style={{ marginBottom: "1rem" }}>
            <div className="panel-card-header">
              <span className="panel-card-title">Providery AI</span>
            </div>
            <div className="panel-card-body">
              <div className="crm-meta-list">
                {providers.map((p) => (
                  <div key={p.id} className="crm-meta-item" style={{ alignItems: "flex-start" }}>
                    <span className="crm-meta-label" style={{ display: "flex", alignItems: "center", gap: ".35rem" }}>
                      {p.config.enabled
                        ? <CheckCircle2 size={12} style={{ color: "#4caf7a", flexShrink: 0 }} />
                        : <XCircle size={12} style={{ color: "rgba(232,232,232,.2)", flexShrink: 0 }} />}
                      {p.label}
                    </span>
                    <span className="crm-meta-value" style={{ fontSize: ".65rem" }}>
                      {p.config.enabled ? p.config.model : "Brak klucza"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Użycie per provider */}
          {stats.total > 0 && (
            <div className="panel-card" style={{ marginBottom: "1rem" }}>
              <div className="panel-card-header">
                <span className="panel-card-title">Generowania per provider</span>
              </div>
              <div className="panel-card-body">
                <div className="crm-meta-list">
                  {Object.entries(stats.byProvider).map(([provider, count]) => (
                    <div key={provider} className="crm-meta-item">
                      <span className="crm-meta-label">{PROVIDER_LABELS[provider as AIProvider] ?? provider}</span>
                      <span className="crm-meta-value">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Jak używać */}
          <div className="panel-card">
            <div className="panel-card-header">
              <span className="panel-card-title">Jak używać AI</span>
            </div>
            <div className="panel-card-body crm-quick-actions">
              <Link href="/panel/demo" className="crm-action-link">
                <Layout size={13} />
                Otwórz moduł Demo
              </Link>
              <Link href="/panel/demo/nowe" className="crm-action-link">
                <Zap size={13} />
                Utwórz nowe demo
              </Link>
            </div>
            <div className="panel-card-body" style={{ paddingTop: 0 }}>
              <p className="est-field-hint">
                AI generuje treści w sekcji szczegółów demo — nagłówki, opisy, CTA, FAQ —
                na podstawie danych klienta i branży.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
