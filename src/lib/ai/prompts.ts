import { DEMO_INDUSTRY_LABELS, DEMO_STYLE_LABELS, parseDemoContent } from "@/features/demos/types";
import type { GenerateDemoContentInput } from "@/lib/ai/types";

export const DEMO_CONTENT_SYSTEM_PROMPT = `Jesteś doświadczonym copywriterem i architektem treści dla małych firm polskich.

ZASADY ABSOLUTNE:
1. Odpowiedz TYLKO surowym JSON — bez markdown, bez \`\`\`json, bez żadnego tekstu przed ani po.
2. Pisz WYŁĄCZNIE po polsku.
3. Nie wymyślaj adresów email, telefonów ani adresów fizycznych — zostaw pola null.
4. Nie używaj ogólników: „najwyższa jakość”, „najlepsi na rynku”, „kompleksowe usługi”.
5. Treści mają brzmieć jak gotowa strona prawdziwej firmy — konkretnie, sprzedażowo, ciepło.
6. Dopasuj język i ton do branży klienta.
7. Uzupełnij KAŻDE pole w strukturze JSON — nie pomijaj żadnego.
8. Pole image.url zostaw puste “”, description napisz jako zwięzłe angielskie zapytanie fotograficzne (np. “florist arranging colorful bouquet in bright studio”).`;

function labelFromMap<T extends string>(value: string | null, map: Record<T, string>) {
  if (!value) return null;
  return (map as Record<string, string>)[value] ?? value;
}

const GENERATION_MODE_INSTRUCTIONS: Record<string, string> = {
  quick: `TRYB SZYBKI: Wygeneruj skróconą wersję strony. Hero + 3 usługi + 2 opinie + kontakt. Resztę sekcji wypełnij minimalnie.`,
  full: `TRYB PEŁNY: Wygeneruj kompletną stronę z wszystkimi sekcjami. Każda sekcja ma mieć naturalne, sprzedażowe treści.`,
  premium: `TRYB PREMIUM: Wygeneruj rozbudowaną, dopracowaną stronę. Więcej treści w każdej sekcji, bogate FAQ (8 pytań), szczegółowe opisy usług (4-5 zdań), 4+ opinie, SEO ze słowami kluczowymi long-tail, sekcja korzyści z 6 punktami, pełna sekcja procesu (5 kroków).`,
  publish: `TRYB PUBLIKACYJNY: Wygeneruj stronę gotową do wdrożenia. Pełna treść, dopracowane SEO z meta description pod kliknięcia, naturalne CTA, opisy zdjęć w j. angielskim optymalne pod stock photo, dane strukturalne w komentarzach.`,
};

