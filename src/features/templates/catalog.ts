import beauty from "@/templates/beauty/catalog.json";
import creative from "@/templates/creative/catalog.json";
import ecommerce from "@/templates/ecommerce/catalog.json";
import handmade from "@/templates/handmade/catalog.json";
import medical from "@/templates/medical/catalog.json";
import restaurant from "@/templates/restaurant/catalog.json";
import services from "@/templates/services/catalog.json";
import onepage from "@/templates/onepage/catalog.json";
import linkinbio from "@/templates/linkinbio/catalog.json";
import digital from "@/templates/digital/catalog.json";
import commerce from "@/templates/commerce/catalog.json";
import { PUBLIC_PACKAGE_PRICES } from "@/config/public-offer";
import { templateImages } from "@/features/templates/image-library";
import type { BuilderComponent, ComponentType } from "@/features/builder/types";
import {
  TEMPLATE_WEBSITE_TYPES,
  type ResolvedTemplate,
  type TemplateDefinition,
  type TemplateWebsiteType,
} from "./types";

type RawTemplate = Omit<
  TemplateDefinition,
  "websiteType" | "priceFrom" | "previewImages" | "imageQuery"
> &
  Partial<
    Pick<
      TemplateDefinition,
      "websiteType" | "priceFrom" | "previewImages" | "imageQuery"
    >
  >;

const rawCatalog = [
  ...handmade,
  ...beauty,
  ...restaurant,
  ...services,
  ...medical,
  ...creative,
  ...ecommerce,
  ...onepage,
  ...linkinbio,
  ...digital,
  ...commerce,
] as unknown as RawTemplate[];

const animationSequence = [
  "fadeIn",
  "slideUp",
  "reveal",
  "zoomIn",
  "parallax",
  "stagger",
  "float",
] as const;

const TYPE_PRICE: Record<TemplateWebsiteType, number> = {
  "digital-card": PUBLIC_PACKAGE_PRICES["cyfrowa-wizytowka"],
  "link-in-bio": PUBLIC_PACKAGE_PRICES["link-w-bio"],
  "one-page": PUBLIC_PACKAGE_PRICES["one-page"],
  "business-website": PUBLIC_PACKAGE_PRICES["strona-firmowa"],
  "mini-shop": PUBLIC_PACKAGE_PRICES["mini-sklep-handmade"],
  "online-shop": PUBLIC_PACKAGE_PRICES["sklep-online"],
};

function inferWebsiteType(template: RawTemplate): TemplateWebsiteType {
  if (
    template.websiteType &&
    TEMPLATE_WEBSITE_TYPES.includes(template.websiteType)
  ) {
    return template.websiteType;
  }
  if (template.group === "digital-card") return "digital-card";
  if (template.group === "link-in-bio") return "link-in-bio";
  if (template.group === "one-page" || template.id === "landing-convert") {
    return "one-page";
  }
  if (template.group === "handmade") return "mini-shop";
  if (template.id === "shop-curated" || template.id.startsWith("shop-")) {
    return "online-shop";
  }
  return "business-website";
}

function normalizeTemplate(template: RawTemplate): TemplateDefinition {
  const websiteType = inferWebsiteType(template);
  return {
    ...template,
    websiteType,
    priceFrom: TYPE_PRICE[websiteType],
    previewImages:
      template.previewImages ?? templateImages(template.group, template.id),
    imageQuery:
      template.imageQuery ??
      `${template.industry} ${template.tags.slice(0, 2).join(" ")} professional business`,
  };
}

const normalizedCatalog = rawCatalog.map(normalizeTemplate);

function block(
  template: TemplateDefinition,
  type: ComponentType,
  label: string,
  props: Record<string, unknown>,
  index: number,
  styles: BuilderComponent["styles"] = {}
): BuilderComponent {
  return {
    id: `${template.id}-${type}-${index}`,
    type,
    label,
    props,
    styles: {
      paddingTop: "6rem",
      paddingBottom: "6rem",
      background: index % 2 ? template.colors.light : template.colors.neutral,
      color: template.colors.dark,
      ...styles,
    },
    animations: {
      type: animationSequence[index % animationSequence.length],
      duration: 650,
      delay: Math.min(index * 40, 240),
      easing: "ease-out",
    },
    visibility: { desktop: true, tablet: true, mobile: true },
    children: [],
  };
}

