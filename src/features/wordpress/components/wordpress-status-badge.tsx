import { WP_CONNECTION_STATUS_LABELS, type WPConnectionStatus } from "@/features/wordpress/types";

type Props = {
  status: WPConnectionStatus;
  size?: "sm" | "md";
};

export function WordPressStatusBadge({ status, size = "sm" }: Props) {
  return (
    <span className={`crm-badge crm-badge--${size} wp-badge--${status}`}>
      {WP_CONNECTION_STATUS_LABELS[status]}
    </span>
  );
}
