import { DEMO_STATUS_LABELS, type DemoStatus } from "@/features/demos/types";

type Props = {
  status: DemoStatus;
  size?: "sm" | "md";
};

export function DemoStatusBadge({ status, size = "sm" }: Props) {
  return (
    <span className={`crm-badge crm-badge--${size} demo-badge--${status.replaceAll("_", "-")}`}>
      {DEMO_STATUS_LABELS[status]}
    </span>
  );
}