// ── Standard multi-section website ───────────────────────────

function resolveTemplate(template: TemplateDefinition): ResolvedTemplate {
  const { copy, colors } = template;
  const images = template.previewImages;
  const components: BuilderComponent[] = [
    block(template, "navbar", "Nawigacja", {
      logoText: template.name,
      links: [
        { label: "O nas", href: "#o-nas" },
        { label: "Oferta", href: "#uslugi" },
        { label: "Galeria", href: "#galeria" },
        { label: "Kontakt", href: "#kontakt" },
      ],
      ctaText: "Kontakt",
      ctaUrl: "#kontakt",
      sticky: true,
    }, 0, { paddingTop: "1.25rem", paddingBottom: "1.25rem", background: colors.light }),
    block(template, "hero", "Hero", {
      badge: copy.eyebrow,
      title: copy.heroTitle,
      subtitle: copy.heroSubtitle,
      ctaText: "Poznaj ofertę",
      ctaUrl: "#uslugi",
      ctaSecondText: "Zobacz realizacje",
      ctaSecondUrl: "#galeria",
      backgroundImage: images[0],
      imageUrl: images[0],
      imageAlt: `${template.industry} — ${copy.heroTitle}`,
      imagePlaceholder: false,
      replaceImageAction: "upload",
      overlayOpacity: 0.18,
    }, 1, {
      background: colors.dark,
      color: colors.light,
      minHeight: "88vh",
      paddingTop: "10rem",
      paddingBottom: "10rem",
    }),
    block(template, "logos", "Zaufali nam", {
      title: "Wybrali nas",
      items: ["Studio Forma", "Local & Co.", "Atelier 24", "Dobra Marka", "North House"],
    }, 2, { paddingTop: "2.25rem", paddingBottom: "2.25rem", background: colors.light }),
    block(template, "about", "About", {
      badge: "O nas",
      title: copy.aboutTitle,
      content: copy.aboutText,
      imageUrl: images[1],
      imageAlt: `${template.industry} — zdjęcie pracowni`,
      imagePlaceholder: false,
      replaceImageAction: "upload",
      layout: "left",
      highlights: ["Indywidualne podejście", "Jasny proces", "Terminowa realizacja"],
    }, 3),
    block(template, "services", "Oferta", {
      title: "Oferta",
      subtitle: "Zakres dopasowany do Twoich potrzeb",
      columns: 3,
      items: copy.services.map((title, itemIndex) => ({
        icon: ["Sparkles", "Layers", "Heart"][itemIndex] ?? "Check",
        title,
        description: `Profesjonalna usługa ${title.toLowerCase()} prowadzona z dbałością o jakość i każdy detal.`,
      })),
    }, 4, { background: colors.light }),
    block(template, "statistics", "Liczby", {
      title: "Doświadczenie, które widać w realizacji",
      items: [
        { value: "8+", label: "lat doświadczenia" },
        { value: "120", label: "zrealizowanych projektów" },
        { value: "4.9/5", label: "średnia ocen klientów" },
      ],
    }, 5, { background: colors.dark, color: colors.light, paddingTop: "4rem", paddingBottom: "4rem" }),
    block(template, "process", "Proces", {
      title: "Jak wygląda współpraca",
      subtitle: "Od pierwszej rozmowy do gotowego efektu",
      items: [
        { number: "01", title: "Rozmowa", description: "Poznajemy potrzeby, cel i oczekiwany termin." },
        { number: "02", title: "Koncepcja", description: "Przygotowujemy kierunek i konkretny plan działania." },
        { number: "03", title: "Realizacja", description: "Pracujemy etapami i pokazujemy postęp." },
        { number: "04", title: "Przekazanie", description: "Testujemy efekt i przekazujemy komplet materiałów." },
      ],
    }, 6),
    block(template, "cta", "CTA", {
      title: copy.ctaTitle,
      subtitle: "Napisz do nas — odpowiemy z konkretną propozycją kolejnego kroku.",
      primaryText: "Zacznijmy rozmowę",
      primaryUrl: "#kontakt",
      secondaryText: "Poznaj nas bliżej",
      secondaryUrl: "#o-nas",
      backgroundImage: images[2],
    }, 7, { background: colors.primary, color: colors.light, textAlign: "center" }),
    block(template, "gallery", "Galeria", {
      title: "Wybrane realizacje",
      subtitle: "Jakość najlepiej widać w szczegółach",
      columns: 3,
      items: Array.from({ length: 6 }, (_, itemIndex) => ({
        imageUrl: images[(itemIndex + 2) % images.length],
        imagePlaceholder: false,
        replaceImageAction: "upload",
        alt: `${template.industry} — realizacja ${itemIndex + 1}`,
        caption: `Realizacja ${String(itemIndex + 1).padStart(2, "0")}`,
      })),
    }, 8),
    block(template, "testimonials", "Opinie", {
      title: "Zaufanie zbudowane współpracą",
      subtitle: "Opinie klientów",
      items: [
        { name: "Anna K.", role: "Klientka", company: "", quote: "Wysoka jakość, świetny kontakt i efekt lepszy niż oczekiwałam.", avatar: "" },
        { name: "Michał R.", role: "Klient", company: "", quote: "Cały proces był przejrzysty, sprawny i dopracowany w każdym szczególe.", avatar: "" },
        { name: "Karolina M.", role: "Klientka", company: "", quote: "To dokładnie ten poziom estetyki i obsługi, którego szukałam.", avatar: "" },
      ],
    }, 9, { background: colors.dark, color: colors.light }),
    block(template, "faq", "FAQ", {
      title: "Najczęściej zadawane pytania",
      subtitle: "Wszystko, co warto wiedzieć przed rozpoczęciem",
      items: [
        { question: "Jak wygląda pierwszy krok?", answer: "Zaczynamy od krótkiej rozmowy o potrzebach, terminie i oczekiwanym efekcie." },
        { question: "Ile trwa realizacja?", answer: "Termin zależy od zakresu. Po konsultacji otrzymasz konkretny harmonogram." },
        { question: "Czy oferta jest dopasowana indywidualnie?", answer: "Tak. Zakres i wycenę przygotowujemy po poznaniu Twojej sytuacji." },
        { question: "Jak mogę zarezerwować termin?", answer: "Skorzystaj z formularza lub zadzwoń — potwierdzimy najbliższy dostępny termin." },
      ],
    }, 10),
    block(template, "contact", "Kontakt", {
      badge: "Kontakt",
      title: "Porozmawiajmy",
      subtitle: "Opowiedz krótko, czego potrzebujesz. Wrócimy z odpowiedzią.",
      email: "hello@twojamarka.pl",
      phone: "+48 000 000 000",
      address: "Warszawa, Polska",
      showForm: true,
      formTitle: "Napisz wiadomość",
      imageUrl: images[5],
    }, 11, { background: colors.light }),
    block(template, "newsletter", "Newsletter", {
      title: "Zostańmy w kontakcie",
      subtitle: "Nowości, wiedza i kulisy realizacji — bez zbędnych wiadomości.",
      placeholder: "Twój adres e-mail",
      buttonText: "Zapisuję się",
    }, 12, { background: colors.neutral, paddingTop: "4rem", paddingBottom: "4rem", textAlign: "center" }),
    block(template, "footer", "Stopka", {
      logoText: template.name,
      copyright: `© 2026 ${template.name}. Wszelkie prawa zastrzeżone.`,
      columns: [
        { title: "Menu", links: [{ label: "O nas", href: "#o-nas" }, { label: "Oferta", href: "#uslugi" }] },
        { title: "Informacje", links: [{ label: "FAQ", href: "#faq" }, { label: "Kontakt", href: "#kontakt" }] },
        { title: "Social", links: [{ label: "Instagram", href: "#" }, { label: "Facebook", href: "#" }] },
      ],
    }, 13, { background: colors.dark, color: colors.light, paddingTop: "5rem", paddingBottom: "2rem" }),
  ];

  return buildResolvedTemplate(template, components);
}

