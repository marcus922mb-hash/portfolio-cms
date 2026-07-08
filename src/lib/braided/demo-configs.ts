export type DemoConfig = {
  brandName: string;
  tagline: string;
  headline: string;
  headlineItalic: string;
  body: string;
  cta: string;
  accentColor: string;
  bgColor: string;
  links: string[];
  services: string[];
  products: { name: string; price: string }[];
};

function lum(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

export function textColor(bg: string): string {
  return lum(bg) > 0.5 ? "#1a1413" : "#f0e8d8";
}

export function mutedColor(bg: string): string {
  return lum(bg) > 0.5 ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.5)";
}

export function borderColor(bg: string): string {
  return lum(bg) > 0.5 ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.12)";
}

export const defaultConfigs: Record<string, DemoConfig> = {
  "cyfrowa-wizytowka": {
    brandName: "Olive Studio",
    tagline: "Studio projektowe · Poznań",
    headline: "Piękne wnętrza.",
    headlineItalic: "Spokojne życie.",
    body: "Projektuję miejsca, które wyglądają dobrze i jeszcze lepiej się w nich żyje.",
    cta: "Umów bezpłatną rozmowę",
    accentColor: "#d7b77a",
    bgColor: "#17352f",
    links: [],
    services: ["Projekt wnętrza", "Konsultacja online", "Nadzór autorski"],
    products: [],
  },
  "link-w-bio": {
    brandName: "Luna Ceramics",
    tagline: "ceramika tworzona powoli",
    headline: "Luna Ceramics",
    headlineItalic: "",
    body: "",
    cta: "Zobacz kolekcję",
    accentColor: "#9e6258",
    bgColor: "#fff5ef",
    links: [
      "Zobacz najnowszą kolekcję",
      "Sklep online",
      "Warsztaty ceramiczne",
      "Instagram",
      "Napisz do mnie",
    ],
    services: [],
    products: [],
  },
  "one-page": {
    brandName: "SOMA",
    tagline: "Holistyczna pielęgnacja",
    headline: "Wracaj do siebie.",
    headlineItalic: "Łagodnie.",
    body: "Kameralny gabinet, uważny dotyk i rytuały dobrane do potrzeb Twojej skóry.",
    cta: "Umów wizytę",
    accentColor: "#a85e48",
    bgColor: "#f4eee5",
    links: [],
    services: ["Rytuał twarzy", "Masaż kobido", "Naturalna pielęgnacja"],
    products: [],
  },
  "strona-firmowa": {
    brandName: "NOVA ARCHITEKCI",
    tagline: "Architektura / wnętrza",
    headline: "Przestrzeń",
    headlineItalic: "z charakterem.",
    body: "Projektujemy domy i wnętrza, w których forma wynika z życia.",
    cta: "Poznaj studio",
    accentColor: "#a27142",
    bgColor: "#e9edf0",
    links: [],
    services: ["Domy", "Wnętrza", "Przestrzenie komercyjne"],
    products: [],
  },
  "mini-sklep-handmade": {
    brandName: "MILA HANDMADE",
    tagline: "Ręcznie wykonane",
    headline: "Małe rzeczy.",
    headlineItalic: "Wielka czułość.",
    body: "Lniane dekoracje tworzone pojedynczo, spokojnie i z dbałością o każdy detal.",
    cta: "Dodaj do koszyka",
    accentColor: "#99775e",
    bgColor: "#f7f2ea",
    links: [],
    services: [],
    products: [
      { name: "Lniany anioł", price: "49,00" },
      { name: "Wianek naturalny", price: "59,00" },
      { name: "Ozdoba księżyc", price: "69,00" },
    ],
  },
  "sklep-online": {
    brandName: "FORM / STORE",
    tagline: "New collection / 2026",
    headline: "Essential",
    headlineItalic: "forms.",
    body: "Przedmioty i ubrania stworzone, by zostać z Tobą na dłużej.",
    cta: "Shop the edit",
    accentColor: "#1a1a1a",
    bgColor: "#ffffff",
    links: [],
    services: ["Wardrobe", "Objects", "Accessories"],
    products: [
      { name: "Soft blazer", price: "220" },
      { name: "Studio bag", price: "290" },
      { name: "Wool form", price: "360" },
      { name: "Silver object", price: "430" },
    ],
  },
};
