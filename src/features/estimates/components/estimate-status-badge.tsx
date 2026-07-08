import type { EstimateStatus } from "@/features/estimates/types";
import { ESTIMATE_STATUS_LABELS } from "@/features/estimates/types";

type Props = {
  status: EstimateStatus;
  size?: "sm" | "md";
};

const STATUS_CSS: Record<EstimateStatus, string> = {
  draft:    "est-badge--draft",
  prepared: "est-badge--prepared",
  sent:     "est-badge--sent",
  accepted: "est-badge--accepted",
  rejected: "est-badge--rejected",
  expired:  "est-badge--expired",
};

export function EstimateStatusBadge({ status, size = "sm" }: Props) {
  return (
    <span className={`crm-badge ${STATUS_CSS[status]} crm-badge--${size}`}>
      {ESTIMATE_STATUS_LABELS[status]}
    </span>
  );
}