// ── One Page (minimal, no navbar/footer redundancy) ───────────

function resolveOnePage(template: TemplateDefinition): ResolvedTemplate {
  const { copy, colors } = template;
  const images = template.previewImages;
  const sectionTypes = template.sections as string[];

  const allBlocks: BuilderComponent[] = [
    block(template, "hero", "Hero", {
      badge: copy.eyebrow,
      title: copy.heroTitle,
      subtitle: copy.heroSubtitle,
      ctaText: "Sprawdź ofertę",
      ctaUrl: "#oferta",
      ctaSecondText: "Kontakt",
      ctaSecondUrl: "#kontakt",
      backgroundImage: images[0],
      imageUrl: images[0],
      imagePlaceholder: false,
      overlayOpacity: 0.2,
    }, 0, { background: colors.dark, color: colors.light, minHeight: "100vh", paddingTop: "8rem", paddingBottom: "8rem" }),
  ];

  let idx = 1;

  if (sectionTypes.includes("about")) {
    allBlocks.push(block(template, "about", "O nas", {
      badge: "O nas",
      title: copy.aboutTitle,
      content: copy.aboutText,
      imageUrl: images[1],
      imagePlaceholder: false,
      layout: "left",
    }, idx++));
  }

  if (sectionTypes.includes("features")) {
    allBlocks.push(block(template, "features", "Cechy", {
      title: "Dlaczego my?",
      subtitle: "Kilka powodów, dla których warto",
      columns: 3,
      items: copy.services.map((title, i) => ({
        icon: ["Zap", "Shield", "Star", "Heart"][i] ?? "Check",
        title,
        description: `${title} — z dbałością o każdy szczegół.`,
      })),
    }, idx++, { background: colors.light }));
  }

  if (sectionTypes.includes("services")) {
    allBlocks.push(block(template, "services", "Oferta", {
      title: "Oferta",
      subtitle: "Dopasowane do Twoich potrzeb",
      columns: Math.min(copy.services.length, 3),
      items: copy.services.map((title, i) => ({
        icon: ["Sparkles", "Layers", "Heart", "Star"][i] ?? "Check",
        title,
        description: `${title} — profesjonalnie i z zaangażowaniem.`,
      })),
    }, idx++, { background: colors.neutral }));
  }

  if (sectionTypes.includes("pricing")) {
    allBlocks.push(block(template, "pricing", "Cennik", {
      title: "Cennik",
      subtitle: "Przejrzyste i uczciwe stawki",
      items: copy.services.map((title, i) => ({
        name: title,
        price: ["od 500 zł", "od 800 zł", "wycena indywidualna"][i] ?? "wycena",
        features: ["Wycena", "Realizacja", "Wsparcie"],
        cta: "Zapytaj",
        ctaUrl: "#kontakt",
        highlighted: i === 1,
      })),
    }, idx++, { background: colors.light }));
  }

  if (sectionTypes.includes("gallery")) {
    allBlocks.push(block(template, "gallery", "Galeria", {
      title: "Realizacje",
      subtitle: "Wybrane projekty",
      columns: 3,
      items: Array.from({ length: 4 }, (_, i) => ({
        imageUrl: images[(i + 2) % images.length], imagePlaceholder: false, replaceImageAction: "upload",
        alt: `${template.industry} — realizacja ${i + 1}`,
        caption: `Projekt ${i + 1}`,
      })),
    }, idx++));
  }

  allBlocks.push(block(template, "cta", "CTA", {
    title: copy.ctaTitle,
    subtitle: "Napisz do nas. Odpowiemy z konkretną propozycją.",
    primaryText: "Skontaktuj się",
    primaryUrl: "#kontakt",
  }, idx++, { background: colors.primary, color: colors.light, textAlign: "center" }));

  allBlocks.push(block(template, "testimonials", "Opinie", {
    title: "Co mówią klienci",
    subtitle: "Dobre doświadczenie od pierwszego kontaktu",
    items: [
      { name: "Anna K.", role: "Klientka", quote: "Wszystko było jasne, sprawne i dopracowane.", avatar: "" },
      { name: "Piotr M.", role: "Klient", quote: "Świetny kontakt i dokładnie taki efekt, jakiego potrzebowaliśmy.", avatar: "" },
      { name: "Julia S.", role: "Klientka", quote: "Profesjonalnie, terminowo i bez niepotrzebnego chaosu.", avatar: "" },
    ],
  }, idx++, { background: colors.dark, color: colors.light }));

  allBlocks.push(block(template, "faq", "FAQ", {
    title: "Najczęściej zadawane pytania",
    items: [
      { question: "Jak zacząć?", answer: "Napisz krótko, czego potrzebujesz. Wrócimy z propozycją kolejnego kroku." },
      { question: "Jaki jest termin?", answer: "Po poznaniu zakresu potwierdzimy dostępny termin i harmonogram." },
      { question: "Czy otrzymam wycenę?", answer: "Tak, cena i zakres są potwierdzane przed rozpoczęciem." },
    ],
  }, idx++));

  allBlocks.push(block(template, "contact", "Kontakt", {
    badge: "Kontakt",
    title: "Napisz do nas",
    subtitle: "Chętnie odpowiemy na każde pytanie.",
    email: "hello@twojamarka.pl",
    phone: "+48 000 000 000",
    address: "Polska",
    showForm: true,
    formTitle: "Wiadomość",
    imageUrl: images[5],
  }, idx++, { background: colors.neutral }));

  return buildResolvedTemplate(template, allBlocks);
}

