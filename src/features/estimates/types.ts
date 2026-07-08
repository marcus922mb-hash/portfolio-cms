import { WEBSITE_TYPES, WEBSITE_TYPE_LABELS } from "@/config/pricing";

export type { EstimateType } from "@/config/pricing";
export { WEBSITE_TYPES, WEBSITE_TYPE_LABELS };

export const ESTIMATE_STATUSES = [
  "draft",
  "prepared",
  "sent",
  "accepted",
  "rejected",
  "expired",
] as const;

export type EstimateStatus = (typeof ESTIMATE_STATUSES)[number];

export const ESTIMATE_STATUS_LABELS: Record<EstimateStatus, string> = {
  draft: "Szkic",
  prepared: "Przygotowana",
  sent: "Wysłana",
  accepted: "Zaakceptowana",
  rejected: "Odrzucona",
  expired: "Wygasła",
};

export type EstimateClient = {
  first_name: string;
  last_name: string;
  company_name: string | null;
};

export type Estimate = {
  id: string;
  created_at: string;
  updated_at: string;
  client_id: string | null;
  website_type: (typeof WEBSITE_TYPES)[number];
  pages_count: number | null;
  needs_wordpress: boolean;
  needs_woocommerce: boolean;
  needs_nextjs: boolean;
  needs_seo: boolean;
  needs_ai: boolean;
  needs_copywriting: boolean;
  needs_branding: boolean;
  needs_maintenance: boolean;
  base_price: number | null;
  final_price: number | null;
  status: EstimateStatus;
  notes: string | null;
  clients?: EstimateClient | null;
};

export type EstimateFormValues = {
  client_id: string;
  website_type: (typeof WEBSITE_TYPES)[number];
  pages_count: number;
  needs_wordpress: boolean;
  needs_woocommerce: boolean;
  needs_nextjs: boolean;
  needs_seo: boolean;
  needs_ai: boolean;
  needs_copywriting: boolean;
  needs_branding: boolean;
  needs_maintenance: boolean;
  base_price: number;
  final_price: number;
  status: EstimateStatus;
  notes: string;
};

export type ClientSelectOption = {
  id: string;
  label: string;
};

export function getClientLabel(client: EstimateClient): string {
  const name = [client.first_name, client.last_name].filter(Boolean).join(" ");
  return name || client.company_name || "—";
}

export function getEstimateClientLabel(estimate: Estimate): string {
  if (!estimate.clients) return "—";
  return getClientLabel(estimate.clients);
}
