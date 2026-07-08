type SkeletonProps = {
  className?: string;
  style?: React.CSSProperties;
};

export function Skeleton({ className = "", style }: SkeletonProps) {
  return <div className={`panel-skeleton ${className}`} style={style} aria-hidden="true" />;
}

export function SkeletonCard() {
  return (
    <div className="panel-card" style={{ padding: "1.25rem" }}>
      <Skeleton className="panel-skeleton-text--sm" style={{ marginBottom: ".75rem" }} />
      <Skeleton className="panel-skeleton-rect" style={{ height: "1.8rem", marginBottom: ".35rem" }} />
      <Skeleton className="panel-skeleton-text--sm" />
    </div>
  );
}

export function SkeletonListItem() {
  return (
    <div className="panel-recent-item">
      <Skeleton className="panel-skeleton-circle" style={{ width: "1.8rem", height: "1.8rem", flexShrink: 0 }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: ".35rem" }}>
        <Skeleton className="panel-skeleton-text" />
        <Skeleton className="panel-skeleton-text--sm" />
      </div>
    </div>
  );
}