// ── Link in Bio ───────────────────────────────────────────────

function resolveLinkInBio(template: TemplateDefinition): ResolvedTemplate {
  const { copy, colors } = template;
  const images = template.previewImages;
  const components: BuilderComponent[] = [
    {
      id: `${template.id}-linkinbio-0`,
      type: "linkinbio",
      label: "Link in Bio",
      props: {
        name: template.name,
        bio: copy.aboutText,
        avatarUrl: images[0],
        avatarPlaceholder: false,
        backgroundStyle: "gradient",
        backgroundColor: colors.dark,
        accentColor: colors.primary,
        links: copy.services.map((label, i) => ({
          label,
          url: "#",
          icon: ["Globe", "Instagram", "ShoppingBag", "Mail", "Youtube", "Phone"][i] ?? "Link",
        })),
        socials: [
          { platform: "instagram", url: "" },
          { platform: "tiktok", url: "" },
          { platform: "facebook", url: "" },
        ],
      },
      styles: {
        background: colors.dark,
        color: colors.light,
        paddingTop: "2rem",
        paddingBottom: "2rem",
        minHeight: "100vh",
        textAlign: "center",
      },
      animations: { type: "fadeIn", duration: 500, delay: 0, easing: "ease-out" },
      visibility: { desktop: true, tablet: true, mobile: true },
      children: [],
    },
  ];

  return buildResolvedTemplate(template, components);
}

