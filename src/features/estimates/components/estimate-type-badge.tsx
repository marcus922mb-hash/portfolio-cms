import type { EstimateType } from "@/features/estimates/types";
import { WEBSITE_TYPE_LABELS } from "@/features/estimates/types";

type Props = {
  type: EstimateType;
};

export function EstimateTypeBadge({ type }: Props) {
  return (
    <span className="est-type-badge">
      {WEBSITE_TYPE_LABELS[type] ?? type}
    </span>
  );
}
