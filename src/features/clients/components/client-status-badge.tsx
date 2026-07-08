import type { ClientStatus } from "@/features/clients/types";
import { CLIENT_STATUS_LABELS } from "@/features/clients/types";

type Props = {
  status: ClientStatus;
  size?: "sm" | "md";
};

const STATUS_CSS: Record<ClientStatus, string> = {
  new: "crm-badge--new",
  contacted: "crm-badge--contacted",
  qualified: "crm-badge--qualified",
  demo_prepared: "crm-badge--demo-prepared",
  demo_sent: "crm-badge--demo-sent",
  accepted: "crm-badge--accepted",
  rejected: "crm-badge--rejected",
  inactive: "crm-badge--inactive",
};

export function ClientStatusBadge({ status, size = "sm" }: Props) {
  return (
    <span className={`crm-badge ${STATUS_CSS[status]} crm-badge--${size}`}>
      {CLIENT_STATUS_LABELS[status]}
    </span>
  );
}
