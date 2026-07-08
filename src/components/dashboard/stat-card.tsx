type StatCardProps = {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
};

export function StatCard({ label, value, sub, icon }: StatCardProps) {
  return (
    <div className="panel-stat">
      <div className="panel-stat-icon">{icon}</div>
      <p className="panel-stat-label">{label}</p>
      <p className="panel-stat-value">{value}</p>
      {sub && <p className="panel-stat-sub">{sub}</p>}
    </div>
  );
}
