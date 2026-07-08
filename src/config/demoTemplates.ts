export type DemoTemplate = {
  slug: string;
  name: string;
  category: "handmade" | "local" | "service" | "landing";
  description: string;
};

export const demoTemplates: DemoTemplate[] = [
  {
    slug: "handmade-jewelry",
    name: "Biżuteria handmade",
    category: "handmade",
    description: "Szablon dla twórców biżuterii rękodzielniczej.",
  },
  {
    slug: "local-cafe",
    name: "Kawiarnia lokalna",
    category: "local",
    description: "Szablon dla małej kawiarni lub bistro.",
  },
  {
    slug: "beauty-service",
    name: "Usługi beauty",
    category: "service",
    description: "Szablon dla kosmetyczki lub stylistki.",
  },
  {
    slug: "product-landing",
    name: "Landing produktowy",
    category: "landing",
    description: "Jednostronicowy landing dla jednego produktu.",
  },
];
