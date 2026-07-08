type ActivityType = "client" | "estimate" | "demo" | "project";

type ActivityItem = {
  id: string;
  type: ActivityType;
  label: string;
  time: string;
};

const mockActivity: ActivityItem[] = [
  { id: "1", type: "client", label: "Nowy lead: Anna Kowalska", time: "2 godz. temu" },
  { id: "2", type: "estimate", label: "Wycena #12 wysłana do Piotra", time: "wczoraj" },
  { id: "3", type: "demo", label: "Demo 'Kawiarnia Lokalna' opublikowane", time: "2 dni temu" },
  { id: "4", type: "project", label: "Projekt #3 — etap budowy ukończony", time: "4 dni temu" },
  { id: "5", type: "client", label: "Nowy klient: Marta Wiśniewska", time: "tydzień temu" },
];

export function ActivityFeed({ items = mockActivity }: { items?: ActivityItem[] }) {
  if (items.length === 0) {
    return (
      <div style={{ padding: ".75rem 0", textAlign: "center" }}>
        <p style={{ fontSize: ".7rem", color: "rgba(232,232,232,.28)" }}>Brak aktywności</p>
      </div>
    );
  }

  return (
    <div className="panel-activity-list">
      {items.map((item) => (
        <div key={item.id} className="panel-activity-item">
          <span className={`panel-activity-dot panel-activity-dot--${item.type}`} aria-hidden="true" />
          <div>
            <p className="panel-activity-label">{item.label}</p>
            <p className="panel-activity-time">{item.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
