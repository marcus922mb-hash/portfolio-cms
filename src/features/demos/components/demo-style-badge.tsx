import { DEMO_STYLE_LABELS, type DemoStyle } from "@/features/demos/types";

export function DemoStyleBadge({ style }: { style: DemoStyle | null }) {
  if (!style) return <span className="crm-td-muted">—</span>;
  return <span className="demo-meta-badge demo-meta-badge--soft">{DEMO_STYLE_LABELS[style]}</span>;
}
