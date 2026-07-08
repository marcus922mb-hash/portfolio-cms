import type {
  WooCommerceCategory,
  WooCommerceOrder,
  WooCommerceProduct,
  WooCommerceStoreInfo,
} from "@/lib/woocommerce/types";
import type { Json, WooCommerceConnectionRow, WordPressConnectionRow } from "@/types/database";

export const WOOCOMMERCE_CONNECTION_STATUSES = [
  "draft",
  "connected",
  "error",
  "disabled",
] as const;

export type WooCommerceConnectionStatus = (typeof WOOCOMMERCE_CONNECTION_STATUSES)[number];

export const WOOCOMMERCE_CONNECTION_STATUS_LABELS: Record<WooCommerceConnectionStatus, string> = {
  draft: "Szkic",
  connected: "Połączono",
  error: "Błąd",
  disabled: "Wyłączone",
};

export type WooCommerceConnection = WooCommerceConnectionRow & {
  clients?: {
    first_name: string;
    last_name: string;
    company_name: string | null;
  } | null;
  wordpress_connection?: Pick<WordPressConnectionRow, "id" | "name" | "site_url" | "status"> | null;
  last_product_count?: number | null;
};

export type WooCommerceActivity = {
  id: string;
  created_at: string;
  action: string;
  description: string | null;
  metadata: Json | null;
};

export type WooCommerceConnectionFormValues = {
  client_id: string;
  wordpress_connection_id: string;
  name: string;
  store_url: string;
  consumer_key: string;
  consumer_secret: string;
  status: WooCommerceConnectionStatus;
  notes: string;
};

export type WordPressConnectionOption = {
  id: string;
  client_id: string | null;
  name: string | null;
  site_url: string;
  status: string;
};

export type WooCommerceConnectionPreview = {
  store: WooCommerceStoreInfo;
  products: WooCommerceProduct[];
  categories: WooCommerceCategory[];
  orders: WooCommerceOrder[];
};

export function getWooCommerceClientLabel(
  client?: { first_name: string; last_name: string; company_name: string | null } | null
) {
  if (!client) return "—";
  const name = [client.first_name, client.last_name].filter(Boolean).join(" ");
  return client.company_name || name || "—";
}