// ── Digital card ─────────────────────────────────────────────

function resolveDigitalCard(template: TemplateDefinition): ResolvedTemplate {
  const { copy, colors } = template;
  const images = template.previewImages;
  const components: BuilderComponent[] = [
    block(template, "hero", "Wizytówka", {
      badge: copy.eyebrow,
      title: copy.heroTitle,
      subtitle: copy.heroSubtitle,
      ctaText: "Napisz na WhatsApp",
      ctaUrl: "#kontakt",
      ctaSecondText: "Zadzwoń",
      ctaSecondUrl: "tel:+48000000000",
      backgroundImage: images[0],
      imageUrl: images[0],
      imagePlaceholder: false,
      overlayOpacity: 0.2,
    }, 0, {
      background: colors.dark,
      color: colors.light,
      minHeight: "100vh",
      paddingTop: "7rem",
      paddingBottom: "7rem",
    }),
    block(template, "features", "Najważniejsze informacje", {
      title: copy.aboutTitle,
      subtitle: copy.aboutText,
      columns: 3,
      items: copy.services.map((title, index) => ({
        icon: ["Zap", "Star", "Phone"][index] ?? "Check",
        title,
        description: "Najważniejsze informacje podane krótko i konkretnie.",
      })),
    }, 1, { background: colors.light }),
    block(template, "testimonials", "Opinia", {
      title: "Polecają nas klienci",
      items: [
        { name: "Anna K.", role: "Klientka", quote: "Szybki kontakt, jasne zasady i bardzo dobry efekt.", avatar: "" },
      ],
    }, 2, { background: colors.neutral }),
    block(template, "contact", "Kontakt", {
      badge: "Kontakt",
      title: copy.ctaTitle,
      subtitle: "Wybierz najwygodniejszy sposób kontaktu.",
      email: "kontakt@twojafirma.pl",
      phone: "+48 000 000 000",
      address: "Twoje miasto",
      showForm: false,
      imageUrl: images[1],
    }, 3, { background: colors.primary, color: colors.light }),
  ];

  return buildResolvedTemplate(template, components);
}

