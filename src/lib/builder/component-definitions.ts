import type { ComponentDefinition, PropSchema } from "@/features/builder/types";

export const COMPONENT_DEFINITIONS: ComponentDefinition[] = [
  // ── LAYOUT ──────────────────────────────────────────────
  {
    type: "navbar",
    label: "Nawigacja",
    category: "layout",
    description: "Górna belka nawigacyjna z logo i linkami",
    defaultProps: {
      logoText: "Twoja Firma",
      logoUrl: "/",
      links: [
        { label: "O nas", href: "#o-nas" },
        { label: "Usługi", href: "#uslugi" },
        { label: "Kontakt", href: "#kontakt" },
      ],
      ctaText: "Skontaktuj się",
      ctaUrl: "#kontakt",
      sticky: true,
    },
    defaultStyles: { background: "#ffffff", paddingTop: "1rem", paddingBottom: "1rem" },
  },
  {
    type: "footer",
    label: "Stopka",
    category: "layout",
    description: "Stopka strony z linkami i prawami autorskimi",
    defaultProps: {
      logoText: "Twoja Firma",
      copyright: "© 2025 Twoja Firma. Wszelkie prawa zastrzeżone.",
      columns: [
        { title: "Firma", links: [{ label: "O nas", href: "#" }, { label: "Kariera", href: "#" }] },
        { title: "Usługi", links: [{ label: "Strony www", href: "#" }, { label: "SEO", href: "#" }] },
        { title: "Kontakt", links: [{ label: "Napisz do nas", href: "#" }, { label: "LinkedIn", href: "#" }] },
      ],
    },
    defaultStyles: { background: "#111111", color: "#ffffff", paddingTop: "4rem", paddingBottom: "2rem" },
  },
  // ── CONTENT ─────────────────────────────────────────────
  {
    type: "hero",
    label: "Hero",
    category: "content",
    description: "Sekcja powitalna z tytułem, opisem i przyciskiem CTA",
    defaultProps: {
      title: "Tworzymy wyjątkowe strony internetowe",
      subtitle: "Profesjonalne strony www dla firm, które chcą wyróżnić się na rynku.",
      ctaText: "Skontaktuj się",
      ctaUrl: "#kontakt",
      ctaSecondText: "Zobacz realizacje",
      ctaSecondUrl: "#realizacje",
      backgroundImage: "",
      overlayOpacity: 0.5,
    },
    defaultStyles: {
      background: "#1a1a2e",
      color: "#ffffff",
      paddingTop: "8rem",
      paddingBottom: "8rem",
      textAlign: "center",
      minHeight: "80vh",
    },
  },
  {
    type: "about",
    label: "O nas",
    category: "content",
    description: "Sekcja przedstawiająca firmę z tekstem i zdjęciem",
    defaultProps: {
      title: "Kim jesteśmy",
      content: "Jesteśmy zespołem pasjonatów tworzących nowoczesne rozwiązania cyfrowe. Od lat pomagamy firmom budować silną obecność online.",
      imageUrl: "",
      imageAlt: "Zdjęcie zespołu",
      layout: "left",
      badge: "O nas",
    },
    defaultStyles: { paddingTop: "5rem", paddingBottom: "5rem" },
  },
  {
    type: "services",
    label: "Usługi",
    category: "content",
    description: "Siatka kart usług z ikonami i opisami",
    defaultProps: {
      title: "Nasze usługi",
      subtitle: "Kompleksowa obsługa Twojego biznesu online",
      columns: 3,
      items: [
        { icon: "Globe", title: "Strony internetowe", description: "Profesjonalne strony www dopasowane do Twojej marki." },
        { icon: "Smartphone", title: "Aplikacje mobilne", description: "Natywne i webowe aplikacje mobilne." },
        { icon: "BarChart", title: "Marketing cyfrowy", description: "Kampanie reklamowe i pozycjonowanie." },
      ],
    },
    defaultStyles: { paddingTop: "5rem", paddingBottom: "5rem", textAlign: "center" },
  },
  {
    type: "features",
    label: "Cechy",
    category: "content",
    description: "Lista cech i korzyści produktu lub usługi",
    defaultProps: {
      title: "Dlaczego my?",
      subtitle: "Wybierz profesjonalistów z doświadczeniem",
      items: [
        { icon: "CheckCircle", title: "Szybka realizacja", description: "Projekty dostarczamy w terminie." },
        { icon: "Shield", title: "Bezpieczeństwo", description: "Najwyższe standardy bezpieczeństwa." },
        { icon: "Headphones", title: "Wsparcie 24/7", description: "Zawsze jesteśmy do Twojej dyspozycji." },
        { icon: "Star", title: "Wysoka jakość", description: "Dbamy o każdy detal projektu." },
      ],
    },
    defaultStyles: { paddingTop: "5rem", paddingBottom: "5rem" },
  },
  {
    type: "gallery",
    label: "Galeria",
    category: "content",
    description: "Siatka zdjęć realizacji lub portfolio",
    defaultProps: {
      title: "Nasze realizacje",
      subtitle: "Zobacz wybrane projekty",
      columns: 3,
      items: [
        { imageUrl: "", alt: "Projekt 1", caption: "Strona firmowa" },
        { imageUrl: "", alt: "Projekt 2", caption: "Sklep online" },
        { imageUrl: "", alt: "Projekt 3", caption: "Aplikacja mobilna" },
        { imageUrl: "", alt: "Projekt 4", caption: "Landing page" },
        { imageUrl: "", alt: "Projekt 5", caption: "Portal informacyjny" },
        { imageUrl: "", alt: "Projekt 6", caption: "System CRM" },
      ],
    },
    defaultStyles: { paddingTop: "5rem", paddingBottom: "5rem" },
  },
  {
    type: "testimonials",
    label: "Opinie",
    category: "content",
    description: "Opinie i referencje klientów",
    defaultProps: {
      title: "Co mówią nasi klienci",
      subtitle: "Zaufali nam i polecają nas dalej",
      items: [
        { name: "Anna Kowalska", role: "CEO", company: "TechStartup", quote: "Świetna współpraca i profesjonalne podejście. Polecam z całego serca!", avatar: "" },
        { name: "Marek Nowak", role: "Dyrektor marketingu", company: "BrandAgency", quote: "Strona przekroczyła nasze oczekiwania. Konwersja wzrosła o 40%.", avatar: "" },
        { name: "Katarzyna Wiśniewska", role: "Właścicielka", company: "BoutiqueShop", quote: "Profesjonalizm i terminowość na najwyższym poziomie.", avatar: "" },
      ],
    },
    defaultStyles: { paddingTop: "5rem", paddingBottom: "5rem", background: "#f9f9f9" },
  },
  {
    type: "faq",
    label: "FAQ",
    category: "content",
    description: "Najczęściej zadawane pytania w formie akordeonu",
    defaultProps: {
      title: "Często zadawane pytania",
      subtitle: "Odpowiedzi na Twoje pytania",
      items: [
        { question: "Ile kosztuje strona internetowa?", answer: "Ceny zaczynają się od 2 000 zł. Ostateczna wycena zależy od zakresu projektu." },
        { question: "Ile trwa realizacja?", answer: "Standardowy projekt realizujemy w 2-4 tygodnie." },
        { question: "Czy oferujecie wsparcie po wdrożeniu?", answer: "Tak, oferujemy różne pakiety wsparcia i utrzymania." },
        { question: "Czy mogę edytować stronę samodzielnie?", answer: "Oczywiście — dostarczamy intuicyjny panel administracyjny." },
      ],
    },
    defaultStyles: { paddingTop: "5rem", paddingBottom: "5rem" },
  },
  {
    type: "pricing",
    label: "Cennik",
    category: "content",
    description: "Tabela cenowa z pakietami i funkcjami",
    defaultProps: {
      title: "Cennik",
      subtitle: "Wybierz pakiet dopasowany do potrzeb",
      items: [
        { name: "Starter", price: "1 990", period: "jednorazowo", features: ["Do 5 podstron", "Formularz kontaktowy", "Responsywność", "SSL"], highlighted: false, ctaText: "Wybierz" },
        { name: "Business", price: "3 990", period: "jednorazowo", features: ["Do 15 podstron", "Blog", "SEO bazowe", "Panel CMS", "Wsparcie 3 mies."], highlighted: true, ctaText: "Najpopularniejszy" },
        { name: "Enterprise", price: "8 990", period: "jednorazowo", features: ["Nielimitowane podstrony", "Sklep online", "SEO zaawansowane", "Integracje API", "Wsparcie 12 mies."], highlighted: false, ctaText: "Wybierz" },
      ],
    },
    defaultStyles: { paddingTop: "5rem", paddingBottom: "5rem", textAlign: "center" },
  },
  {
    type: "cta",
    label: "CTA",
    category: "content",
    description: "Sekcja wezwania do działania",
    defaultProps: {
      title: "Gotowy na nową stronę?",
      subtitle: "Skontaktuj się z nami i otrzymaj bezpłatną wycenę.",
      primaryText: "Bezpłatna wycena",
      primaryUrl: "#kontakt",
      secondaryText: "Zobacz portfolio",
      secondaryUrl: "#portfolio",
    },
    defaultStyles: {
      background: "#d4a83a",
      color: "#000000",
      paddingTop: "5rem",
      paddingBottom: "5rem",
      textAlign: "center",
    },
  },
  {
    type: "statistics",
    label: "Statystyki",
    category: "content",
    description: "Liczby i wskaźniki sukcesu",
    defaultProps: {
      title: "Nasze liczby",
      items: [
        { number: "150+", label: "Projektów" },
        { number: "8 lat", label: "Doświadczenia" },
        { number: "98%", label: "Zadowolonych klientów" },
        { number: "24/7", label: "Wsparcie" },
      ],
    },
    defaultStyles: { paddingTop: "4rem", paddingBottom: "4rem", textAlign: "center" },
  },
  {
    type: "team",
    label: "Zespół",
    category: "content",
    description: "Prezentacja członków zespołu",
    defaultProps: {
      title: "Nasz zespół",
      subtitle: "Eksperci, którzy zadbają o Twój projekt",
      columns: 4,
      items: [
        { name: "Jan Kowalski", role: "CEO & Founder", bio: "15 lat doświadczenia w branży IT.", imageUrl: "" },
        { name: "Anna Nowak", role: "Lead Designer", bio: "Specjalistka od UX/UI.", imageUrl: "" },
        { name: "Piotr Wiśniewski", role: "CTO", bio: "Architekt systemów i rozwiązań webowych.", imageUrl: "" },
        { name: "Maria Jabłońska", role: "Marketing Manager", bio: "Ekspertka od marketingu cyfrowego.", imageUrl: "" },
      ],
    },
    defaultStyles: { paddingTop: "5rem", paddingBottom: "5rem", textAlign: "center" },
  },
  {
    type: "timeline",
    label: "Historia",
    category: "content",
    description: "Oś czasu z historią firmy lub projektu",
    defaultProps: {
      title: "Nasza historia",
      subtitle: "Jak doszliśmy do tego, gdzie jesteśmy",
      items: [
        { year: "2015", title: "Założenie firmy", description: "Zaczęliśmy od małego studia projektowego." },
        { year: "2018", title: "Pierwszych 50 klientów", description: "Rozrosliśmy się do 8-osobowego zespołu." },
        { year: "2021", title: "Ekspansja", description: "Otworzyliśmy drugie biuro w Krakowie." },
        { year: "2024", title: "150+ projektów", description: "Zostaliśmy uznanym liderem rynku." },
      ],
    },
    defaultStyles: { paddingTop: "5rem", paddingBottom: "5rem" },
  },
  {
    type: "steps",
    label: "Kroki",
    category: "content",
    description: "Proces krok po kroku",
    defaultProps: {
      title: "Jak działamy",
      subtitle: "Prosty proces realizacji projektu",
      items: [
        { step: "01", title: "Rozmowa", description: "Poznajemy Twoje potrzeby i cele biznesowe." },
        { step: "02", title: "Wycena", description: "Przygotowujemy szczegółową ofertę." },
        { step: "03", title: "Realizacja", description: "Projektujemy i wdrażamy stronę." },
        { step: "04", title: "Wdrożenie", description: "Strona trafia na serwer i zaczyna działać." },
      ],
    },
    defaultStyles: { paddingTop: "5rem", paddingBottom: "5rem" },
  },
  {
    type: "contact",
    label: "Kontakt",
    category: "content",
    description: "Formularz kontaktowy z danymi firmy",
    defaultProps: {
      title: "Kontakt",
      subtitle: "Napisz do nas lub zadzwoń",
      email: "kontakt@twojafirma.pl",
      phone: "+48 123 456 789",
      address: "ul. Przykładowa 1, 00-001 Warszawa",
      showForm: true,
    },
    defaultStyles: { paddingTop: "5rem", paddingBottom: "5rem" },
  },
  // ── MEDIA ────────────────────────────────────────────────
  {
    type: "video",
    label: "Wideo",
    category: "media",
    description: "Osadzone wideo z YouTube lub Vimeo",
    defaultProps: {
      title: "Obejrzyj nasz film",
      videoUrl: "",
      poster: "",
      caption: "",
      autoplay: false,
    },
    defaultStyles: { paddingTop: "5rem", paddingBottom: "5rem", textAlign: "center" },
  },
  {
    type: "map",
    label: "Mapa",
    category: "media",
    description: "Mapa Google Maps z lokalizacją firmy",
    defaultProps: {
      title: "Gdzie nas znajdziesz",
      address: "ul. Przykładowa 1, 00-001 Warszawa",
      embedUrl: "",
      zoom: 15,
    },
    defaultStyles: { paddingTop: "3rem", paddingBottom: "0" },
  },
  // ── SOCIAL & FEEDS ────────────────────────────────────────
  {
    type: "newsletter",
    label: "Newsletter",
    category: "social",
    description: "Formularz zapisu do newslettera",
    defaultProps: {
      title: "Bądź na bieżąco",
      subtitle: "Zapisz się do naszego newslettera i otrzymuj najnowsze informacje.",
      placeholder: "Twój adres email",
      buttonText: "Zapisz się",
      privacyText: "Nie wysyłamy spamu. W każdej chwili możesz się wypisać.",
    },
    defaultStyles: {
      paddingTop: "5rem",
      paddingBottom: "5rem",
      textAlign: "center",
      background: "#f5f5f5",
    },
  },
  {
    type: "instagram",
    label: "Instagram Feed",
    category: "social",
    description: "Feed z Instagrama (wymaga integracji API)",
    defaultProps: {
      title: "Śledź nas na Instagramie",
      handle: "@twojafirma",
      profileUrl: "",
      count: 9,
    },
    defaultStyles: { paddingTop: "4rem", paddingBottom: "4rem", textAlign: "center" },
  },
  {
    type: "tiktok",
    label: "TikTok Feed",
    category: "social",
    description: "Feed z TikToka (placeholder — wymaga integracji)",
    defaultProps: {
      title: "Znajdź nas na TikToku",
      handle: "@twojafirma",
      count: 6,
    },
    defaultStyles: { paddingTop: "4rem", paddingBottom: "4rem", textAlign: "center" },
  },
  // ── COMMERCE ─────────────────────────────────────────────
  {
    type: "woo-products",
    label: "Produkty WooCommerce",
    category: "commerce",
    description: "Siatka produktów z WooCommerce (placeholder)",
    defaultProps: {
      title: "Nasze produkty",
      subtitle: "Sprawdź naszą ofertę",
      count: 6,
      category: "",
      columns: 3,
    },
    defaultStyles: { paddingTop: "5rem", paddingBottom: "5rem" },
  },
  // ── BLOG ─────────────────────────────────────────────────
  {
    type: "blog",
    label: "Blog",
    category: "commerce",
    description: "Najnowsze wpisy blogowe (placeholder)",
    defaultProps: {
      title: "Aktualności",
      subtitle: "Najnowsze artykuły i porady",
      count: 3,
      category: "",
      showDate: true,
    },
    defaultStyles: { paddingTop: "5rem", paddingBottom: "5rem" },
  },
  // ── NOWE SEKCJE ──────────────────────────────────────────
  {
    type: "separator",
    label: "Odstęp / Linia",
    category: "layout",
    description: "Pionowy odstęp lub pozioma linia między sekcjami",
    defaultProps: {
      height: 60,
      style: "none",
      color: "#e5e7eb",
      label: "",
    },
    defaultStyles: { paddingTop: "0", paddingBottom: "0" },
  },
  {
    type: "text",
    label: "Blok tekstu",
    category: "content",
    description: "Nagłówek z treścią — prosty blok tekstowy",
    defaultProps: {
      eyebrow: "",
      heading: "Nagłówek sekcji",
      headingLevel: "h2",
      content: "Wpisz treść swojej sekcji. Możesz tu umieścić dłuższy opis, informacje o firmie, regulamin lub dowolny tekst.",
      align: "left",
    },
    defaultStyles: { paddingTop: "4rem", paddingBottom: "4rem" },
  },
  {
    type: "logos",
    label: "Logotypy / Partnerzy",
    category: "content",
    description: "Siatka logotypów klientów, partnerów lub certyfikatów",
    defaultProps: {
      title: "Zaufali nam",
      subtitle: "",
      items: [
        { name: "Firma A", logoUrl: "", href: "#" },
        { name: "Firma B", logoUrl: "", href: "#" },
        { name: "Firma C", logoUrl: "", href: "#" },
        { name: "Firma D", logoUrl: "", href: "#" },
        { name: "Firma E", logoUrl: "", href: "#" },
        { name: "Firma F", logoUrl: "", href: "#" },
      ],
    },
    defaultStyles: { paddingTop: "4rem", paddingBottom: "4rem", textAlign: "center" },
  },
  {
    type: "portfolio",
    label: "Portfolio",
    category: "content",
    description: "Siatka projektów z kategoriami i opisami",
    defaultProps: {
      title: "Nasze realizacje",
      subtitle: "Zobacz wybrane projekty z naszego portfolio",
      columns: 3,
      items: [
        { title: "Projekt Alpha", category: "Strony www", imageUrl: "", description: "Nowoczesna strona firmowa dla klienta z branży IT.", href: "#" },
        { title: "Projekt Beta", category: "Sklepy online", imageUrl: "", description: "Sklep e-commerce z integracją płatności.", href: "#" },
        { title: "Projekt Gamma", category: "Aplikacje", imageUrl: "", description: "Mobilna aplikacja dla salonu beauty.", href: "#" },
        { title: "Projekt Delta", category: "Strony www", imageUrl: "", description: "Landing page z wysoką konwersją.", href: "#" },
        { title: "Projekt Epsilon", category: "Sklepy online", imageUrl: "", description: "Hurtownia online z panelem B2B.", href: "#" },
        { title: "Projekt Zeta", category: "Aplikacje", imageUrl: "", description: "System rezerwacji online dla restauracji.", href: "#" },
      ],
    },
    defaultStyles: { paddingTop: "5rem", paddingBottom: "5rem" },
  },
  {
    type: "banner",
    label: "Baner / Ogłoszenie",
    category: "content",
    description: "Pełnoszerokościowy pasek ogłoszenia lub promocji",
    defaultProps: {
      text: "Oferta specjalna — 20% zniżki na wszystkie pakiety!",
      subtext: "Tylko do końca miesiąca",
      ctaText: "Sprawdź ofertę",
      ctaUrl: "#cennik",
      closeable: false,
    },
    defaultStyles: {
      background: "#d4a83a",
      color: "#000000",
      paddingTop: "1rem",
      paddingBottom: "1rem",
      textAlign: "center",
    },
  },
  {
    type: "columns",
    label: "Dwie kolumny",
    category: "layout",
    description: "Dwie lub trzy kolumny z tytułem, tekstem i opcjonalnym CTA",
    defaultProps: {
      columns: [
        { icon: "Zap", heading: "Szybka realizacja", content: "Twoje projekty dostarczamy w rekordowym czasie, bez kompromisów w jakości.", ctaText: "", ctaUrl: "" },
        { icon: "Shield", heading: "Pełne bezpieczeństwo", content: "Stosujemy najwyższe standardy bezpieczeństwa i dbamy o Twoje dane.", ctaText: "", ctaUrl: "" },
      ],
    },
    defaultStyles: { paddingTop: "5rem", paddingBottom: "5rem" },
  },
  {
    type: "quote",
    label: "Cytat",
    category: "content",
    description: "Wyróżniony cytat lub opinia z autorem",
    defaultProps: {
      quote: "To była najlepsza decyzja biznesowa — inwestycja w profesjonalną stronę www zwróciła się już w pierwszym miesiącu.",
      author: "Anna Kowalska",
      role: "Właścicielka",
      company: "Kwiaciarnia Marta",
      avatarUrl: "",
      style: "large",
    },
    defaultStyles: {
      paddingTop: "5rem",
      paddingBottom: "5rem",
      textAlign: "center",
      background: "#f9f9f9",
    },
  },
  {
    type: "image",
    label: "Zdjęcie",
    category: "media",
    description: "Pojedyncze zdjęcie z opcjonalnym podpisem i linkiem",
    defaultProps: {
      imageUrl: "",
      alt: "Zdjęcie",
      caption: "",
      href: "",
      style: "contained",
    },
    defaultStyles: { paddingTop: "3rem", paddingBottom: "3rem", textAlign: "center" },
  },
  // ── Warianty nawigacji ───────────────────────────────────
  {
    type: "navbar-minimal",
    label: "Nawigacja minimalna",
    category: "layout",
    description: "Prosta nawigacja: logo + hamburger + opcjonalny przycisk CTA",
    defaultProps: {
      logoText: "Twoja Marka",
      logoUrl: "",
      ctaText: "Kontakt",
      ctaUrl: "#kontakt",
      backgroundColor: "transparent",
    },
    defaultStyles: { background: "transparent", paddingTop: "1rem", paddingBottom: "1rem" },
  },
  {
    type: "navbar-centered",
    label: "Nawigacja wyśrodkowana",
    category: "layout",
    description: "Logo pośrodku u góry, linki nawigacji poniżej",
    defaultProps: {
      logoText: "Twoja Marka",
      logoUrl: "",
      links: [
        { label: "Strona główna", url: "#" },
        { label: "O nas", url: "#o-nas" },
        { label: "Oferta", url: "#oferta" },
        { label: "Kontakt", url: "#kontakt" },
      ],
    },
    defaultStyles: { background: "#ffffff", paddingTop: "1.5rem", paddingBottom: "0", textAlign: "center" },
  },
  // ── Warianty stopki ──────────────────────────────────────
  {
    type: "footer-minimal",
    label: "Stopka minimalna",
    category: "layout",
    description: "Jeden wiersz: logo, linki i prawa autorskie",
    defaultProps: {
      logoText: "Twoja Marka",
      copyright: `© ${new Date().getFullYear()} Twoja Marka. Wszelkie prawa zastrzeżone.`,
      links: [
        { label: "Polityka prywatności", url: "#" },
        { label: "Regulamin", url: "#" },
      ],
    },
    defaultStyles: { background: "#111111", color: "#ffffff", paddingTop: "1.5rem", paddingBottom: "1.5rem" },
  },
  {
    type: "footer-extended",
    label: "Stopka z newsletterem",
    category: "layout",
    description: "Stopka z kolumnami linków i formularzem zapisu do newslettera",
    defaultProps: {
      logoText: "Twoja Marka",
      tagline: "Tworzymy strony, które sprzedają.",
      newsletterTitle: "Bądź na bieżąco",
      newsletterPlaceholder: "Twój adres email",
      newsletterButton: "Zapisz się",
      copyright: `© ${new Date().getFullYear()} Twoja Marka`,
      columns: [
        {
          title: "Firma",
          links: [{ label: "O nas", url: "#" }, { label: "Zespół", url: "#" }, { label: "Kariera", url: "#" }],
        },
        {
          title: "Oferta",
          links: [{ label: "Strony www", url: "#" }, { label: "Sklepy", url: "#" }, { label: "Aplikacje", url: "#" }],
        },
      ],
    },
    defaultStyles: { background: "#0f0f1a", color: "#ffffff", paddingTop: "4rem", paddingBottom: "2rem" },
  },
  // ── Dodatkowe sekcje ─────────────────────────────────────
  {
    type: "hero-split",
    label: "Hero podzielony",
    category: "content",
    description: "Hero z tekstem po lewej i dużym zdjęciem po prawej (50/50)",
    defaultProps: {
      eyebrow: "Witaj w",
      title: "Profesjonalna strona dla Twojej firmy",
      subtitle: "Tworzymy nowoczesne strony internetowe, które przyciągają klientów i budują zaufanie do marki.",
      ctaText: "Umów bezpłatną konsultację",
      ctaUrl: "#kontakt",
      ctaSecondText: "Zobacz realizacje",
      ctaSecondUrl: "#portfolio",
      imageUrl: "",
      imageAlt: "Hero image",
    },
    defaultStyles: { paddingTop: "0", paddingBottom: "0", minHeight: "90vh" },
  },
  {
    type: "process",
    label: "Jak to działa",
    category: "content",
    description: "Numerowane kroki pokazujące proces współpracy lub działania produktu",
    defaultProps: {
      eyebrow: "Proces",
      title: "Jak wygląda nasza współpraca",
      subtitle: "Prosta ścieżka od pierwszego kontaktu do gotowej strony",
      items: [
        { number: "01", title: "Bezpłatna konsultacja", description: "Rozmawiamy o Twoich celach i potrzebach. Bez zobowiązań, bez technicznego żargonu." },
        { number: "02", title: "Projekt i strategia", description: "Tworzymy projekt graficzny i plan treści dopasowany do Twojej branży." },
        { number: "03", title: "Realizacja", description: "Kodujemy stronę, optymalizujemy pod SEO i testujemy na wszystkich urządzeniach." },
        { number: "04", title: "Wdrożenie i wsparcie", description: "Publikujemy stronę i zostajemy z Tobą — serwis, aktualizacje, pomoc." },
      ],
    },
    defaultStyles: { paddingTop: "5rem", paddingBottom: "5rem" },
  },
  {
    type: "awards",
    label: "Certyfikaty i nagrody",
    category: "content",
    description: "Odznaczenia, certyfikaty, nagrody branżowe i wyróżnienia",
    defaultProps: {
      title: "Nasze certyfikaty i wyróżnienia",
      subtitle: "",
      items: [
        { name: "Google Partner", year: "2024", imageUrl: "", description: "Certyfikowany partner Google Ads" },
        { name: "ISO 9001", year: "2023", imageUrl: "", description: "Certyfikat zarządzania jakością" },
        { name: "Firma roku", year: "2024", imageUrl: "", description: "Wyróżnienie w kategorii Usługi IT" },
        { name: "Clutch Top 100", year: "2024", imageUrl: "", description: "Top 100 agencji webowych w Polsce" },
      ],
    },
    defaultStyles: { paddingTop: "4rem", paddingBottom: "4rem", textAlign: "center" },
  },
  {
    type: "comparison",
    label: "Porównanie",
    category: "content",
    description: "Tabela porównawcza opcji, pakietów lub metod",
    defaultProps: {
      title: "Dlaczego warto wybrać nas?",
      subtitle: "Porównaj nasze podejście z tradycyjnymi rozwiązaniami",
      columns: ["Tradycyjna agencja", "Nasza oferta"],
      rows: [
        { feature: "Czas realizacji", values: ["4–8 tygodni", "1–2 tygodnie"] },
        { feature: "Cena", values: ["5 000–20 000 zł", "Od 1 500 zł"] },
        { feature: "Wsparcie po wdrożeniu", values: ["Płatny serwis", "Wliczone w pakiet"] },
        { feature: "Zmiany w treści", values: ["Przez agencję", "Samodzielnie"] },
        { feature: "SEO", values: ["Opcja extra", "W standardzie"] },
      ],
    },
    defaultStyles: { paddingTop: "5rem", paddingBottom: "5rem" },
  },
  {
    type: "countdown",
    label: "Odliczanie",
    category: "content",
    description: "Zegar odliczający do wydarzenia, zakończenia oferty lub premiery",
    defaultProps: {
      title: "Oferta kończy się za:",
      subtitle: "Skorzystaj z promocji zanim wygaśnie",
      targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      ctaText: "Skorzystaj z oferty",
      ctaUrl: "#kontakt",
    },
    defaultStyles: {
      background: "#1a1a2e",
      color: "#ffffff",
      paddingTop: "4rem",
      paddingBottom: "4rem",
      textAlign: "center",
    },
  },
  {
    type: "careers",
    label: "Kariera / Oferty pracy",
    category: "content",
    description: "Lista otwartych stanowisk z opisami i przyciskami aplikowania",
    defaultProps: {
      title: "Dołącz do naszego zespołu",
      subtitle: "Szukamy ludzi z pasją, którzy chcą tworzyć rzeczy, które mają znaczenie.",
      items: [
        { title: "Web Developer (React/Next.js)", type: "Pełny etat", location: "Warszawa / Zdalnie", description: "Szukamy doświadczonego dewelopera do tworzenia nowoczesnych aplikacji webowych.", applyUrl: "#" },
        { title: "UX/UI Designer", type: "Pełny etat", location: "Warszawa / Zdalnie", description: "Projektujesz intuicyjne interfejsy i dbasz o doświadczenie użytkownika.", applyUrl: "#" },
        { title: "Project Manager", type: "Pełny etat", location: "Warszawa", description: "Koordynujesz projekty webowe, kontaktujesz się z klientami i zarządzasz harmonogramem.", applyUrl: "#" },
      ],
    },
    defaultStyles: { paddingTop: "5rem", paddingBottom: "5rem" },
  },
  {
    type: "menu-section",
    label: "Menu (restauracja)",
    category: "content",
    description: "Karta dań z kategoriami, pozycjami i cenami",
    defaultProps: {
      title: "Nasze menu",
      subtitle: "Świeże składniki, tradycyjne smaki",
      categories: [
        {
          name: "Przystawki",
          items: [
            { name: "Zupa dnia", description: "Codziennie inna, zawsze pyszna", price: "12 zł", badge: "" },
            { name: "Tatar wołowy", description: "Z żółtkiem i kaparami", price: "32 zł", badge: "Bestseller" },
            { name: "Carpaccio", description: "Z parmezanem i rukolą", price: "28 zł", badge: "" },
          ],
        },
        {
          name: "Dania główne",
          items: [
            { name: "Stek ribeye 300g", description: "Z warzywami sezonowymi", price: "89 zł", badge: "Chef's choice" },
            { name: "Łosoś grillowany", description: "Z ryżem jaśminowym i cytryną", price: "68 zł", badge: "" },
            { name: "Risotto grzybowe", description: "Z truflowym olejem", price: "52 zł", badge: "Wege" },
          ],
        },
        {
          name: "Desery",
          items: [
            { name: "Tiramisu", description: "Klasyczne włoskie", price: "22 zł", badge: "" },
            { name: "Crème brûlée", description: "Z owocami sezonowymi", price: "24 zł", badge: "" },
          ],
        },
      ],
      showPrices: true,
      layout: "tabs",
    },
    defaultStyles: { paddingTop: "5rem", paddingBottom: "5rem" },
  },
  {
    type: "reservation",
    label: "Rezerwacja / Booking",
    category: "content",
    description: "Formularz rezerwacji stolika, wizyty lub terminu",
    defaultProps: {
      title: "Zarezerwuj stolik",
      subtitle: "Rezerwacje przyjmujemy online — potwierdzenie otrzymasz na e-mail.",
      fields: ["name", "email", "phone", "date", "time", "guests", "message"],
      ctaText: "Zarezerwuj",
      phone: "+48 123 456 789",
      email: "rezerwacje@restauracja.pl",
      hours: "Pon–Sob: 12:00–22:00 | Nd: 12:00–20:00",
    },
    defaultStyles: { paddingTop: "5rem", paddingBottom: "5rem", background: "#f9f9f9" },
  },
  {
    type: "accordion",
    label: "Akordeon",
    category: "content",
    description: "Rozwijane panele z treścią — alternatywa dla FAQ",
    defaultProps: {
      title: "",
      items: [
        { heading: "Czym się zajmujemy?", content: "Tworzymy profesjonalne strony internetowe, sklepy online i aplikacje mobilne dla małych i średnich firm." },
        { heading: "Jaki jest czas realizacji?", content: "Standardowy projekt realizujemy w 2–4 tygodnie. Czas zależy od zakresu i stopnia skomplikowania projektu." },
        { heading: "Czy oferujecie wsparcie?", content: "Tak — serwis techniczny, aktualizacje i konsultacje wliczone są w nasze pakiety utrzymaniowe." },
        { heading: "Jak wygląda rozliczenie?", content: "Pracujemy w modelu: 50% zaliczki przed startem, 50% po oddaniu gotowego projektu." },
      ],
      allowMultiple: false,
    },
    defaultStyles: { paddingTop: "4rem", paddingBottom: "4rem" },
  },
  {
    type: "tabs",
    label: "Zakładki",
    category: "content",
    description: "Treść podzielona na zakładki — usługi, kategorie, tematy",
    defaultProps: {
      title: "",
      tabs: [
        { label: "Strony www", content: "Tworzymy szybkie, responsywne i piękne strony internetowe dopasowane do Twojej marki.", imageUrl: "" },
        { label: "Sklepy online", content: "Sklepy e-commerce z pełną obsługą płatności, logistyki i zarządzania produktami.", imageUrl: "" },
        { label: "SEO i marketing", content: "Pozycjonowanie, kampanie Google Ads i social media — więcej ruchu, więcej klientów.", imageUrl: "" },
      ],
    },
    defaultStyles: { paddingTop: "5rem", paddingBottom: "5rem" },
  },
  {
    type: "slider",
    label: "Slider / Karuzela",
    category: "media",
    description: "Pokaz slajdów ze zdjęciami, nagłówkami i opcjonalnym CTA",
    defaultProps: {
      slides: [
        { imageUrl: "", title: "Slajd 1", subtitle: "Opis slajdu 1", ctaText: "", ctaUrl: "" },
        { imageUrl: "", title: "Slajd 2", subtitle: "Opis slajdu 2", ctaText: "", ctaUrl: "" },
        { imageUrl: "", title: "Slajd 3", subtitle: "Opis slajdu 3", ctaText: "", ctaUrl: "" },
      ],
      autoplay: true,
      interval: 5000,
      arrows: true,
      dots: true,
      height: "500px",
    },
    defaultStyles: { paddingTop: "0", paddingBottom: "0" },
  },
  {
    type: "hero-video",
    label: "Hero z wideo",
    category: "content",
    description: "Hero z filmem w tle (YouTube, Vimeo lub plik mp4)",
    defaultProps: {
      title: "Tworzymy strony, które zachwycają",
      subtitle: "Nowoczesny design, szybkość i konwersja — to nasza specjalność.",
      ctaText: "Skontaktuj się",
      ctaUrl: "#kontakt",
      videoUrl: "",
      posterUrl: "",
      overlayOpacity: 0.6,
      overlayColor: "#000000",
    },
    defaultStyles: {
      color: "#ffffff",
      paddingTop: "10rem",
      paddingBottom: "10rem",
      textAlign: "center",
      minHeight: "100vh",
    },
  },
  {
    type: "hero-fullscreen",
    label: "Hero pełnoekranowy",
    category: "content",
    description: "Minimalistyczny hero zajmujący całą wysokość ekranu",
    defaultProps: {
      eyebrow: "Studio projektowe",
      title: "Wyjątkowe strony\ndla wyjątkowych firm",
      ctaText: "Porozmawiajmy →",
      ctaUrl: "#kontakt",
      backgroundImage: "",
      backgroundStyle: "dark",
      scrollIndicator: true,
    },
    defaultStyles: {
      background: "#0f0f1a",
      color: "#ffffff",
      paddingTop: "0",
      paddingBottom: "0",
      minHeight: "100vh",
      textAlign: "center",
    },
  },
  {
    type: "reviews-grid",
    label: "Opinie (Google/FB)",
    category: "content",
    description: "Siatka opinii w stylu Google Maps z gwiazdkami i awatarami",
    defaultProps: {
      title: "Opinie klientów",
      subtitle: "4.9 / 5 — na podstawie 48 opinii",
      rating: 4.9,
      platform: "google",
      items: [
        { name: "Agnieszka K.", rating: 5, date: "2 tygodnie temu", text: "Niesamowita praca! Strona jest piękna, szybka i dokładnie taka, jakiej chciałam. Polecam całym sercem!", avatar: "" },
        { name: "Tomasz W.", rating: 5, date: "1 miesiąc temu", text: "Profesjonalizm na najwyższym poziomie. Praca zrealizowana szybciej niż zakładano. Bardzo dobre ceny jak na jakość.", avatar: "" },
        { name: "Monika S.", rating: 5, date: "3 miesiące temu", text: "Świetny kontakt, szybka realizacja i efekt przerósł moje oczekiwania. Sklep działa idealnie.", avatar: "" },
        { name: "Rafał M.", rating: 4, date: "4 miesiące temu", text: "Dobra współpraca, projekt oddany w terminie. Kilka poprawek zostało wprowadzonych bez problemu.", avatar: "" },
        { name: "Katarzyna L.", rating: 5, date: "5 miesięcy temu", text: "Polecam! Strona przyciąga nowych klientów — widzę wzrost zapytań już od pierwszego tygodnia.", avatar: "" },
        { name: "Bartosz N.", rating: 5, date: "6 miesięcy temu", text: "Bardzo zadowolony z efektu końcowego. Profesjonalna obsługa i dobry kontakt przez cały projekt.", avatar: "" },
      ],
    },
    defaultStyles: { paddingTop: "5rem", paddingBottom: "5rem", background: "#f9f9f9" },
  },
  {
    type: "media-row",
    label: "Tekst + Media",
    category: "content",
    description: "Naprzemienne wiersze: tekst po jednej stronie, zdjęcie lub wideo po drugiej",
    defaultProps: {
      rows: [
        { heading: "Projekt i strategia", content: "Zaczynamy od poznania Twoich celów. Analizujemy rynek, konkurencję i grupę docelową, by stworzyć strategię, która naprawdę działa.", imageUrl: "", layout: "image-right", badge: "01" },
        { heading: "Design i realizacja", content: "Projektujemy i kodujemy stronę, dbając o każdy piksel. Responsywna, szybka i zgodna z najnowszymi standardami.", imageUrl: "", layout: "image-left", badge: "02" },
        { heading: "Wdrożenie i wsparcie", content: "Publikujemy stronę i zapewniamy wsparcie techniczne. Serwis, aktualizacje i optymalizacja przez cały okres współpracy.", imageUrl: "", layout: "image-right", badge: "03" },
      ],
    },
    defaultStyles: { paddingTop: "4rem", paddingBottom: "4rem" },
  },
  {
    type: "icon-grid",
    label: "Siatka ikon",
    category: "content",
    description: "Kompaktowa siatka ikona + etykieta — wartości, funkcje, cechy",
    defaultProps: {
      title: "Wszystko, czego potrzebujesz",
      subtitle: "",
      columns: 4,
      items: [
        { icon: "Zap", label: "Szybka realizacja" },
        { icon: "Shield", label: "Bezpieczny kod" },
        { icon: "Smartphone", label: "Responsywność" },
        { icon: "Search", label: "SEO w standardzie" },
        { icon: "BarChart2", label: "Analityka" },
        { icon: "Headphones", label: "Wsparcie 24/7" },
        { icon: "Globe", label: "Hosting w cenie" },
        { icon: "Lock", label: "SSL i HTTPS" },
      ],
    },
    defaultStyles: { paddingTop: "4rem", paddingBottom: "4rem", textAlign: "center" },
  },
  {
    type: "pricing-toggle",
    label: "Cennik z przełącznikiem",
    category: "content",
    description: "Cennik z przełącznikiem Miesięcznie / Rocznie i oszczędnościami",
    defaultProps: {
      title: "Wybierz swój plan",
      subtitle: "Oszczędź do 20% przy rozliczeniu rocznym",
      items: [
        {
          name: "Starter",
          monthlyPrice: "199",
          yearlyPrice: "159",
          period: "mies.",
          features: ["1 strona", "5 GB miejsca", "SSL", "Pomoc techniczna"],
          highlighted: false,
          ctaText: "Zacznij za darmo",
          ctaUrl: "#kontakt",
        },
        {
          name: "Business",
          monthlyPrice: "399",
          yearlyPrice: "319",
          period: "mies.",
          features: ["Do 10 stron", "20 GB miejsca", "SSL", "CMS", "SEO", "Wsparcie priorytetowe"],
          highlighted: true,
          badge: "Najpopularniejszy",
          ctaText: "Wypróbuj 14 dni",
          ctaUrl: "#kontakt",
        },
        {
          name: "Enterprise",
          monthlyPrice: "899",
          yearlyPrice: "719",
          period: "mies.",
          features: ["Nielimitowane strony", "100 GB miejsca", "SSL", "CMS", "SEO Pro", "Dedykowany opiekun"],
          highlighted: false,
          ctaText: "Porozmawiajmy",
          ctaUrl: "#kontakt",
        },
      ],
    },
    defaultStyles: { paddingTop: "5rem", paddingBottom: "5rem", textAlign: "center" },
  },
  {
    type: "sticky-cta",
    label: "Pasek CTA (sticky)",
    category: "layout",
    description: "Przyklejony pasek na dole strony z przyciskiem akcji",
    defaultProps: {
      text: "Chcesz taką stronę dla swojej firmy?",
      ctaText: "Zamów teraz →",
      ctaUrl: "#kontakt",
      closeable: true,
      position: "bottom",
    },
    defaultStyles: {
      background: "#1a1a2e",
      color: "#ffffff",
      paddingTop: ".75rem",
      paddingBottom: ".75rem",
      textAlign: "center",
    },
  },
  {
    type: "before-after",
    label: "Przed / Po",
    category: "media",
    description: "Porównanie dwóch zdjęć: przed i po (slider)",
    defaultProps: {
      title: "Efekty naszej pracy",
      subtitle: "Przeciągnij suwak, żeby porównać",
      beforeImageUrl: "",
      afterImageUrl: "",
      beforeLabel: "Przed",
      afterLabel: "Po",
    },
    defaultStyles: { paddingTop: "5rem", paddingBottom: "5rem" },
  },
  {
    type: "links-list",
    label: "Lista linków",
    category: "content",
    description: "Prosta lista linków z ikoną, tytułem i opcjonalnym opisem",
    defaultProps: {
      title: "",
      items: [
        { icon: "FileText", label: "Cennik usług 2025", description: "Pobierz PDF z pełnym cennikiem", url: "#", external: false },
        { icon: "Download", label: "Portfolio realizacji", description: "Case studies i przykładowe projekty", url: "#", external: false },
        { icon: "Globe", label: "Nasza strona główna", description: "", url: "#", external: true },
      ],
    },
    defaultStyles: { paddingTop: "4rem", paddingBottom: "4rem" },
  },
  {
    type: "event",
    label: "Wydarzenie / Harmonogram",
    category: "content",
    description: "Lista wydarzeń, szkoleń, webinarów lub harmonogram",
    defaultProps: {
      title: "Nadchodzące wydarzenia",
      subtitle: "",
      items: [
        { date: "15 LUT", title: "Bezpłatne szkolenie: SEO dla małych firm", description: "Jak wypozycjonować stronę samodzielnie bez wydawania fortuny.", time: "18:00–20:00", location: "Online (Zoom)", badge: "Bezpłatne", url: "#" },
        { date: "22 LUT", title: "Webinar: AI w marketingu 2025", description: "Jak wykorzystać sztuczną inteligencję do tworzenia treści i reklam.", time: "17:00–18:30", location: "Online", badge: "Premium", url: "#" },
        { date: "8 MAR", title: "Konferencja: Digital Summit Warszawa", description: "Największe wydarzenie dla digital marketerów w Polsce.", time: "9:00–18:00", location: "Warszawa", badge: "", url: "#" },
      ],
    },
    defaultStyles: { paddingTop: "5rem", paddingBottom: "5rem" },
  },
  {
    type: "linkinbio",
    label: "Link in Bio",
    category: "social",
    description: "Strona profilu z listą linków (Linktree style)",
    defaultProps: {
      name: "Twoje Imię / Marka",
      bio: "Krótki opis — kim jesteś i czym się zajmujesz.",
      avatarUrl: "",
      avatarPlaceholder: true,
      backgroundStyle: "gradient",
      backgroundColor: "#1a1a2e",
      accentColor: "#b08d57",
      links: [
        { label: "Moja strona", url: "https://example.com", icon: "Globe" },
        { label: "Instagram", url: "https://instagram.com", icon: "Instagram" },
        { label: "Sklep online", url: "https://example.com/sklep", icon: "ShoppingBag" },
        { label: "Napisz do mnie", url: "mailto:hello@example.com", icon: "Mail" },
      ],
      socials: [
        { platform: "instagram", url: "" },
        { platform: "tiktok", url: "" },
        { platform: "facebook", url: "" },
      ],
    },
    defaultStyles: {
      background: "#1a1a2e",
      color: "#ffffff",
      paddingTop: "3rem",
      paddingBottom: "3rem",
      minHeight: "100vh",
      textAlign: "center",
    },
  },
];

