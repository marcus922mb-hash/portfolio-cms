import { DEMO_INDUSTRY_LABELS, type DemoIndustry } from "@/features/demos/types";

export function DemoIndustryBadge({ industry }: { industry: DemoIndustry | null }) {
  if (!industry) return <span className="crm-td-muted">—</span>;
  return <span className="demo-meta-badge">{DEMO_INDUSTRY_LABELS[industry]}</span>;
}
