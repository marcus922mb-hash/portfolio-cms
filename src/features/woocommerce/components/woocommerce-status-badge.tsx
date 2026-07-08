import {
  WOOCOMMERCE_CONNECTION_STATUS_LABELS,
  type WooCommerceConnectionStatus,
} from "@/features/woocommerce/types";

type Props = {
  status: WooCommerceConnectionStatus;
  size?: "sm" | "md";
};

export function WooCommerceStatusBadge({ status, size = "sm" }: Props) {
  return (
    <span className={`crm-badge crm-badge--${size} woocommerce-badge--${status}`}>
      {WOOCOMMERCE_CONNECTION_STATUS_LABELS[status]}
    </span>
  );
}
