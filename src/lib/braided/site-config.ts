function normalizeUrl(value?: string) {
  if (!value) return "";
  const withProtocol = value.startsWith("http") ? value : `https://${value}`;
  return withProtocol.replace(/\/$/, "");
}

const configuredUrl =
  normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL) ||
  normalizeUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ||
  normalizeUrl(process.env.VERCEL_URL);

export const siteConfig = {
  name: "Braided Digital",
  url: configuredUrl || "",
  email: "ma.atelier.kontakt@gmail.com",
  phone: "+48 730 195 530",
  whatsapp: "https://wa.me/48730195530",
  address: "Chylin 35, 62-710 Władysławów",
} as const;
