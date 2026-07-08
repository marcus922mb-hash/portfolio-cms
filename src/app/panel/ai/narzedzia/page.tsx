import type { Metadata } from "next";
import Link from "next/link";
import {
  Sparkles, Quote, FileText, Search, ListChecks, Share2, MapPin,
  ScrollText, Shield, HelpCircle, Scan, BarChart3, Receipt,
  FileDown, Palette, Layout, Pen, Bot, Globe, Star, Clock,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AI_TOOLS, TOOL_CATEGORIES } from "@/features/ai-hub/tools";
import type { ToolCategory } from "@/features/ai-hub/types";

export const metadata: Metadata = { title: "Narzędzia AI" };

const ICON_MAP: Record<string, React.ComponentType<{ size?: number }>> = {
  Sparkles, Quote, FileText, Search, ListChecks, Share2, MapPin,
  ScrollText, Shield, HelpCircle, Scan, BarChart3, Receipt,
  FileDown, Palette, Layout, Pen, Bot, Globe, Star,
};

async function getRecentUsage(): Promise<Record<string, number>> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("ai_tool_outputs")
    .select("tool_id")
    .order("created_at", { ascending: false })
    .limit(200);
  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    counts[row.tool_id] = (counts[row.tool_id] ?? 0) + 1;
  }
  return counts;
}

export default async function PanelAINarzedziaPage() {
  const usage = await getRecentUsage();
  const categories = Object.entries(TOOL_CATEGORIES) as [ToolCategory, string][];

  return (
    <>
      <div className="crm-page-header">
        <div>
          <h1 className="crm-page-title">Narzędzia AI</h1>
          <p className="crm-page-desc">20 generatorów AI — treści, SEO, dokumenty, analiza, design</p>
        </div>
        <Link href="/panel/ai/wyniki" className="crm-btn crm-btn--sm">
          <Clock size={13} />
          Historia wyników
        </Link>
      </div>

      {categories.map(([category, label]) => {
        const tools = AI_TOOLS.filter((t) => t.category === category);
        if (!tools.length) return null;
        return (
          <div key={category} className="pa-category">
            <h3 className="pa-category-title">{label}</h3>
            <div className="pa-tools-grid">
              {tools.map((tool) => {
                const Icon = ICON_MAP[tool.iconName] ?? Sparkles;
                const count = usage[tool.id] ?? 0;
                return (
                  <Link
                    key={tool.id}
                    href={`/panel/ai/narzedzia/${tool.id}`}
                    className="panel-card pa-tool-card"
                  >
                    <div className="pa-tool-icon">
                      <Icon size={18} />
                    </div>
                    <div className="pa-tool-body">
                      <div className="pa-tool-header">
                        <h4>{tool.name}</h4>
                        {tool.badge && <span className="crm-badge crm-badge--sm">{tool.badge}</span>}
                        {count > 0 && (
                          <span className="pa-use-count" title={`${count} wygenerowań`}>
                            {count}×
                          </span>
                        )}
                      </div>
                      <p className="pa-tool-tagline">{tool.tagline}</p>
                    </div>
                    <span className="pa-tool-arrow">→</span>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
}