export const COMPONENT_CATEGORIES = [
  { key: "layout", label: "Układ" },
  { key: "content", label: "Treść" },
  { key: "media", label: "Media" },
  { key: "social", label: "Social" },
  { key: "commerce", label: "Sklep / Blog" },
] as const;

export function getComponentDefinition(type: string): ComponentDefinition | undefined {
  return COMPONENT_DEFINITIONS.find((d) => d.type === type);
}

export const PROP_SCHEMAS: PropSchema[] = [
  {
    type: "hero",
    fields: [
      { key: "title", label: "Tytuł", type: "text", placeholder: "Wpisz tytuł hero" },
      { key: "subtitle", label: "Podtytuł", type: "textarea", placeholder: "Wpisz podtytuł" },
      { key: "ctaText", label: "Tekst przycisku CTA", type: "text" },
      { key: "ctaUrl", label: "Link CTA", type: "text" },
      { key: "ctaSecondText", label: "Drugi przycisk (tekst)", type: "text" },
      { key: "ctaSecondUrl", label: "Drugi przycisk (link)", type: "text" },
      { key: "backgroundImage", label: "Zdjęcie tła (URL)", type: "image" },
    ],
  },
  {
    type: "navbar",
    fields: [
      { key: "logoText", label: "Tekst logo", type: "text" },
      { key: "logoUrl", label: "Link logo", type: "text" },
      { key: "ctaText", label: "Przycisk CTA (tekst)", type: "text" },
      { key: "ctaUrl", label: "Przycisk CTA (link)", type: "text" },
      { key: "sticky", label: "Przyklejona nawigacja", type: "boolean" },
      {
        key: "links", label: "Linki nawigacji", type: "list",
        itemFields: [
          { key: "label", label: "Etykieta", type: "text" },
          { key: "href", label: "Link", type: "text" },
        ],
      },
    ],
  },
  {
    type: "about",
    fields: [
      { key: "badge", label: "Etykietka", type: "text" },
      { key: "title", label: "Tytuł", type: "text" },
      { key: "content", label: "Treść", type: "textarea" },
      { key: "imageUrl", label: "Zdjęcie (URL)", type: "image" },
      { key: "imageAlt", label: "Alt zdjęcia", type: "text" },
      {
        key: "layout", label: "Układ", type: "select",
        options: [{ value: "left", label: "Zdjęcie po lewej" }, { value: "right", label: "Zdjęcie po prawej" }, { value: "center", label: "Wyśrodkowany" }],
      },
    ],
  },
  {
    type: "services",
    fields: [
      { key: "title", label: "Tytuł sekcji", type: "text" },
      { key: "subtitle", label: "Podtytuł", type: "text" },
      {
        key: "columns", label: "Kolumny", type: "select",
        options: [{ value: "2", label: "2" }, { value: "3", label: "3" }, { value: "4", label: "4" }],
      },
      {
        key: "items", label: "Usługi", type: "list",
        itemFields: [
          { key: "title", label: "Nazwa usługi", type: "text" },
          { key: "description", label: "Opis", type: "textarea" },
          { key: "icon", label: "Ikona (Lucide)", type: "text" },
        ],
      },
    ],
  },
  {
    type: "features",
    fields: [
      { key: "title", label: "Tytuł", type: "text" },
      { key: "subtitle", label: "Podtytuł", type: "text" },
      {
        key: "items", label: "Cechy", type: "list",
        itemFields: [
          { key: "title", label: "Tytuł", type: "text" },
          { key: "description", label: "Opis", type: "textarea" },
          { key: "icon", label: "Ikona", type: "text" },
        ],
      },
    ],
  },
  {
    type: "gallery",
    fields: [
      { key: "title", label: "Tytuł", type: "text" },
      { key: "subtitle", label: "Podtytuł", type: "text" },
      {
        key: "columns", label: "Kolumny", type: "select",
        options: [{ value: "2", label: "2" }, { value: "3", label: "3" }, { value: "4", label: "4" }],
      },
      {
        key: "items", label: "Zdjęcia", type: "list",
        itemFields: [
          { key: "imageUrl", label: "URL zdjęcia", type: "image" },
          { key: "alt", label: "Alt tekst", type: "text" },
          { key: "caption", label: "Podpis", type: "text" },
        ],
      },
    ],
  },
  {
    type: "testimonials",
    fields: [
      { key: "title", label: "Tytuł", type: "text" },
      { key: "subtitle", label: "Podtytuł", type: "text" },
      {
        key: "items", label: "Opinie", type: "list",
        itemFields: [
          { key: "name", label: "Imię i nazwisko", type: "text" },
          { key: "role", label: "Stanowisko", type: "text" },
          { key: "company", label: "Firma", type: "text" },
          { key: "quote", label: "Cytat", type: "textarea" },
          { key: "avatar", label: "Zdjęcie (URL)", type: "image" },
        ],
      },
    ],
  },
  {
    type: "faq",
    fields: [
      { key: "title", label: "Tytuł", type: "text" },
      { key: "subtitle", label: "Podtytuł", type: "text" },
      {
        key: "items", label: "Pytania i odpowiedzi", type: "list",
        itemFields: [
          { key: "question", label: "Pytanie", type: "text" },
          { key: "answer", label: "Odpowiedź", type: "textarea" },
        ],
      },
    ],
  },
  {
    type: "pricing",
    fields: [
      { key: "title", label: "Tytuł", type: "text" },
      { key: "subtitle", label: "Podtytuł", type: "text" },
      {
        key: "items", label: "Pakiety", type: "list",
        itemFields: [
          { key: "name", label: "Nazwa pakietu", type: "text" },
          { key: "price", label: "Cena", type: "text" },
          { key: "period", label: "Okres", type: "text" },
          { key: "ctaText", label: "Tekst przycisku", type: "text" },
          { key: "highlighted", label: "Wyróżniony", type: "boolean" },
        ],
      },
    ],
  },
  {
    type: "cta",
    fields: [
      { key: "title", label: "Tytuł", type: "text" },
      { key: "subtitle", label: "Podtytuł", type: "textarea" },
      { key: "primaryText", label: "Przycisk główny (tekst)", type: "text" },
      { key: "primaryUrl", label: "Przycisk główny (link)", type: "text" },
      { key: "secondaryText", label: "Przycisk drugi (tekst)", type: "text" },
      { key: "secondaryUrl", label: "Przycisk drugi (link)", type: "text" },
    ],
  },
  {
    type: "statistics",
    fields: [
      { key: "title", label: "Tytuł", type: "text" },
      {
        key: "items", label: "Statystyki", type: "list",
        itemFields: [
          { key: "number", label: "Liczba / wartość", type: "text" },
          { key: "label", label: "Etykieta", type: "text" },
        ],
      },
    ],
  },
  {
    type: "team",
    fields: [
      { key: "title", label: "Tytuł", type: "text" },
      { key: "subtitle", label: "Podtytuł", type: "text" },
      {
        key: "columns", label: "Kolumny", type: "select",
        options: [{ value: "2", label: "2" }, { value: "3", label: "3" }, { value: "4", label: "4" }],
      },
      {
        key: "items", label: "Członkowie zespołu", type: "list",
        itemFields: [
          { key: "name", label: "Imię i nazwisko", type: "text" },
          { key: "role", label: "Stanowisko", type: "text" },
          { key: "bio", label: "Bio", type: "textarea" },
          { key: "imageUrl", label: "Zdjęcie (URL)", type: "image" },
        ],
      },
    ],
  },
  {
    type: "timeline",
    fields: [
      { key: "title", label: "Tytuł", type: "text" },
      { key: "subtitle", label: "Podtytuł", type: "text" },
      {
        key: "items", label: "Punkty osi czasu", type: "list",
        itemFields: [
          { key: "year", label: "Rok / data", type: "text" },
          { key: "title", label: "Tytuł", type: "text" },
          { key: "description", label: "Opis", type: "textarea" },
        ],
      },
    ],
  },
  {
    type: "steps",
    fields: [
      { key: "title", label: "Tytuł", type: "text" },
      { key: "subtitle", label: "Podtytuł", type: "text" },
      {
        key: "items", label: "Kroki", type: "list",
        itemFields: [
          { key: "step", label: "Numer kroku", type: "text" },
          { key: "title", label: "Tytuł", type: "text" },
          { key: "description", label: "Opis", type: "textarea" },
        ],
      },
    ],
  },
  {
    type: "contact",
    fields: [
      { key: "title", label: "Tytuł", type: "text" },
      { key: "subtitle", label: "Podtytuł", type: "text" },
      { key: "email", label: "Email", type: "text" },
      { key: "phone", label: "Telefon", type: "text" },
      { key: "address", label: "Adres", type: "text" },
      { key: "showForm", label: "Pokaż formularz", type: "boolean" },
    ],
  },
  {
    type: "footer",
    fields: [
      { key: "logoText", label: "Tekst logo", type: "text" },
      { key: "copyright", label: "Prawa autorskie", type: "text" },
    ],
  },
  {
    type: "video",
    fields: [
      { key: "title", label: "Tytuł", type: "text" },
      { key: "videoUrl", label: "URL wideo (YouTube/Vimeo)", type: "text" },
      { key: "caption", label: "Podpis", type: "text" },
      { key: "autoplay", label: "Autoodtwarzanie", type: "boolean" },
    ],
  },
  {
    type: "map",
    fields: [
      { key: "title", label: "Tytuł", type: "text" },
      { key: "address", label: "Adres", type: "text" },
      { key: "embedUrl", label: "URL embed mapy (Google Maps)", type: "text" },
    ],
  },
  {
    type: "newsletter",
    fields: [
      { key: "title", label: "Tytuł", type: "text" },
      { key: "subtitle", label: "Podtytuł", type: "textarea" },
      { key: "placeholder", label: "Placeholder pola email", type: "text" },
      { key: "buttonText", label: "Tekst przycisku", type: "text" },
      { key: "privacyText", label: "Nota prywatności", type: "text" },
    ],
  },
  {
    type: "instagram",
    fields: [
      { key: "title", label: "Tytuł", type: "text" },
      { key: "handle", label: "Nazwa użytkownika (@)", type: "text" },
      { key: "profileUrl", label: "Link do profilu", type: "text" },
      { key: "count", label: "Liczba postów", type: "number" },
    ],
  },
  {
    type: "tiktok",
    fields: [
      { key: "title", label: "Tytuł", type: "text" },
      { key: "handle", label: "Nazwa użytkownika (@)", type: "text" },
      { key: "count", label: "Liczba filmów", type: "number" },
    ],
  },
  {
    type: "woo-products",
    fields: [
      { key: "title", label: "Tytuł", type: "text" },
      { key: "subtitle", label: "Podtytuł", type: "text" },
      { key: "count", label: "Liczba produktów", type: "number" },
      { key: "category", label: "Kategoria (slug)", type: "text" },
      {
        key: "columns", label: "Kolumny", type: "select",
        options: [{ value: "2", label: "2" }, { value: "3", label: "3" }, { value: "4", label: "4" }],
      },
    ],
  },
  {
    type: "blog",
    fields: [
      { key: "title", label: "Tytuł", type: "text" },
      { key: "subtitle", label: "Podtytuł", type: "text" },
      { key: "count", label: "Liczba wpisów", type: "number" },
      { key: "category", label: "Kategoria", type: "text" },
      { key: "showDate", label: "Pokaż datę", type: "boolean" },
    ],
  },
  // ── Warianty nawigacji i stopki ──────────────────────────
  {
    type: "navbar-minimal",
    fields: [
      { key: "logoText", label: "Tekst logo", type: "text" },
      { key: "logoUrl", label: "Logo (URL)", type: "image" },
      { key: "ctaText", label: "Przycisk CTA (tekst)", type: "text" },
      { key: "ctaUrl", label: "Przycisk CTA (link)", type: "text" },
    ],
  },
  {
    type: "navbar-centered",
    fields: [
      { key: "logoText", label: "Tekst logo", type: "text" },
      { key: "logoUrl", label: "Logo (URL)", type: "image" },
      {
        key: "links", label: "Linki nawigacji", type: "list",
        itemFields: [
          { key: "label", label: "Tekst", type: "text" },
          { key: "url", label: "URL", type: "text" },
        ],
      },
    ],
  },
  {
    type: "footer-minimal",
    fields: [
      { key: "logoText", label: "Tekst logo", type: "text" },
      { key: "copyright", label: "Prawa autorskie", type: "text" },
      {
        key: "links", label: "Linki", type: "list",
        itemFields: [
          { key: "label", label: "Tekst", type: "text" },
          { key: "url", label: "URL", type: "text" },
        ],
      },
    ],
  },
  {
    type: "footer-extended",
    fields: [
      { key: "logoText", label: "Tekst logo", type: "text" },
      { key: "tagline", label: "Tagline", type: "text" },
      { key: "newsletterTitle", label: "Tytuł newslettera", type: "text" },
      { key: "newsletterPlaceholder", label: "Placeholder email", type: "text" },
      { key: "newsletterButton", label: "Przycisk newslettera", type: "text" },
      { key: "copyright", label: "Prawa autorskie", type: "text" },
    ],
  },
  // ── Dodatkowe sekcje ─────────────────────────────────────
  {
    type: "hero-split",
    fields: [
      { key: "eyebrow", label: "Napis nad tytułem", type: "text" },
      { key: "title", label: "Tytuł", type: "text" },
      { key: "subtitle", label: "Podtytuł", type: "textarea" },
      { key: "ctaText", label: "Przycisk główny (tekst)", type: "text" },
      { key: "ctaUrl", label: "Przycisk główny (link)", type: "text" },
      { key: "ctaSecondText", label: "Przycisk drugi (tekst)", type: "text" },
      { key: "ctaSecondUrl", label: "Przycisk drugi (link)", type: "text" },
      { key: "imageUrl", label: "Zdjęcie (URL)", type: "image" },
      { key: "imageAlt", label: "Tekst alternatywny zdjęcia", type: "text" },
    ],
  },
  {
    type: "process",
    fields: [
      { key: "eyebrow", label: "Napis nad tytułem", type: "text" },
      { key: "title", label: "Tytuł", type: "text" },
      { key: "subtitle", label: "Podtytuł", type: "text" },
      {
        key: "items", label: "Kroki procesu", type: "list",
        itemFields: [
          { key: "number", label: "Numer (np. 01)", type: "text" },
          { key: "title", label: "Tytuł kroku", type: "text" },
          { key: "description", label: "Opis", type: "textarea" },
        ],
      },
    ],
  },
  {
    type: "awards",
    fields: [
      { key: "title", label: "Tytuł", type: "text" },
      { key: "subtitle", label: "Podtytuł", type: "text" },
      {
        key: "items", label: "Odznaczenia", type: "list",
        itemFields: [
          { key: "name", label: "Nazwa", type: "text" },
          { key: "year", label: "Rok", type: "text" },
          { key: "imageUrl", label: "Logo/ikona (URL)", type: "image" },
          { key: "description", label: "Opis", type: "text" },
        ],
      },
    ],
  },
  {
    type: "comparison",
    fields: [
      { key: "title", label: "Tytuł", type: "text" },
      { key: "subtitle", label: "Podtytuł", type: "text" },
    ],
  },
  {
    type: "countdown",
    fields: [
      { key: "title", label: "Tytuł", type: "text" },
      { key: "subtitle", label: "Podtytuł", type: "text" },
      { key: "targetDate", label: "Data docelowa (YYYY-MM-DD)", type: "text" },
      { key: "ctaText", label: "Przycisk (tekst)", type: "text" },
      { key: "ctaUrl", label: "Przycisk (link)", type: "text" },
    ],
  },
  {
    type: "careers",
    fields: [
      { key: "title", label: "Tytuł", type: "text" },
      { key: "subtitle", label: "Podtytuł", type: "textarea" },
      {
        key: "items", label: "Oferty pracy", type: "list",
        itemFields: [
          { key: "title", label: "Stanowisko", type: "text" },
          { key: "type", label: "Typ (np. Pełny etat)", type: "text" },
          { key: "location", label: "Lokalizacja", type: "text" },
          { key: "description", label: "Opis", type: "textarea" },
          { key: "applyUrl", label: "Link do aplikowania", type: "text" },
        ],
      },
    ],
  },
  // ── Nowe sekcje ──────────────────────────────────────────
  {
    type: "separator",
    fields: [
      { key: "height", label: "Wysokość (px)", type: "number" },
      {
        key: "style", label: "Styl linii", type: "select",
        options: [
          { value: "none", label: "Tylko odstęp (brak linii)" },
          { value: "solid", label: "Pełna linia" },
          { value: "dashed", label: "Przerywana" },
          { value: "dotted", label: "Kropkowana" },
        ],
      },
      { key: "color", label: "Kolor linii", type: "color" },
      { key: "label", label: "Tekst na linii (opcjonalny)", type: "text" },
    ],
  },
  {
    type: "text",
    fields: [
      { key: "eyebrow", label: "Napis nad nagłówkiem", type: "text", placeholder: "np. O nas" },
      { key: "heading", label: "Nagłówek", type: "text" },
      {
        key: "headingLevel", label: "Poziom nagłówka", type: "select",
        options: [{ value: "h1", label: "H1" }, { value: "h2", label: "H2" }, { value: "h3", label: "H3" }],
      },
      { key: "content", label: "Treść", type: "textarea" },
      {
        key: "align", label: "Wyrównanie", type: "select",
        options: [{ value: "left", label: "Do lewej" }, { value: "center", label: "Wyśrodkowane" }, { value: "right", label: "Do prawej" }],
      },
    ],
  },
  {
    type: "logos",
    fields: [
      { key: "title", label: "Tytuł", type: "text" },
      { key: "subtitle", label: "Podtytuł", type: "text" },
      {
        key: "items", label: "Logotypy", type: "list",
        itemFields: [
          { key: "name", label: "Nazwa firmy", type: "text" },
          { key: "logoUrl", label: "Logo (URL)", type: "image" },
          { key: "href", label: "Link (opcjonalny)", type: "text" },
        ],
      },
    ],
  },
  {
    type: "portfolio",
    fields: [
      { key: "title", label: "Tytuł", type: "text" },
      { key: "subtitle", label: "Podtytuł", type: "text" },
      {
        key: "columns", label: "Kolumny", type: "select",
        options: [{ value: "2", label: "2" }, { value: "3", label: "3" }, { value: "4", label: "4" }],
      },
      {
        key: "items", label: "Projekty", type: "list",
        itemFields: [
          { key: "title", label: "Tytuł projektu", type: "text" },
          { key: "category", label: "Kategoria", type: "text" },
          { key: "imageUrl", label: "Zdjęcie (URL)", type: "image" },
          { key: "description", label: "Opis", type: "textarea" },
          { key: "href", label: "Link do projektu", type: "text" },
        ],
      },
    ],
  },
  {
    type: "banner",
    fields: [
      { key: "text", label: "Tekst główny", type: "text" },
      { key: "subtext", label: "Tekst dodatkowy", type: "text" },
      { key: "ctaText", label: "Przycisk (tekst)", type: "text" },
      { key: "ctaUrl", label: "Przycisk (link)", type: "text" },
      { key: "closeable", label: "Możliwość zamknięcia", type: "boolean" },
    ],
  },
  {
    type: "columns",
    fields: [
      {
        key: "columns", label: "Kolumny", type: "list",
        itemFields: [
          { key: "icon", label: "Ikona (Lucide)", type: "text" },
          { key: "heading", label: "Nagłówek", type: "text" },
          { key: "content", label: "Treść", type: "textarea" },
          { key: "ctaText", label: "Przycisk (tekst)", type: "text" },
          { key: "ctaUrl", label: "Przycisk (link)", type: "text" },
        ],
      },
    ],
  },
  {
    type: "quote",
    fields: [
      { key: "quote", label: "Treść cytatu", type: "textarea" },
      { key: "author", label: "Autor", type: "text" },
      { key: "role", label: "Stanowisko", type: "text" },
      { key: "company", label: "Firma", type: "text" },
      { key: "avatarUrl", label: "Zdjęcie autora (URL)", type: "image" },
      {
        key: "style", label: "Styl cytatu", type: "select",
        options: [{ value: "simple", label: "Prosty" }, { value: "card", label: "Karta" }, { value: "large", label: "Duży" }],
      },
    ],
  },
  {
    type: "image",
    fields: [
      { key: "imageUrl", label: "URL zdjęcia", type: "image" },
      { key: "alt", label: "Tekst alternatywny (SEO)", type: "text" },
      { key: "caption", label: "Podpis pod zdjęciem", type: "text" },
      { key: "href", label: "Link po kliknięciu", type: "text" },
      {
        key: "style", label: "Szerokość", type: "select",
        options: [{ value: "full", label: "Pełna szerokość" }, { value: "contained", label: "W kontenerze" }, { value: "rounded", label: "Zaokrąglone" }],
      },
    ],
  },
  {
    type: "menu-section",
    fields: [
      { key: "title", label: "Tytuł", type: "text" },
      { key: "subtitle", label: "Podtytuł", type: "text" },
      { key: "showPrices", label: "Pokaż ceny", type: "boolean" },
      { key: "layout", label: "Układ", type: "select", options: [{ value: "tabs", label: "Zakładki" }, { value: "list", label: "Lista" }, { value: "grid", label: "Siatka" }] },
    ],
  },
  {
    type: "reservation",
    fields: [
      { key: "title", label: "Tytuł", type: "text" },
      { key: "subtitle", label: "Podtytuł", type: "textarea" },
      { key: "ctaText", label: "Tekst przycisku", type: "text" },
      { key: "phone", label: "Telefon", type: "text" },
      { key: "email", label: "Email", type: "text" },
      { key: "hours", label: "Godziny otwarcia", type: "text" },
    ],
  },
  {
    type: "accordion",
    fields: [
      { key: "title", label: "Tytuł (opcjonalnie)", type: "text" },
      { key: "allowMultiple", label: "Otwieraj wiele naraz", type: "boolean" },
      {
        key: "items", label: "Elementy", type: "list",
        itemFields: [
          { key: "heading", label: "Nagłówek", type: "text" },
          { key: "content", label: "Treść", type: "textarea" },
        ],
      },
    ],
  },
  {
    type: "tabs",
    fields: [
      { key: "title", label: "Tytuł (opcjonalnie)", type: "text" },
      {
        key: "tabs", label: "Zakładki", type: "list",
        itemFields: [
          { key: "label", label: "Etykieta zakładki", type: "text" },
          { key: "content", label: "Treść", type: "textarea" },
          { key: "imageUrl", label: "Zdjęcie (URL)", type: "image" },
        ],
      },
    ],
  },
  {
    type: "slider",
    fields: [
      { key: "autoplay", label: "Autoplay", type: "boolean" },
      { key: "arrows", label: "Strzałki", type: "boolean" },
      { key: "dots", label: "Kropki nawigacji", type: "boolean" },
      { key: "height", label: "Wysokość", type: "text", placeholder: "np. 500px" },
      {
        key: "slides", label: "Slajdy", type: "list",
        itemFields: [
          { key: "imageUrl", label: "Zdjęcie (URL)", type: "image" },
          { key: "title", label: "Tytuł", type: "text" },
          { key: "subtitle", label: "Podtytuł", type: "text" },
          { key: "ctaText", label: "Przycisk (tekst)", type: "text" },
          { key: "ctaUrl", label: "Przycisk (link)", type: "text" },
        ],
      },
    ],
  },
  {
    type: "hero-video",
    fields: [
      { key: "title", label: "Tytuł", type: "text" },
      { key: "subtitle", label: "Podtytuł", type: "textarea" },
      { key: "ctaText", label: "Przycisk CTA (tekst)", type: "text" },
      { key: "ctaUrl", label: "Przycisk CTA (link)", type: "text" },
      { key: "videoUrl", label: "URL wideo (YouTube/Vimeo/mp4)", type: "text" },
      { key: "posterUrl", label: "Plakat (fallback URL)", type: "image" },
      { key: "overlayOpacity", label: "Krycie nakładki (0–1)", type: "number" },
    ],
  },
  {
    type: "hero-fullscreen",
    fields: [
      { key: "eyebrow", label: "Etykietka nad tytułem", type: "text" },
      { key: "title", label: "Tytuł", type: "textarea" },
      { key: "ctaText", label: "Przycisk CTA (tekst)", type: "text" },
      { key: "ctaUrl", label: "Przycisk CTA (link)", type: "text" },
      { key: "backgroundImage", label: "Zdjęcie tła (URL)", type: "image" },
      { key: "backgroundStyle", label: "Styl tła", type: "select", options: [{ value: "dark", label: "Ciemne" }, { value: "light", label: "Jasne" }, { value: "image", label: "Zdjęcie" }] },
      { key: "scrollIndicator", label: "Wskaźnik przewijania", type: "boolean" },
    ],
  },
  {
    type: "reviews-grid",
    fields: [
      { key: "title", label: "Tytuł", type: "text" },
      { key: "subtitle", label: "Podtytuł (np. średnia ocena)", type: "text" },
      { key: "platform", label: "Platforma", type: "select", options: [{ value: "google", label: "Google" }, { value: "facebook", label: "Facebook" }, { value: "trustpilot", label: "Trustpilot" }, { value: "none", label: "Brak" }] },
      {
        key: "items", label: "Opinie", type: "list",
        itemFields: [
          { key: "name", label: "Imię i nazwisko", type: "text" },
          { key: "rating", label: "Ocena (1–5)", type: "number" },
          { key: "text", label: "Treść opinii", type: "textarea" },
          { key: "date", label: "Data (tekst)", type: "text" },
          { key: "avatar", label: "Zdjęcie (URL)", type: "image" },
        ],
      },
    ],
  },
  {
    type: "event",
    fields: [
      { key: "title", label: "Tytuł", type: "text" },
      { key: "subtitle", label: "Podtytuł", type: "text" },
      {
        key: "items", label: "Wydarzenia", type: "list",
        itemFields: [
          { key: "date", label: "Data (tekst)", type: "text" },
          { key: "title", label: "Tytuł", type: "text" },
          { key: "description", label: "Opis", type: "textarea" },
          { key: "time", label: "Godziny", type: "text" },
          { key: "location", label: "Miejsce", type: "text" },
          { key: "badge", label: "Etykieta", type: "text" },
          { key: "url", label: "Link", type: "text" },
        ],
      },
    ],
  },
  {
    type: "icon-grid",
    fields: [
      { key: "title", label: "Tytuł", type: "text" },
      { key: "subtitle", label: "Podtytuł", type: "text" },
      { key: "columns", label: "Kolumny", type: "select", options: [{ value: "3", label: "3" }, { value: "4", label: "4" }, { value: "5", label: "5" }, { value: "6", label: "6" }] },
      {
        key: "items", label: "Elementy", type: "list",
        itemFields: [
          { key: "icon", label: "Ikona Lucide", type: "text" },
          { key: "label", label: "Etykieta", type: "text" },
        ],
      },
    ],
  },
  {
    type: "sticky-cta",
    fields: [
      { key: "text", label: "Tekst", type: "text" },
      { key: "ctaText", label: "Przycisk (tekst)", type: "text" },
      { key: "ctaUrl", label: "Przycisk (link)", type: "text" },
      { key: "closeable", label: "Zamykany", type: "boolean" },
    ],
  },
  {
    type: "pricing-toggle",
    fields: [
      { key: "title", label: "Tytuł", type: "text" },
      { key: "subtitle", label: "Podtytuł", type: "text" },
    ],
  },
  {
    type: "media-row",
    fields: [
      {
        key: "rows", label: "Wiersze", type: "list",
        itemFields: [
          { key: "heading", label: "Nagłówek", type: "text" },
          { key: "content", label: "Treść", type: "textarea" },
          { key: "imageUrl", label: "Zdjęcie (URL)", type: "image" },
          { key: "badge", label: "Numer / Badge", type: "text" },
          { key: "layout", label: "Układ", type: "select", options: [{ value: "image-right", label: "Zdjęcie z prawej" }, { value: "image-left", label: "Zdjęcie z lewej" }] },
        ],
      },
    ],
  },
  {
    type: "links-list",
    fields: [
      { key: "title", label: "Tytuł", type: "text" },
      {
        key: "items", label: "Linki", type: "list",
        itemFields: [
          { key: "icon", label: "Ikona Lucide", type: "text" },
          { key: "label", label: "Etykieta", type: "text" },
          { key: "description", label: "Opis (opcjonalnie)", type: "text" },
          { key: "url", label: "URL", type: "text" },
          { key: "external", label: "Zewnętrzny link", type: "boolean" },
        ],
      },
    ],
  },
  {
    type: "before-after",
    fields: [
      { key: "title", label: "Tytuł", type: "text" },
      { key: "subtitle", label: "Podtytuł", type: "text" },
      { key: "beforeImageUrl", label: "Zdjęcie Przed (URL)", type: "image" },
      { key: "afterImageUrl", label: "Zdjęcie Po (URL)", type: "image" },
      { key: "beforeLabel", label: "Etykieta Przed", type: "text" },
      { key: "afterLabel", label: "Etykieta Po", type: "text" },
    ],
  },
];

export function getPropSchema(type: string): PropSchema | undefined {
  return PROP_SCHEMAS.find((s) => s.type === type);
}
