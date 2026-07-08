import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DEMO_GENERATION_MODE_LABELS } from "@/features/demos/types";
import type { DemoGenerationMode } from "@/features/demos/types";

export const metadata: Metadata = { title: "Szablony branżowe AI" };
export const dynamic = "force-dynamic";

type Template = {
  id: string;
  name: string;
  industry: string;
  generation_mode: string;
  description: string | null;
  demo_defaults: Record<string, string>;
  is_active: boolean;
};

async function getTemplates(): Promise<Template[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("ai_templates")
    .select("id, name, industry, generation_mode, description, demo_defaults, is_active")
    .order("industry");
  return (data ?? []) as Template[];
}

const MODE_BADGE: Record<string, string> = {
  quick: "ai-badge--pending",
  full: "ai-badge--completed",
  premium: "crm-badge--archived",
  publish: "ai-badge--error",
};

export default async function PanelAISzablonyPage() {
  const templates = await getTemplates();

  return (
    <>
      <div className="crm-page-header">
        <div>
          <h1 className="crm-page-title">Szablony branżowe</h1>
          <p className="crm-page-desc">20 gotowych konfiguracji dla różnych branż — użyj jako punkt startowy przy tworzeniu demo</p>
        </div>
        <Link href="/panel/demo/nowe" className="crm-btn crm-btn--primary crm-btn--sm">
          + Nowe demo
        </Link>
      </div>

      <div className="pa-templates-grid">
        {templates.map((tpl) => (
          <div key={tpl.id} className="panel-card pa-template-card">
            <div className="pa-template-header">
              <div>
                <h3 className="pa-template-name">{tpl.name}</h3>
                <p className="crm-td-muted" style={{ fontSize: ".7rem" }}>{tpl.industry}</p>
              </div>
              <span className={`crm-badge crm-badge--sm ${MODE_BADGE[tpl.generation_mode] ?? "ai-badge--completed"}`}>
                {DEMO_GENERATION_MODE_LABELS[tpl.generation_mode as DemoGenerationMode] ?? tpl.generation_mode}
              </span>
            </div>
            {tpl.description && (
              <p className="pa-template-desc">{tpl.description}</p>
            )}
            <div className="pa-template-defaults">
              {Object.entries(tpl.demo_defaults).slice(0, 3).map(([k, v]) => (
                <span key={k} className="pa-template-tag">{String(v)}</span>
              ))}
            </div>
            <div className="pa-template-actions">
              <Link
                href={`/panel/demo/nowe?template=${tpl.id}`}
                className="crm-btn crm-btn--sm crm-btn--primary"
              >
                Użyj szablonu →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