export function buildDemoContentPrompt(input: GenerateDemoContentInput) {
  const currentContent = parseDemoContent(input.currentContent);
  const modeInstruction = GENERATION_MODE_INSTRUCTIONS[input.generationMode ?? "full"];

  return `${modeInstruction}

Wygeneruj kompletną stronę demo klienta jako jeden spójny JSON zgodny dokładnie z podanym kontraktem.

Dane klienta:
- Nazwa firmy: ${input.companyName || "brak"}
- Imię i nazwisko klienta: ${input.clientName || "brak"}
- Branża: ${labelFromMap(input.industry, DEMO_INDUSTRY_LABELS) || "brak"}
- Miasto: ${input.city || "brak"}
- Typ strony: ${input.websiteType || input.estimate?.websiteType || "brak"}
- Styl demo: ${labelFromMap(input.style, DEMO_STYLE_LABELS) || "brak"}
- Kolor główny: ${input.primaryColor || "brak"}
- Kolor dodatkowy: ${input.secondaryColor || "brak"}
- Opis działalności: ${input.businessDescription || "brak"}
- Lista usług: ${input.services || "brak"}
- Grupa docelowa: ${input.targetAudience || "brak"}
- Ton komunikacji: ${input.tone || "profesjonalny, ciepły, konkretny"}

Wycena:
${input.estimate ? JSON.stringify(input.estimate, null, 2) : "Brak powiązanej wyceny."}

Obecne treści demo, które możesz ulepszyć:
${JSON.stringify(currentContent, null, 2)}

Wymagana struktura odpowiedzi (nie pomijaj żadnego pola):
{
  "schemaVersion": 2,
  "site": {
    "name": "",
    "language": "pl",
    "style": "",
    "colors": { "primary": "#000000", "secondary": "#000000", "background": "#ffffff", "text": "#111111" }
  },
  "navigation": {
    "logoText": "",
    "links": [{ "label": "", "href": "#sekcja" }],
    "cta": { "label": "", "href": "#kontakt" }
  },
  "headings": {
    "services": { "eyebrow": "", "title": "", "subtitle": "" },
    "features": { "eyebrow": "", "title": "", "subtitle": "" },
    "process": { "eyebrow": "", "title": "", "subtitle": "" },
    "testimonials": { "eyebrow": "", "title": "", "subtitle": "" },
    "faq": { "eyebrow": "", "title": "", "subtitle": "" }
  },
  "hero": {
    "eyebrow": "",
    "title": "",
    "subtitle": "",
    "cta": "",
    "primaryCta": { "label": "", "href": "#kontakt" },
    "secondaryCta": { "label": "", "href": "#o-nas" },
    "image": { "url": "", "alt": "", "description": "", "provider": "placeholder" }
  },
  "about": {
    "eyebrow": "",
    "title": "",
    "content": "",
    "image": { "url": "", "alt": "", "description": "", "provider": "placeholder" }
  },
  "services": [{ "title": "", "description": "", "icon": "" }],
  "features": [{ "title": "", "description": "", "icon": "" }],
  "process": [{ "title": "", "description": "" }],
  "gallery": {
    "eyebrow": "",
    "title": "",
    "subtitle": "",
    "items": [
      { "url": "", "alt": "", "description": "", "provider": "placeholder" }
    ]
  },
  "testimonials": [{ "name": "", "role": "", "content": "" }],
  "faq": [{ "question": "", "answer": "" }],
  "cta": {
    "eyebrow": "",
    "title": "",
    "description": "",
    "primaryCta": { "label": "", "href": "#kontakt" },
    "secondaryCta": { "label": "", "href": "#galeria" }
  },
  "contact": {
    "eyebrow": "",
    "title": "",
    "description": "",
    "cta": "",
    "email": null,
    "phone": null,
    "address": null
  },
  "footer": {
    "description": "",
    "columns": [{ "title": "", "links": [{ "label": "", "href": "#sekcja" }] }],
    "copyright": ""
  },
  "seo": {
    "title": "",
    "description": "",
    "keywords": [""],
    "ogImage": { "url": "", "alt": "", "description": "", "provider": "placeholder" }
  },
  "structure": [
    { "type": "navigation", "id": "nawigacja", "visible": true },
    { "type": "hero", "id": "start", "visible": true },
    { "type": "about", "id": "o-nas", "visible": true },
    { "type": "services", "id": "uslugi", "visible": true },
    { "type": "features", "id": "wyrozniki", "visible": true },
    { "type": "gallery", "id": "galeria", "visible": true },
    { "type": "process", "id": "proces", "visible": true },
    { "type": "testimonials", "id": "opinie", "visible": true },
    { "type": "faq", "id": "faq", "visible": true },
    { "type": "cta", "id": "cta", "visible": true },
    { "type": "contact", "id": "kontakt", "visible": true },
    { "type": "footer", "id": "stopka", "visible": true }
  ]
}

INSTRUKCJE KOŃCOWE:
- Zwróć TYLKO JSON, bez żadnego tekstu, bez \`\`\`, bez komentarzy.
- Nie twórz adresu e-mail, numeru telefonu ani fizycznego adresu — ustaw na null.
- Opinie: 2-3 przykłady, bez prawdziwych nazwisk, brzmią wiarygodnie.
- Pola image.url: zostaw "", provider: "placeholder", description: angielskie zapytanie fotograficzne.
- Używaj href="#id" tylko do sekcji z listy structure.
- Liczebność: 3-5 usług, 3-4 wyróżniki, 3 kroki procesu, 4-6 zdjęć galerii, 2-3 opinie, 4-6 FAQ.
- SEO title: 50-60 znaków. SEO description: 140-160 znaków.
- Każde pole JSON MUSI być uzupełnione — żadnych pustych stringów w kluczowych sekcjach.
- Treść dopasowana do konkretnej firmy, nie generyczna.

Odpowiedź musi być poprawnym JSON zaczynającym się od { i kończącym na }.`;
}
