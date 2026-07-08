export const appConfig = {
  name: "MA Atelier Studio",
  shortName: "MAS",
  publicName: "Braided Digital",
  version: "1.0.0",
  locale: "pl-PL",
  timezone: "Europe/Warsaw",
  currency: "PLN",
  url: process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "",
  panelPath: "/panel",
} as const;
