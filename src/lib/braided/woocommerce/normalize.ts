import type {
  WooCommerceCategory,
  WooCommerceOrder,
  WooCommerceProduct,
  WooCommerceStoreInfo,
} from "@/lib/woocommerce/types";

export function normalizeWooCommerceProduct(raw: Record<string, unknown>): WooCommerceProduct {
  return {
    id: Number(raw?.id ?? 0),
    name: typeof raw?.name === "string" ? raw.name : "Produkt",
    slug: typeof raw?.slug === "string" ? raw.slug : "",
    status: typeof raw?.status === "string" ? raw.status : "unknown",
    type: typeof raw?.type === "string" ? raw.type : "simple",
    price: raw?.price != null ? String(raw.price) : null,
    permalink: typeof raw?.permalink === "string" ? raw.permalink : "",
    imageUrl: Array.isArray(raw?.images) && typeof raw.images[0]?.src === "string" ? raw.images[0].src : null,
    stockStatus: typeof raw?.stock_status === "string" ? raw.stock_status : null,
  };
}

export function normalizeWooCommerceCategory(raw: Record<string, unknown>): WooCommerceCategory {
  return {
    id: Number(raw?.id ?? 0),
    name: typeof raw?.name === "string" ? raw.name : "Kategoria",
    slug: typeof raw?.slug === "string" ? raw.slug : "",
    count: Number(raw?.count ?? 0),
  };
}

export function normalizeWooCommerceOrder(raw: Record<string, unknown>): WooCommerceOrder {
  const billing = raw.billing as Record<string, unknown> | undefined;
  const firstName = typeof billing?.first_name === "string" ? billing.first_name : "";
  const lastName = typeof billing?.last_name === "string" ? billing.last_name : "";
  const customerName = [firstName, lastName].filter(Boolean).join(" ") || "Klient";

  return {
    id: Number(raw?.id ?? 0),
    number: typeof raw?.number === "string" ? raw.number : String(raw?.id ?? "—"),
    status: typeof raw?.status === "string" ? raw.status : "unknown",
    total: raw?.total != null ? String(raw.total) : "0",
    currency: typeof raw?.currency === "string" ? raw.currency : null,
    dateCreated: typeof raw?.date_created === "string" ? raw.date_created : null,
    customerName,
  };
}

export function normalizeWooCommerceStoreInfo(raw: Record<string, unknown>, fallbackUrl: string): WooCommerceStoreInfo {
  return {
    name: typeof raw?.name === "string" && raw.name.trim() ? raw.name.trim() : "Sklep WooCommerce",
    description: typeof raw?.description === "string" && raw.description.trim() ? raw.description.trim() : null,
    url: typeof raw?.url === "string" && raw.url.trim() ? raw.url.trim() : fallbackUrl,
  };
}
