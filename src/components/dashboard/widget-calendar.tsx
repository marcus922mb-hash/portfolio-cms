import Link from "next/link";
import { Calendar } from "lucide-react";
import type { ProjectStatus } from "@/features/projects/types";
import { PROJECT_STATUS_COLORS } from "@/features/projects/types";

export type CalendarItem = {
  id: string;
  label: string;
  deadline: string;
  href: string;
  status?: ProjectStatus;
};

function formatDeadline(date: string) {
  const d = new Date(date);
  const days = Math.ceil((d.getTime() - Date.now()) / 86400000);

  const dayLabel = d.toLocaleDateString("pl-PL", { weekday: "short", day: "numeric", month: "short" });

  if (days < 0) return { label: dayLabel, note: "po terminie", color: "#e05555" };
  if (days === 0) return { label: dayLabel, note: "dziś", color: "#c9a46e" };
  if (days === 1) return { label: dayLabel, note: "jutro", color: "#c9a46e" };
  if (days <= 7) return { label: dayLabel, note: `${days}d`, color: "#c9a96e" };
  return { label: dayLabel, note: null, color: "#c9a96e" };
}

export function WidgetCalendar({ items }: { items: CalendarItem[] }) {
  return (
    <div className="panel-widget">
      <div className="panel-widget-header">
        <Calendar size={13} style={{ color: "rgba(201,169,110,.5)" }} aria-hidden="true" />
        <span className="panel-widget-title">Najbliższe terminy</span>
      </div>
      <div className="panel-widget-body">
        {items.length === 0 ? (
          <p style={{ fontSize: ".65rem", color: "rgba(232,232,232,.25)", textAlign: "center", padding: ".5rem 0" }}>
            Brak nadchodzących terminów
          </p>
        ) : (
          items.map((item) => {
            const dl = formatDeadline(item.deadline);
            return (
              <Link
                key={item.id}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: ".75rem",
                  padding: ".45rem 0",
                  borderBottom: "1px solid rgba(255,255,255,.04)",
                  textDecoration: "none",
                }}
              >
                <span
                  style={{
                    flexShrink: 0,
                    fontSize: ".58rem",
                    fontWeight: 700,
                    color: dl.color,
                    minWidth: "4rem",
                  }}
                >
                  {dl.label}
                  {dl.note && (
                    <span style={{ display: "block", fontWeight: 400, opacity: .75 }}>{dl.note}</span>
                  )}
                </span>
                <span style={{
                  fontSize: ".68rem",
                  color: "rgba(232,232,232,.62)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}>
                  {item.label}
                </span>
                {item.status && (
                  <span style={{
                    flexShrink: 0,
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: PROJECT_STATUS_COLORS[item.status],
                    marginLeft: "auto",
                  }} />
                )}
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