// ── Commerce ─────────────────────────────────────────────────

function resolveShop(template: TemplateDefinition): ResolvedTemplate {
  const { copy, colors } = template;
  const images = template.previewImages;
  const mini = template.websiteType === "mini-shop";
  const productCount = mini ? 6 : 8;
  const products = Array.from({ length: productCount }, (_, index) => ({
    name: `${copy.services[index % copy.services.length]} ${String(index + 1).padStart(2, "0")}`,
    price: `${[89, 119, 149, 179, 219, 249, 289, 329][index]} zł`,
    imageUrl: images[index % images.length],
    imagePlaceholder: false,
    badge: index === 0 ? "Nowość" : index === 1 ? "Bestseller" : "",
  }));

  const components: BuilderComponent[] = [
    block(template, "navbar", "Nawigacja sklepu", {
      logoText: template.name,
      links: [
        { label: "Nowości", href: "#produkty" },
        { label: "Sklep", href: "#produkty" },
        { label: "O marce", href: "#o-nas" },
        { label: "Kontakt", href: "#kontakt" },
      ],
      ctaText: "Koszyk (0)",
      ctaUrl: "#koszyk",
      sticky: true,
    }, 0, { paddingTop: "1.1rem", paddingBottom: "1.1rem", background: colors.light }),
    block(template, "hero", "Hero sklepu", {
      badge: copy.eyebrow,
      title: copy.heroTitle,
      subtitle: copy.heroSubtitle,
      ctaText: "Zobacz kolekcję",
      ctaUrl: "#produkty",
      ctaSecondText: "Poznaj markę",
      ctaSecondUrl: "#o-nas",
      backgroundImage: images[0],
      imageUrl: images[0],
      imagePlaceholder: false,
      overlayOpacity: 0.16,
    }, 1, { background: colors.dark, color: colors.light, minHeight: "82vh", paddingTop: "9rem", paddingBottom: "9rem" }),
    block(template, "features", "Korzyści zakupowe", {
      title: "Zakupy bez niespodzianek",
      columns: 4,
      items: [
        { icon: "Truck", title: "Szybka wysyłka", description: "Jasny termin realizacji każdego zamówienia." },
        { icon: "Shield", title: "Bezpieczne płatności", description: "Popularne i sprawdzone metody płatności." },
        { icon: "RefreshCw", title: "Prosty zwrot", description: "Czytelne zasady i pomoc obsługi." },
        { icon: "Heart", title: mini ? "Tworzone ręcznie" : "Staranna selekcja", description: "Produkty wybrane z dbałością o jakość." },
      ],
    }, 2, { paddingTop: "3rem", paddingBottom: "3rem", background: colors.light }),
    block(template, "woo-products", "Produkty", {
      title: mini ? "Mała kolekcja" : "Polecane produkty",
      subtitle: mini ? "Krótkie serie tworzone z uwagą" : "Najczęściej wybierane przez klientów",
      columns: mini ? 3 : 4,
      items: products,
      showFilters: !mini,
      showCategories: true,
      categories: copy.services,
    }, 3),
    block(template, "about", "O marce", {
      badge: "O marce",
      title: copy.aboutTitle,
      content: copy.aboutText,
      imageUrl: images[1],
      imageAlt: `${template.name} — historia marki`,
      imagePlaceholder: false,
      layout: "right",
    }, 4, { background: colors.neutral }),
    block(template, "gallery", "Kolekcja", {
      title: "Zobacz produkty w detalach",
      subtitle: "Materiały, faktury i codzienny kontekst",
      columns: 3,
      items: Array.from({ length: 6 }, (_, index) => ({
        imageUrl: images[index % images.length],
        imagePlaceholder: false,
        alt: `${template.industry} — zdjęcie ${index + 1}`,
        caption: `Detal ${String(index + 1).padStart(2, "0")}`,
      })),
    }, 5),
    block(template, "testimonials", "Opinie", {
      title: "Klienci wracają po więcej",
      items: [
        { name: "Marta", role: "Zweryfikowany zakup", quote: "Piękne wykonanie i dopracowane pakowanie. Produkt wygląda jeszcze lepiej na żywo.", avatar: "" },
        { name: "Karolina", role: "Zweryfikowany zakup", quote: "Szybka wysyłka, dobry kontakt i jakość, którą naprawdę czuć.", avatar: "" },
        { name: "Ola", role: "Zweryfikowany zakup", quote: "To już moje kolejne zamówienie i na pewno nie ostatnie.", avatar: "" },
      ],
    }, 6, { background: colors.dark, color: colors.light }),
    block(template, "faq", "FAQ sklepu", {
      title: "Zakupy krok po kroku",
      items: [
        { question: "Jaki jest czas realizacji?", answer: mini ? "Produkty gotowe wysyłamy w 2–3 dni, a wykonywane na zamówienie zgodnie z informacją na karcie." : "Aktualny termin wysyłki znajduje się na każdej karcie produktu." },
        { question: "Jakie są metody dostawy?", answer: "Dostępne opcje i ich koszt zobaczysz przed płatnością." },
        { question: "Czy mogę zwrócić produkt?", answer: "Tak, zasady zwrotu są opisane w regulaminie sklepu." },
        { question: "Czy otrzymam potwierdzenie?", answer: "Po zakupie wyślemy e-mail z podsumowaniem i statusem realizacji." },
      ],
    }, 7),
    block(template, "newsletter", "Newsletter", {
      title: mini ? "Pierwszeństwo do nowych serii" : "Nowości i premiery",
      subtitle: "Zapisz się i otrzymuj tylko najważniejsze informacje.",
      placeholder: "Twój adres e-mail",
      buttonText: "Dołączam",
    }, 8, { background: colors.primary, color: colors.light, textAlign: "center" }),
    block(template, "footer", "Stopka sklepu", {
      logoText: template.name,
      copyright: `© 2026 ${template.name}.`,
      columns: [
        { title: "Zakupy", links: [{ label: "Dostawa", href: "#" }, { label: "Zwroty", href: "#" }, { label: "Płatności", href: "#" }] },
        { title: "Informacje", links: [{ label: "Regulamin", href: "#" }, { label: "Prywatność", href: "#" }, { label: "Kontakt", href: "#kontakt" }] },
        { title: "Obserwuj", links: [{ label: "Instagram", href: "#" }, { label: "Facebook", href: "#" }] },
      ],
    }, 9, { background: colors.dark, color: colors.light, paddingTop: "5rem", paddingBottom: "2rem" }),
  ];

  return buildResolvedTemplate(template, components);
}

