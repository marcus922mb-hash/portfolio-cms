type BadgeVariant = "lead" | "active" | "completed" | "pending";

export type RecentItem = {
  id: string;
  initials: string;
  name: string;
  meta: string;
  badge?: BadgeVariant;
  badgeLabel?: string;
};

const badgeLabels: Record<BadgeVariant, string> = {
  lead: "Lead",
  active: "Aktywny",
  completed: "Gotowe",
  pending: "W toku",
};

export function RecentTable({ items }: { items: RecentItem[] }) {
  if (items.length === 0) {
    return (
      <p style={{ fontSize: ".7rem", color: "rgba(232,232,232,.28)", padding: ".75rem 0" }}>
        Brak danych
      </p>
    );
  }

  return (
    <div className="panel-recent-list">
      {items.map((item) => (
        <div key={item.id} className="panel-recent-item">
          <span className="panel-recent-avatar">{item.initials}</span>
          <div>
            <p className="panel-recent-name">{item.name}</p>
            <p className="panel-recent-meta">{item.meta}</p>
          </div>
          {item.badge && (
            <span className={`panel-recent-badge panel-badge--${item.badge}`}>
              {item.badgeLabel ?? badgeLabels[item.badge]}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
