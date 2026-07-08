type EmptyStateProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
};

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="panel-placeholder">
      <div className="panel-placeholder-icon">{icon}</div>
      <h2>{title}</h2>
      <p>{description}</p>
      {action && <div style={{ marginTop: ".75rem" }}>{action}</div>}
    </div>
  );
}
