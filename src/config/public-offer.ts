export const PUBLIC_PACKAGES = [
  {
    slug: "cyfrowa-wizytowka",
    title: "Cyfrowa wizytówka",
    priceFrom: 290,
    time: "3-5 dni",
    tag: "Dobry początek",
    featured: false,
    handmade: false,
    lead: "Prosta, estetyczna strona z najważniejszymi informacjami dla marki, która dopiero rusza.",
    features: ["jedna sekcja / ekran", "opis i dane kontaktowe", "wersja mobilna", "przycisk WhatsApp"],
  },
  {
    slug: "link-w-bio",
    title: "Link w bio",
    priceFrom: 390,
    time: "5-7 dni",
    tag: "Dla social media",
    featured: false,
    handmade: false,
    lead: "Własne miejsce na wszystkie linki, produkty i kontakt - spójne z charakterem marki.",
    features: ["do 8 linków lub sekcji", "indywidualne kolory", "wersja mobilna", "podpięcie domeny"],
  },
  {
    slug: "one-page",
    title: "One page",
    priceFrom: 690,
    time: "1-2 tygodnie",
    tag: "Najlepszy na start",
    lead: "Pełna strona na jednym ekranie przewijania dla usług, rękodzieła i marek osobistych.",
    features: ["do 6 rozbudowanych sekcji", "oferta i o marce", "formularz kontaktowy", "podstawowe SEO"],
    featured: true,
    handmade: false,
  },
  {
    slug: "strona-firmowa",
    title: "Strona firmowa",
    priceFrom: 1_390,
    time: "2-4 tygodnie",
    tag: "Więcej przestrzeni",
    featured: false,
    handmade: false,
    lead: "Wielostronicowy serwis dla firmy, która ma szerszą ofertę i chce budować widoczność.",
    features: ["do 5 podstron", "indywidualny kierunek", "formularz i SEO", "instrukcja obsługi"],
  },
  {
    slug: "mini-sklep-handmade",
    title: "Mini sklep handmade",
    priceFrom: 1_790,
    time: "3-5 tygodni",
    tag: "Dla rękodzieła",
    lead: "Lekki sklep dla niewielkiej kolekcji - idealny, gdy sprzedajesz własne produkty w małych seriach.",
    features: ["do 10 produktów", "płatności i dostawa", "kupony rabatowe", "szkolenie z zamówień"],
    handmade: true,
    featured: false,
  },
  {
    slug: "sklep-online",
    title: "Sklep online",
    priceFrom: 2_890,
    time: "4-7 tygodni",
    tag: "Pełna sprzedaż",
    featured: false,
    handmade: false,
    lead: "Rozbudowany sklep dla marki gotowej rozwijać ofertę i prowadzić regularną sprzedaż online.",
    features: ["do 30 produktów", "kategorie i filtry", "płatności i dostawy", "analityka i szkolenie"],
  },
] as const;

export type PublicPackageSlug = (typeof PUBLIC_PACKAGES)[number]["slug"];

export const PUBLIC_PACKAGE_PRICES = Object.fromEntries(
  PUBLIC_PACKAGES.map((item) => [item.slug, item.priceFrom])
) as Record<PublicPackageSlug, number>;

export function formatPriceFrom(price: number) {
  const groupedPrice = String(price).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `od ${groupedPrice} zł`;
}
