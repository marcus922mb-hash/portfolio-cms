import { PROJECT_STATUS_COLORS, PROJECT_STATUS_LABELS } from "@/features/projects/types";
import type { ProjectStatus } from "@/features/projects/types";

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span
      className="crm-badge"
      style={{
        background: PROJECT_STATUS_COLORS[status] + "22",
        color: PROJECT_STATUS_COLORS[status],
        border: `1px solid ${PROJECT_STATUS_COLORS[status]}44`,
      }}
    >
      {PROJECT_STATUS_LABELS[status]}
    </span>
  );
}
