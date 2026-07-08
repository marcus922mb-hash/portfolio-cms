export const WEBSITE_TYPES = [
  "landing_page",
  "business_website",
  "portfolio",
  "blog",
  "wordpress_website",
  "nextjs_website",
  "woocommerce_shop",
  "headless_woocommerce",
  "web_app",
] as const;

export type EstimateType = (typeof WEBSITE_TYPES)[number];

export const WEBSITE_TYPE_LABELS: Record<EstimateType, string> = {
  landing_page: "Landing page",
  business_website: "Strona firmowa",
  portfolio: "Portfolio",
  blog: "Blog",
  wordpress_website: "Strona WordPress",
  nextjs_website: "Strona Next.js",
  woocommerce_shop: "Sklep WooCommerce",
  headless_woocommerce: "Sklep WooCommerce Headless",
  web_app: "Aplikacja webowa",
};

export const BASE_PRICES: Record<EstimateType, number> = {
  landing_page: PUBLIC_PACKAGE_PRICES["cyfrowa-wizytowka"],
  business_website: PUBLIC_PACKAGE_PRICES["strona-firmowa"],
  portfolio: PUBLIC_PACKAGE_PRICES["one-page"],
  blog: PUBLIC_PACKAGE_PRICES["strona-firmowa"],
  wordpress_website: PUBLIC_PACKAGE_PRICES["strona-firmowa"],
  nextjs_website: PUBLIC_PACKAGE_PRICES["strona-firmowa"],
  woocommerce_shop: PUBLIC_PACKAGE_PRICES["mini-sklep-handmade"],
  headless_woocommerce: PUBLIC_PACKAGE_PRICES["sklep-online"],
  web_app: PUBLIC_PACKAGE_PRICES["sklep-online"],
};

export const ADDON_PRICES = {
  extra_page: 190,
  wordpress: 500,
  woocommerce: 1000,
  nextjs: 700,
  seo: 400,
  ai: 800,
  copywriting: 500,
  branding: 700,
  maintenance: 300,
} as const;

export type PriceBreakdownItem = { label: string; price: number };

export type CalcParams = {
  website_type: EstimateType;
  pages_count: number;
  needs_wordpress: boolean;
  needs_woocommerce: boolean;
  needs_nextjs: boolean;
  needs_seo: boolean;
  needs_ai: boolean;
  needs_copywriting: boolean;
  needs_branding: boolean;
  needs_maintenance: boolean;
};

export function getPriceBreakdown(params: CalcParams): PriceBreakdownItem[] {
  const items: PriceBreakdownItem[] = [];

  items.push({ label: WEBSITE_TYPE_LABELS[params.website_type], price: BASE_PRICES[params.website_type] });

  const extra = Math.max(0, params.pages_count - 1);
  if (extra > 0) {
    items.push({ label: `Dodatkowe podstrony (×${extra})`, price: extra * ADDON_PRICES.extra_page });
  }
  if (params.needs_wordpress)    items.push({ label: "WordPress", price: ADDON_PRICES.wordpress });
  if (params.needs_woocommerce)  items.push({ label: "WooCommerce", price: ADDON_PRICES.woocommerce });
  if (params.needs_nextjs)       items.push({ label: "Next.js", price: ADDON_PRICES.nextjs });
  if (params.needs_seo)          items.push({ label: "SEO", price: ADDON_PRICES.seo });
  if (params.needs_ai)           items.push({ label: "AI / chatbot", price: ADDON_PRICES.ai });
  if (params.needs_copywriting)  items.push({ label: "Copywriting", price: ADDON_PRICES.copywriting });
  if (params.needs_branding)     items.push({ label: "Branding", price: ADDON_PRICES.branding });
  if (params.needs_maintenance)  items.push({ label: "Opieka techniczna", price: ADDON_PRICES.maintenance });

  return items;
}

export function calculateBasePrice(params: CalcParams): number {
  return getPriceBreakdown(params).reduce((sum, item) => sum + item.price, 0);
}
import { PUBLIC_PACKAGE_PRICES } from "@/config/public-offer";