// ── Shared builder ────────────────────────────────────────────

function buildResolvedTemplate(template: TemplateDefinition, components: BuilderComponent[]): ResolvedTemplate {
  const { colors } = template;
  return {
    ...template,
    sections: [...new Set([
      ...components.map((component) => component.type),
      "seo",
      "404",
    ])],
    components,
    settings: {
      primaryColor: colors.primary,
      secondaryColor: colors.secondary,
      fontFamily: template.fonts.body,
      colors,
      fonts: template.fonts,
      animationLibrary: ["fade", "slide", "scale", "reveal", "parallax", "sticky sections", "hover effects", "Framer Motion"],
      seo: {
        title: `${template.name} — ${template.industry}`,
        description: template.summary,
      },
      notFound: {
        title: "Ta strona wymknęła się z kadru",
        description: "Nie znaleźliśmy tego adresu. Wróć na stronę główną i spróbuj ponownie.",
        cta: "Wróć na stronę główną",
      },
      sourceTemplateId: template.id,
    },
  };
}

function resolveAny(template: TemplateDefinition): ResolvedTemplate {
  if (template.websiteType === "digital-card") return resolveDigitalCard(template);
  if (template.websiteType === "link-in-bio") return resolveLinkInBio(template);
  if (template.websiteType === "one-page") return resolveOnePage(template);
  if (template.websiteType === "mini-shop" || template.websiteType === "online-shop") {
    return resolveShop(template);
  }
  return resolveTemplate(template);
}

export const templates = normalizedCatalog.map(resolveAny);

export function getTemplateById(id: string) {
  return templates.find((template) => template.id === id);
}
