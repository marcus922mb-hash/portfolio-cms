import type { AIToolDef } from "./types";

function v(values: Record<string, string>, key: string, fallback = "—") {
  return values[key]?.trim() || fallback;
}

export const AI_TOOLS: AIToolDef[] = [
  // 01
  {
    id: "generator-nazwy-firmy",
    name: "Generator nazwy firmy",
    tagline: "Znajdź nazwę, która zostaje w głowie",
    description: "Wpisz branżę i wartości swojej firmy — AI zaproponuje 7 unikalnych nazw z uzasadnieniem i dostępnością domeny.",
    iconName: "Sparkles",
    category: "identity",
    badge: "Nowe",
    fields: [
      { key: "branza", label: "Branża / rodzaj działalności", type: "text", placeholder: "np. kwiaciarnia, studio tatuażu, kosmetyczka", required: true },
      { key: "wartosci", label: "Wartości i charakter marki", type: "text", placeholder: "np. lokalna, ekologiczna, nowoczesna, premium" },
      { key: "styl", label: "Styl nazwy", type: "select", options: [
        { value: "kreatywny", label: "Kreatywna i oryginalna" },
        { value: "poważny", label: "Poważna i profesjonalna" },
        { value: "lokalny", label: "Lokalna i swojska" },
        { value: "angielski", label: "Angielska / międzynarodowa" },
      ]},
      { key: "miasto", label: "Miasto lub region (opcjonalnie)", type: "text", placeholder: "np. Kraków, Śląsk" },
    ],
    systemPrompt: "Jesteś ekspertem od brandingu i nazewnictwa firm. Tworzysz chwytliwe, unikalne nazwy firm, które są łatwe do zapamiętania, dostępne jako domeny .pl i pasują do charakteru marki. Odpowiadasz wyłącznie po polsku. Każda propozycja ma być konkretna i uzasadniona.",
    buildPrompt: (v_) => `Zaproponuj 7 nazw dla firmy z branży: ${v(v_, "branza")}.
Wartości i charakter marki: ${v(v_, "wartosci")}.
Styl nazwy: ${v(v_, "styl", "kreatywny")}.
${v(v_, "miasto") !== "—" ? `Lokalizacja: ${v(v_, "miasto")}.` : ""}

Format odpowiedzi:
Dla każdej nazwy podaj:
1. **Nazwa** — [wpisz nazwę]
   - Dlaczego pasuje: [jedno zdanie]
   - Sugerowana domena: [nazwa].pl
   - Warianty: [2 krótkie warianty]

Na końcu dodaj krótką wskazówkę, jak wybrać najlepszą nazwę.`,
    outputFormat: "text",
    exampleSnippet: "1. **Złote Kłosy** — oddaje lokalność i rzemiosło...",
    ctaLabel: "Chcę pełny branding dla tej nazwy",
    available: true,
  },

  // 02
  {
    id: "generator-sloganu",
    name: "Generator sloganu",
    tagline: "Jedno zdanie, które definiuje markę",
    description: "Opisz swoją firmę — AI stworzy 6 propozycji sloganów w różnych tonach, od profesjonalnych po kreatywne.",
    iconName: "Quote",
    category: "identity",
    fields: [
      { key: "firma", label: "Nazwa firmy", type: "text", placeholder: "np. Zielona Pracownia", required: true },
      { key: "branza", label: "Co robisz / czym się zajmujesz", type: "text", placeholder: "np. projektujemy ogrody i tarasy", required: true },
      { key: "target", label: "Dla kogo", type: "text", placeholder: "np. właściciele domów, młode rodziny" },
      { key: "ton", label: "Ton komunikacji", type: "select", options: [
        { value: "inspirujący", label: "Inspirujący" },
        { value: "profesjonalny", label: "Profesjonalny i poważny" },
        { value: "przyjazny", label: "Ciepły i przyjazny" },
        { value: "odważny", label: "Odważny i nieoczywisty" },
      ]},
    ],
    systemPrompt: "Jesteś specjalistą od copywritingu i brand voice. Tworzysz slogany firm, które są zwięzłe, zapamiętywalne i oddają esencję marki. Piszesz wyłącznie po polsku. Slogany mają być krótkie (max 6-8 słów), niebanalne, bez okrągłych fraz.",
    buildPrompt: (v_) => `Firma: ${v(v_, "firma")}
Czym się zajmuje: ${v(v_, "branza")}
Dla kogo: ${v(v_, "target", "małe firmy i osoby prywatne")}
Ton: ${v(v_, "ton", "profesjonalny")}

Stwórz 6 propozycji sloganu. Dla każdego podaj:
**Slogan:** [treść sloganu]
- Ton: [krótki opis]
- Kiedy używać: [kontekst — strona, wizytówka, reklama]

Na końcu wskaż, który polecasz i dlaczego.`,
    outputFormat: "text",
    exampleSnippet: "**Każdy ogród zaczyna się od marzenia.**",
    ctaLabel: "Zamów profesjonalny brand voice",
    available: true,
  },

  // 03
  {
    id: "generator-tekstow-na-strone",
    name: "Generator tekstów na stronę",
    tagline: "Gotowe treści w 60 sekund",
    description: "Podaj dane firmy — AI napisze hero, opis usług i sekcję 'O nas' dopasowane do Twojej branży.",
    iconName: "FileText",
    category: "content",
    badge: "Nowe",
    fields: [
      { key: "firma", label: "Nazwa firmy", type: "text", placeholder: "np. Studio Kwiatowe Różana", required: true },
      { key: "branza", label: "Branża i zakres usług", type: "text", placeholder: "np. kwiaciarnia — bukiety ślubne, dekoracje eventów, florystyka", required: true },
      { key: "miasto", label: "Miasto", type: "text", placeholder: "np. Wrocław" },
      { key: "target", label: "Twój klient", type: "text", placeholder: "np. pary młode, firmy organizujące eventy" },
      { key: "usp", label: "Co Cię wyróżnia", type: "text", placeholder: "np. własna uprawa, kwiaty z Polski, 15 lat doświadczenia" },
    ],
    systemPrompt: "Jesteś doświadczonym copywriterem dla małych firm polskich. Piszesz konkretne, sprzedażowe teksty na strony internetowe. Unikasz ogólników i pustych fraz. Każde zdanie musi nieść wartość. Piszesz wyłącznie po polsku, naturalnym językiem.",
    buildPrompt: (v_) => `Firma: ${v(v_, "firma")}
Branża: ${v(v_, "branza")}
Miasto: ${v(v_, "miasto", "Polska")}
Klient docelowy: ${v(v_, "target", "osoby prywatne i firmy")}
Wyróżnik: ${v(v_, "usp", "jakość i doświadczenie")}

Napisz kompletne treści na stronę internetową. Sekcje:

## 🎯 HERO (nagłówek strony)
**H1:** [mocny nagłówek, max 8 słów]
**Podtytuł:** [1-2 zdania, konkretna obietnica]
**CTA:** [tekst przycisku]

## 💼 USŁUGI (3 główne usługi z opisami)
Dla każdej:
**[Nazwa usługi]**
[Opis 2-3 zdania — co dostaje klient, dlaczego warto]

## 👤 O NAS (300-400 znaków)
[Autentyczny opis firmy — bez okrągłych fraz, konkretnie]

## 💬 SOCIAL PROOF (3 zdania w stylu opinii klientów)
[Wymyślone, ale wiarygodne opinie]`,
    outputFormat: "sections",
    exampleSnippet: "## 🎯 HERO\n**H1:** Kwiaty, które mówią więcej niż słowa",
    ctaLabel: "Zamów pełne copywriting dla strony",
    available: true,
  },

  // 04
  {
    id: "generator-seo",
    name: "Generator SEO",
    tagline: "Meta, tytuły i słowa kluczowe z głową",
    description: "Podaj adres i branżę — AI wygeneruje kompletne meta tagi, propozycje H1, słowa kluczowe i opisy dla Google.",
    iconName: "Search",
    category: "seo",
    fields: [
      { key: "firma", label: "Nazwa firmy", type: "text", placeholder: "np. Mechanik Auto Piotrowski", required: true },
      { key: "branza", label: "Branża / usługi", type: "text", placeholder: "np. mechanik samochodowy, wymiana opon, przeglądy", required: true },
      { key: "miasto", label: "Miasto / region", type: "text", placeholder: "np. Katowice, Górny Śląsk", required: true },
      { key: "url", label: "Adres strony (opcjonalnie)", type: "text", placeholder: "np. mechanik-piotrowski.pl" },
    ],
    systemPrompt: "Jesteś ekspertem SEO dla małych firm lokalnych w Polsce. Tworzysz optymalizację pod Google, skupiając się na frazach lokalnych i intencjach zakupowych. Piszesz po polsku. Tytuły meta do 60 znaków, opisy do 155 znaków.",
    buildPrompt: (v_) => `Firma: ${v(v_, "firma")}
Branża: ${v(v_, "branza")}
Lokalizacja: ${v(v_, "miasto")}
${v(v_, "url") !== "—" ? `Strona: ${v(v_, "url")}` : ""}

Przygotuj kompletną optymalizację SEO:

## META TAGS (strona główna)
**Title:** [max 60 znaków]
**Description:** [max 155 znaków — zachęca do kliknięcia]

## SŁOWA KLUCZOWE
- Główna fraza: [1 fraza]
- Frazy lokalne (5): [lista]
- Frazy long-tail (5): [lista]
- Frazy pytaniowe (3): [lista "jak...", "gdzie...", "ile..."]

## NAGŁÓWKI (H1/H2)
- H1 strony głównej: [treść]
- H2 sekcji usług (3): [lista]

## GOOGLE MY BUSINESS
- Kategoria główna: [kategoria]
- Opis firmy (750 znaków): [treść]

## SCHEMAT LOKALNY (wskazówki)
[Co dodać w schema.org LocalBusiness]`,
    outputFormat: "sections",
    exampleSnippet: "**Title:** Mechanik Piotrowski Katowice — Naprawy i Przeglądy",
    ctaLabel: "Zamów audyt SEO strony",
    available: true,
  },

  // 05
  {
    id: "generator-opisow-uslug",
    name: "Generator opisów usług",
    tagline: "Opisy, które sprzedają za Ciebie",
    description: "Podaj usługi i cechy — AI napisze profesjonalne opisy z korzyściami dla klienta, gotowe na stronę.",
    iconName: "ListChecks",
    category: "content",
    fields: [
      { key: "firma", label: "Nazwa firmy", type: "text", placeholder: "np. Pracownia Fryzjerska Ania", required: true },
      { key: "uslugi", label: "Usługi do opisania (do 5)", type: "textarea", placeholder: "np.\nCięcie i stylizacja\nKoloryzacja\nKuracje pielęgnacyjne", required: true, rows: 4 },
      { key: "target", label: "Dla kogo", type: "text", placeholder: "np. kobiety 25-50 lat, osoby dbające o wygląd" },
      { key: "wyroznik", label: "Wyróżnik oferty", type: "text", placeholder: "np. 12 lat doświadczenia, naturalne kosmetyki, indywidualne podejście" },
    ],
    systemPrompt: "Jesteś copywriterem specjalizującym się w opisach usług dla małych firm. Piszesz konkretnie, skupiasz się na korzyściach dla klienta, nie na funkcjach. Unikasz fraz takich jak 'najwyższa jakość' lub 'kompleksowa obsługa'. Każdy opis ma mieć jasne CTA. Piszesz wyłącznie po polsku.",
    buildPrompt: (v_) => `Firma: ${v(v_, "firma")}
Usługi: ${v(v_, "uslugi")}
Klient docelowy: ${v(v_, "target", "osoby prywatne")}
Wyróżnik: ${v(v_, "wyroznik", "jakość i doświadczenie")}

Napisz profesjonalny opis każdej z usług według schematu:

**[NAZWA USŁUGI]**
[2-3 zdania opisu — co dostaje klient, jak wygląda usługa]

Korzyści:
• [korzyść 1]
• [korzyść 2]
• [korzyść 3]

Dla kogo: [jedno zdanie]
CTA: [tekst przycisku — np. "Umów wizytę", "Zapytaj o termin"]

---

Po wszystkich opisach: krótka propozycja tytułu dla strony usług.`,
    outputFormat: "sections",
    exampleSnippet: "**Koloryzacja włosów**\nZmieniamy kolor tak, aby wyglądał naturalnie...",
    ctaLabel: "Zamów pełne teksty na stronę",
    available: true,
  },

  // 06
  {
    id: "generator-postow-social",
    name: "Generator postów social media",
    tagline: "3 gotowe posty w 30 sekund",
    description: "Podaj temat i platformę — AI napisze gotowe posty na Facebook, Instagram lub TikTok z hashtagami.",
    iconName: "Share2",
    category: "social",
    badge: "Nowe",
    fields: [
      { key: "firma", label: "Nazwa firmy", type: "text", placeholder: "np. Cukiernia Pod Różą", required: true },
      { key: "platforma", label: "Platforma", type: "select", options: [
        { value: "facebook", label: "Facebook" },
        { value: "instagram", label: "Instagram" },
        { value: "tiktok", label: "TikTok" },
        { value: "linkedin", label: "LinkedIn" },
      ]},
      { key: "temat", label: "Temat lub okazja", type: "text", placeholder: "np. nowe ciasto w menu, promocja weekendowa, za kulisami", required: true },
      { key: "ton", label: "Ton", type: "select", options: [
        { value: "ciepły", label: "Ciepły i osobisty" },
        { value: "profesjonalny", label: "Profesjonalny" },
        { value: "zabawny", label: "Lekki i zabawny" },
        { value: "informacyjny", label: "Informacyjny" },
      ]},
    ],
    systemPrompt: "Jesteś ekspertem od social media dla małych polskich firm. Piszesz posty, które angażują lokalną społeczność. Dostosowujesz styl do platformy. Unikasz korporacyjnego tonu. Każdy post jest naturalny, jak pisany przez właściciela. Dołączasz odpowiednie hashtagi po polsku i angielsku.",
    buildPrompt: (v_) => `Firma: ${v(v_, "firma")}
Platforma: ${v(v_, "platforma", "facebook")}
Temat: ${v(v_, "temat")}
Ton: ${v(v_, "ton", "ciepły")}

Napisz 3 różne wersje postu na ${v(v_, "platforma", "Facebook")} na temat: "${v(v_, "temat")}".

Każdy post powinien mieć inny kąt (perspektywę, ciekawostkę, ofertę lub emocję).

Format każdego postu:
---
**Post [nr]** — [krótki opis kąta]
[Treść postu — naturalnie, jakby pisał właściciel]
.
.
#hashtag1 #hashtag2 #hashtag3 (8-12 hashtagów)
---

Na końcu: wskazówka — który post warto opublikować i o jakiej porze.`,
    outputFormat: "text",
    exampleSnippet: "Dzisiaj o 5 rano stanęłam przy stolnicy... 🥐",
    ctaLabel: "Zamów plan social media na miesiąc",
    available: true,
  },

  // 07
  {
    id: "generator-wizytowki-google",
    name: "Generator wizytówki Google",
    tagline: "Wizytówka, która pojawia się na górze",
    description: "AI przygotuje opis firmy, kategorii, godzin i FAQ dla Profilu Firmy w Google, zoptymalizowany pod lokalne SEO.",
    iconName: "MapPin",
    category: "seo",
    fields: [
      { key: "firma", label: "Nazwa firmy", type: "text", placeholder: "np. Salon Urody Bella", required: true },
      { key: "branza", label: "Rodzaj działalności", type: "text", placeholder: "np. salon kosmetyczny, zabiegi pielęgnacyjne twarzy i ciała", required: true },
      { key: "miasto", label: "Miasto i adres", type: "text", placeholder: "np. Wrocław, ul. Świdnicka", required: true },
      { key: "uslugi", label: "Główne usługi (max 5)", type: "text", placeholder: "np. manicure, pedicure, masaże, zabiegi na twarz" },
    ],
    systemPrompt: "Jesteś ekspertem od Google Business Profile (dawniej Google My Business) dla lokalnych firm w Polsce. Tworzysz opisy zoptymalizowane pod lokalne wyszukiwania, naturalne dla klientów i bogate w słowa kluczowe. Piszesz po polsku.",
    buildPrompt: (v_) => `Firma: ${v(v_, "firma")}
Rodzaj działalności: ${v(v_, "branza")}
Lokalizacja: ${v(v_, "miasto")}
Usługi: ${v(v_, "uslugi", "szeroki zakres usług")}

Przygotuj kompletną wizytówkę Google Business Profile:

## OPIS FIRMY (750 znaków)
[Opis bogaty w słowa kluczowe, naturalny, zachęcający do kontaktu]

## KATEGORIE GOOGLE
- Kategoria główna: [kategoria]
- Kategorie dodatkowe (3): [lista]

## ATRYBUTY
[Lista rekomendowanych atrybutów — np. "Dostępne dla wózków", "Akceptuje karty"]

## FAQ NA PROFILU (5 pytań + odpowiedzi)
Q: [pytanie]
A: [odpowiedź 1-2 zdania]

## POSTY GOOGLE (2 propozycje postów tygodniowych)
[Post 1 — oferta/aktualność]
[Post 2 — wskazówka/ciekawostka]

## SŁOWA KLUCZOWE DO OPINII
[Słowa, o które warto poprosić klientów, by używali w recenzjach]`,
    outputFormat: "sections",
    exampleSnippet: "**Opis:** Salon Urody Bella we Wrocławiu to miejsce, gdzie...",
    ctaLabel: "Zamów optymalizację wizytówki Google",
    available: true,
  },

  // 08
  {
    id: "generator-regulaminu",
    name: "Generator regulaminu",
    tagline: "Regulamin gotowy w 2 minuty",
    description: "Wypełnij formularz — AI wygeneruje regulamin strony lub sklepu dostosowany do Twojej działalności. Wymaga weryfikacji prawnika.",
    iconName: "ScrollText",
    category: "legal",
    fields: [
      { key: "firma", label: "Nazwa firmy / właściciel", type: "text", placeholder: "np. Jan Kowalski prowadzący działalność pod nazwą Kwiaciarnia Różana", required: true },
      { key: "typ", label: "Typ regulaminu", type: "select", options: [
        { value: "sklep", label: "Sklep internetowy" },
        { value: "strona", label: "Strona usługowa" },
        { value: "rezerwacje", label: "System rezerwacji / umawianie wizyt" },
        { value: "kurs", label: "Kursy / szkolenia online" },
      ]},
      { key: "branza", label: "Rodzaj działalności", type: "text", placeholder: "np. sprzedaż biżuterii handmade, usługi fryzjerskie" },
      { key: "email", label: "E-mail do reklamacji", type: "text", placeholder: "np. kontakt@twojafirma.pl" },
    ],
    systemPrompt: "Jesteś asystentem prawnym specjalizującym się w prawie e-commerce i regulaminach dla małych firm. Tworzysz przystępne, zgodne z RODO i prawem konsumenckim regulaminy. ZAWSZE dodajesz disclaimer, że dokument wymaga weryfikacji przez prawnika. Piszesz po polsku, formalnym językiem.",
    buildPrompt: (v_) => `Firma: ${v(v_, "firma")}
Typ regulaminu: ${v(v_, "typ", "strona usługowa")}
Działalność: ${v(v_, "branza", "usługi")}
E-mail kontaktowy: ${v(v_, "email", "kontakt@firma.pl")}

⚠️ ZAWSZE zacznij od: "WAŻNE: Ten regulamin ma charakter poglądowy i wymaga weryfikacji przez prawnika lub doradcę prawnego przed publikacją."

Następnie wygeneruj regulamin z sekcjami:
1. Postanowienia ogólne
2. Definicje
3. Zasady korzystania z serwisu/sklepu
4. Zamówienia i płatności [jeśli sklep]
5. Dostawa / realizacja usługi
6. Reklamacje i zwroty (14 dni — prawo UE)
7. Ochrona danych osobowych (RODO)
8. Odpowiedzialność
9. Postanowienia końcowe

Regulamin ma być konkretny, bez pustych ogólników.`,
    outputFormat: "text",
    exampleSnippet: "§1 Postanowienia ogólne\n1. Niniejszy regulamin...",
    ctaLabel: "Zamów weryfikację prawną regulaminu",
    available: true,
  },

  // 09
  {
    id: "generator-polityki-prywatnosci",
    name: "Generator polityki prywatności",
    tagline: "RODO zgodna polityka w minutę",
    description: "AI generuje politykę prywatności zgodną z RODO dla Twojej strony lub sklepu. Pamiętaj o weryfikacji przez prawnika.",
    iconName: "Shield",
    category: "legal",
    fields: [
      { key: "firma", label: "Nazwa firmy / administrator danych", type: "text", placeholder: "np. Anna Nowak, ul. Kwiatowa 5, 00-001 Warszawa", required: true },
      { key: "strona", label: "Adres strony", type: "text", placeholder: "np. www.twojafirma.pl" },
      { key: "dane", label: "Jakie dane zbierasz", type: "select", options: [
        { value: "kontakt", label: "Tylko formularz kontaktowy (imię, email)" },
        { value: "zamowienia", label: "Formularz kontaktowy + dane do zamówień" },
        { value: "newsletter", label: "Email do newslettera" },
        { value: "pelne", label: "Pełny e-commerce (dane klientów, płatności, dostawa)" },
      ]},
      { key: "narzedzia", label: "Narzędzia na stronie", type: "text", placeholder: "np. Google Analytics, Facebook Pixel, Hotjar" },
    ],
    systemPrompt: "Jesteś asystentem prawnym specjalizującym się w RODO i politykach prywatności dla małych firm e-commerce. Tworzysz czytelne, zgodne z RODO polityki prywatności. ZAWSZE dodajesz disclaimer o weryfikacji przez prawnika. Piszesz po polsku, formalnie ale przystępnie.",
    buildPrompt: (v_) => `Administrator: ${v(v_, "firma")}
Strona: ${v(v_, "strona", "www.firma.pl")}
Zbierane dane: ${v(v_, "dane", "formularz kontaktowy")}
Narzędzia: ${v(v_, "narzedzia", "brak")}

⚠️ Zacznij od: "WAŻNE: Polityka ma charakter poglądowy — wymaga weryfikacji przez prawnika przed publikacją."

Wygeneruj politykę prywatności RODO z sekcjami:
1. Administrator danych osobowych
2. Jakie dane zbieramy i dlaczego (cel + podstawa prawna)
3. Jak długo przechowujemy dane
4. Komu udostępniamy dane
5. Pliki cookies i narzędzia analityczne
6. Prawa użytkownika (dostęp, sprostowanie, usunięcie, przenoszenie)
7. Bezpieczeństwo danych
8. Kontakt w sprawach prywatności
9. Zmiany polityki prywatności`,
    outputFormat: "text",
    exampleSnippet: "§1 Administrator danych\nAdministratorem Twoich danych osobowych jest...",
    ctaLabel: "Zamów weryfikację polityki przez prawnika",
    available: true,
  },

  // 10
  {
    id: "generator-faq",
    name: "Generator FAQ",
    tagline: "Odpowiedz na pytania, zanim padną",
    description: "Opisz swoją działalność — AI przygotuje 10 najczęstszych pytań i odpowiedzi dla Twojej strony, zoptymalizowanych pod FAQ Schema.",
    iconName: "HelpCircle",
    category: "content",
    fields: [
      { key: "firma", label: "Nazwa firmy", type: "text", placeholder: "np. Gabinet Fizjoterapii Aktywni", required: true },
      { key: "branza", label: "Branża / usługi", type: "text", placeholder: "np. fizjoterapia, masaże, rehabilitacja", required: true },
      { key: "problemy", label: "Typowe wątpliwości klientów", type: "textarea", placeholder: "np. Ile kosztuje wizyta? Jak zarezerwować? Czy potrzebne skierowanie?", rows: 3 },
    ],
    systemPrompt: "Jesteś ekspertem od content marketingu i SEO. Tworzysz FAQ, które odpowiadają na realne pytania klientów, pomagają w decyzji zakupowej i są zoptymalizowane pod wyszukiwarki. Piszesz po polsku, naturalnym językiem.",
    buildPrompt: (v_) => `Firma: ${v(v_, "firma")}
Branża: ${v(v_, "branza")}
Typowe pytania klientów: ${v(v_, "problemy", "ceny, proces, czas oczekiwania")}

Stwórz 10 pytań FAQ dla tej firmy. Pytania mają być:
- Realne — takie, jakie zadają klienci przed zakupem/skorzystaniem z usługi
- Zoptymalizowane pod Google (frazy pytaniowe)
- Odpowiedzi konkretne (2-4 zdania)

Format:
**Q: [pytanie]**
A: [odpowiedź — konkretna, bez owijania w bawełnę]

Na końcu: krótka wskazówka, jak umieścić FAQ na stronie (z FAQ Schema).`,
    outputFormat: "list",
    exampleSnippet: "**Q: Ile trwa pierwsza wizyta?**\nA: Pierwsza wizyta trwa zazwyczaj 60 minut...",
    ctaLabel: "Zamów pełną stronę FAQ ze schematem",
    available: true,
  },

  // 11
  {
    id: "audyt-strony",
    name: "Audyt strony internetowej",
    tagline: "Znajdź, co hamuje Twoją stronę",
    description: "Opisz swoją stronę — AI przeanalizuje typowe problemy dla Twojej branży i zaproponuje konkretne poprawki.",
    iconName: "Scan",
    category: "analysis",
    fields: [
      { key: "url", label: "Adres strony", type: "text", placeholder: "np. www.mojastrona.pl", required: true },
      { key: "branza", label: "Branża i cel strony", type: "text", placeholder: "np. sklep z biżuterią, cel: sprzedaż", required: true },
      { key: "problem", label: "Główny problem / co nie działa", type: "textarea", placeholder: "np. mało odwiedzin, słaba konwersja, wolne ładowanie, brak klientów z Google", rows: 3 },
      { key: "platforma", label: "Platforma strony", type: "select", options: [
        { value: "wordpress", label: "WordPress" },
        { value: "woocommerce", label: "WooCommerce" },
        { value: "wix", label: "Wix / Squarespace" },
        { value: "custom", label: "Strona na zamówienie" },
        { value: "nie-wiem", label: "Nie wiem" },
      ]},
    ],
    systemPrompt: "Jesteś doświadczonym konsultantem web i SEO dla małych firm. Przeprowadzasz audyty stron i dajesz konkretne, priorytetyzowane rekomendacje. Nie piszesz ogólnych rad — skupiasz się na problemach podanej branży i platformy. Każda rekomendacja ma być actionable. Piszesz po polsku.",
    buildPrompt: (v_) => `Strona: ${v(v_, "url")}
Branża / cel: ${v(v_, "branza")}
Opisany problem: ${v(v_, "problem", "brak klientów")}
Platforma: ${v(v_, "platforma", "nieznana")}

Przeprowadź audyt strony i przygotuj raport:

## 🔴 KRYTYCZNE PROBLEMY (napraw w pierwszej kolejności)
[3-5 problemów typowych dla tej branży i platformy]

## 🟡 WAŻNE DO POPRAWY
[3-4 obszary wymagające uwagi]

## 🟢 SZYBKIE WYGRANE (możesz zrobić sam/sama)
[3-4 rzeczy, które można naprawić bez programisty]

## 📊 SEO — CO SPRAWDZIĆ
[Lista 5 elementów SEO do weryfikacji]

## 💡 PRIORYTET DZIAŁAŃ
[Krótki plan — co robić najpierw i dlaczego]

## 🛠️ NARZĘDZIA DO SPRAWDZENIA
[Lista 4-5 darmowych narzędzi do samodzielnego audytu]`,
    outputFormat: "sections",
    exampleSnippet: "## 🔴 KRYTYCZNE PROBLEMY\n1. Brak mobile-first...",
    ctaLabel: "Zamów pełny audyt strony z ekspertem",
    available: true,
  },

  // 12
  {
    id: "analiza-konkurencji",
    name: "Analiza konkurencji",
    tagline: "Zobacz, co robi konkurencja",
    description: "Podaj branżę i lokalizację — AI przygotuje analizę krajobrazu konkurencji i wskaże Twoje szanse wyróżnienia.",
    iconName: "BarChart3",
    category: "analysis",
    fields: [
      { key: "branza", label: "Branża / rodzaj działalności", type: "text", placeholder: "np. kosmetyczka, trener personalny, restauracja", required: true },
      { key: "miasto", label: "Miasto / region", type: "text", placeholder: "np. Gdańsk, Trójmiasto", required: true },
      { key: "wyroznik", label: "Co Cię wyróżnia (lub chcesz wyróżniać)", type: "text", placeholder: "np. naturalne kosmetyki, elastyczne godziny, szybka realizacja" },
      { key: "ceny", label: "Poziom cenowy", type: "select", options: [
        { value: "budzetowy", label: "Budżetowy / dostępny" },
        { value: "sredni", label: "Środkowy / standardowy" },
        { value: "premium", label: "Premium / ekskluzywny" },
      ]},
    ],
    systemPrompt: "Jesteś analitykiem rynku i strategiem biznesowym dla małych firm. Analizujesz krajobraz konkurencji i pomagasz znaleźć nisze i szanse wyróżnienia. Twoja analiza jest konkretna i praktyczna, nie akademicka. Piszesz po polsku.",
    buildPrompt: (v_) => `Branża: ${v(v_, "branza")}
Lokalizacja: ${v(v_, "miasto")}
Wyróżnik: ${v(v_, "wyroznik", "jakość i obsługa")}
Pozycjonowanie cenowe: ${v(v_, "ceny", "środkowy")}

Przygotuj analizę konkurencji:

## 🏪 KRAJOBRAZ KONKURENCJI
[Typowa struktura konkurencji w tej branży i mieście — kto dominuje, jakie są wzorce]

## 💪 MOCNE STRONY TYPOWYCH KONKURENTÓW
[Co robią dobrze — to, co musisz przynajmniej dorównać]

## ⚡ SŁABE STRONY KONKURENCJI
[Typowe bolączki firm w tej branży — Twoje szanse]

## 🎯 NISZE I SZANSE
[3-5 konkretnych nisz lub wyróżników, które można wykorzystać]

## 📢 JAK SIĘ WYRÓŻNIĆ
[Strategia pozycjonowania dopasowana do podanego wyróżnika]

## 🔍 CO SPRAWDZIĆ O KONKURENCJI
[Lista 5 rzeczy do zbadania samodzielnie — Google Maps, strony, social media]`,
    outputFormat: "sections",
    exampleSnippet: "## 🏪 KRAJOBRAZ\nW Gdańsku działa ok. 40 salonów kosmetycznych...",
    ctaLabel: "Zamów pełną strategię biznesową",
    available: true,
  },

  // 13
  {
    id: "generator-cennika",
    name: "Generator cennika usług",
    tagline: "Cennik, który nie odstrasza — i sprzedaje",
    description: "Podaj usługi i ceny — AI stworzy przejrzysty cennik z opisami korzyści gotowy na stronę.",
    iconName: "Receipt",
    category: "business",
    fields: [
      { key: "firma", label: "Nazwa firmy", type: "text", placeholder: "np. Studio Fotograficzne Kadr", required: true },
      { key: "uslugi", label: "Usługi z cenami (jedna na linię)", type: "textarea", placeholder: "np.\nSesja rodzinna — 500 zł\nSesja biznesowa — 800 zł\nSesja produktowa — 600 zł", required: true, rows: 5 },
      { key: "branza", label: "Branża / specjalizacja", type: "text", placeholder: "np. fotografia ślubna i portretowa" },
      { key: "plus", label: "Co jest wliczone w cenę", type: "text", placeholder: "np. 2 godziny sesji, 50 zdjęć w retuszu, galeria online" },
    ],
    systemPrompt: "Jesteś copywriterem specjalizującym się w cennikach i stronach sprzedażowych. Tworzysz cenniki, które są jasne, budują zaufanie i pomagają klientowi podjąć decyzję. Każda pozycja cennika ma opis korzyści, nie tylko cenę. Piszesz po polsku.",
    buildPrompt: (v_) => `Firma: ${v(v_, "firma")}
Usługi i ceny: ${v(v_, "uslugi")}
Branża: ${v(v_, "branza", "usługi")}
Co wliczone w cenę: ${v(v_, "plus", "standardowy zakres")}

Stwórz profesjonalny cennik usług:

## 📋 WSTĘP DO CENNIKA
[2-3 zdania — dlaczego ceny są uczciwe i co klient dostaje]

## 💰 POZYCJE CENNIKA
Dla każdej usługi:
**[NAZWA] — [CENA]**
✓ [Co zawiera — punkt 1]
✓ [Co zawiera — punkt 2]
✓ [Co zawiera — punkt 3]
*Idealne dla: [kto powinien wybrać tę opcję]*

## ❓ NAJCZĘSTSZE PYTANIA O CENY
Q: Czy ceny są negocjowalne?
A: [odpowiedź]
Q: Czy można zapłacić w ratach?
A: [odpowiedź]

## 📞 CTA
[Tekst zachęcający do kontaktu / wyceny indywidualnej]`,
    outputFormat: "sections",
    exampleSnippet: "**Sesja rodzinna — 500 zł**\n✓ 2 godziny sesji w plenerze...",
    ctaLabel: "Zamów pełną stronę ofertową",
    available: true,
  },

  // 14
  {
    id: "generator-oferty-pdf",
    name: "Generator oferty",
    tagline: "Profesjonalna oferta w parę minut",
    description: "Podaj dane klienta i zakres — AI napisze pełną ofertę handlową gotową do wysłania jako PDF.",
    iconName: "FileDown",
    category: "business",
    fields: [
      { key: "twoja_firma", label: "Twoja firma", type: "text", placeholder: "np. Jan Kowalski / Biuro Rachunkowe Precyzja", required: true },
      { key: "klient", label: "Dla kogo jest oferta", type: "text", placeholder: "np. Firma XYZ sp. z o.o., Pani Anna Nowak", required: true },
      { key: "usluga", label: "Oferowana usługa / produkt", type: "text", placeholder: "np. prowadzenie księgowości, projekt logo, obsługa social media", required: true },
      { key: "cena", label: "Cena lub zakres cenowy", type: "text", placeholder: "np. 800 zł/miesiąc, od 1500 do 2500 zł" },
      { key: "szczegoly", label: "Szczegóły zakresu", type: "textarea", placeholder: "np. miesięczne rozliczenie VAT, przygotowanie deklaracji, kontakt z US", rows: 3 },
    ],
    systemPrompt: "Jesteś specjalistą od ofert handlowych B2B i B2C dla małych firm. Tworzysz profesjonalne, przekonujące oferty, które odpowiadają na potrzeby klienta i budują zaufanie. Nie używasz zbędnego języka korporacyjnego. Piszesz po polsku.",
    buildPrompt: (v_) => `Moja firma: ${v(v_, "twoja_firma")}
Klient: ${v(v_, "klient")}
Usługa: ${v(v_, "usluga")}
Cena: ${v(v_, "cena", "do ustalenia")}
Zakres: ${v(v_, "szczegoly", "standardowy")}

Przygotuj profesjonalną ofertę handlową:

# OFERTA WSPÓŁPRACY
**Przygotowana dla:** ${v(v_, "klient")}
**Data:** [data bieżąca]

## Rozumiem Twoje potrzeby
[2-3 zdania — pokaż, że rozumiesz sytuację klienta]

## Proponowane rozwiązanie
[Opis usługi — co dokładnie, jak, kiedy]

## Zakres prac
• [punkt 1]
• [punkt 2]
• [punkt 3]
• [punkt 4]

## Inwestycja
**${v(v_, "cena", "do ustalenia")}**
[Co jest wliczone, warunki płatności]

## Dlaczego ja?
[3 konkretne powody — doświadczenie, efekty, gwarancje]

## Następne kroki
[Prosty 3-krokowy plan — co zrobić, żeby zacząć]

## Ważność oferty
Oferta ważna 14 dni od daty wysłania.`,
    outputFormat: "text",
    exampleSnippet: "# OFERTA WSPÓŁPRACY\nPrzygotowana dla: Firma XYZ...",
    ctaLabel: "Zamów szablon oferty PDF z branding",
    available: true,
  },

  // 15
  {
    id: "generator-kolorow-marki",
    name: "Generator kolorów marki",
    tagline: "Paleta, która mówi o Twojej marce",
    description: "Opisz markę i wartości — AI dobierze profesjonalną paletę kolorów z kodami HEX i zasadami użycia.",
    iconName: "Palette",
    category: "design",
    badge: "Nowe",
    fields: [
      { key: "branza", label: "Branża", type: "text", placeholder: "np. salon spa, kancelaria prawna, piekarnia rzemieślnicza", required: true },
      { key: "wartosci", label: "Wartości marki", type: "text", placeholder: "np. spokój, luksus, tradycja, nowoczesność, zaufanie" },
      { key: "target", label: "Kim jest Twój klient", type: "text", placeholder: "np. kobiety 30-50 lat, profesjonaliści, rodziny" },
      { key: "nastroj", label: "Nastrój / feeling marki", type: "select", options: [
        { value: "elegancki", label: "Elegancki i premium" },
        { value: "ciepły", label: "Ciepły i przyjazny" },
        { value: "minimalistyczny", label: "Minimalistyczny i czysty" },
        { value: "odważny", label: "Odważny i energetyczny" },
        { value: "tradycyjny", label: "Tradycyjny i klasyczny" },
      ]},
    ],
    systemPrompt: "Jesteś projektantem brand identity i specjalistą od psychologii koloru. Tworzysz palety kolorów dla firm, które oddają charakter marki i są funkcjonalne (kontrast, czytelność, WCAG). Podajesz kody HEX, nazwy i zasady użycia. Piszesz po polsku.",
    buildPrompt: (v_) => `Branża: ${v(v_, "branza")}
Wartości: ${v(v_, "wartosci", "jakość i profesjonalizm")}
Klient: ${v(v_, "target", "dorośli")}
Nastrój: ${v(v_, "nastroj", "elegancki")}

Zaprojektuj kompletną paletę kolorów marki:

## 🎨 PALETA GŁÓWNA (5 kolorów)

**Kolor podstawowy (Primary)**
HEX: #[kod]
Nazwa: [poetycka nazwa np. "Szafranowy zmierzch"]
Użycie: [gdzie — przyciski, nagłówki, logo]

**Kolor uzupełniający (Secondary)**
HEX: #[kod]
Nazwa: [nazwa]
Użycie: [gdzie]

**Akcent (Accent)**
HEX: #[kod]
Użycie: [CTA, podkreślenia]

**Tło (Background)**
HEX: #[kod]
Wariant ciemny: #[kod]

**Tekst (Text)**
Główny: #[kod]
Muted: #[kod]

## 📐 ZASADY UŻYCIA
[Jak łączyć kolory — co z czym pasuje]

## ✅ KONTRAST WCAG
[Które kombinacje spełniają standardy dostępności]

## 💡 INSPIRACJE
[2-3 znane marki z podobną paletą i dlaczego działa]`,
    outputFormat: "sections",
    exampleSnippet: "**Primary:** #8B5E3C — Czekoladowy bursztyn\nUżycie: logo, przyciski...",
    ctaLabel: "Zamów kompletny brand identity",
    available: true,
  },

  // 16
  {
    id: "generator-landing-page",
    name: "Generator landing page",
    tagline: "Strona, która konwertuje",
    description: "Podaj produkt/usługę i cel — AI zaprojektuje strukturę landing page z kompletną treścią i CTA.",
    iconName: "Layout",
    category: "content",
    fields: [
      { key: "produkt", label: "Produkt lub usługa", type: "text", placeholder: "np. kurs online malowania akwarelą, konsultacje dietetyczne", required: true },
      { key: "cena", label: "Cena", type: "text", placeholder: "np. 299 zł, od 150 zł/sesja" },
      { key: "target", label: "Klient docelowy", type: "text", placeholder: "np. kobiety 25-45 lat, początkujący hobbyści" },
      { key: "cta", label: "Główne CTA", type: "text", placeholder: "np. Zapisz się, Kup teraz, Umów konsultację" },
    ],
    systemPrompt: "Jesteś copywriterem specjalizującym się w landing pages i stronach sprzedażowych. Piszesz treści, które konwertują. Każda sekcja ma konkretny cel. Unikasz ogólnych fraz. Piszesz po polsku.",
    buildPrompt: (v_) => `Produkt/usługa: ${v(v_, "produkt")}
Cena: ${v(v_, "cena", "do ustalenia")}
Klient: ${v(v_, "target", "osoby prywatne")}
Główne CTA: ${v(v_, "cta", "Dowiedz się więcej")}

Zaprojektuj kompletny landing page z treściami:

## 🎯 HERO
**Nagłówek H1:** [mocne, konkretne — co zyska klient]
**Podtytuł:** [jedno zdanie — obietnica lub dowód]
**CTA:** [${v(v_, "cta", "Dowiedz się więcej")}]
**Pod CTA:** [3 korzyści w jednej linii — bullet points]

## ✨ SEKCJA KORZYŚCI (3-4 główne)
Dla każdej: ikona, nagłówek, opis (2 zdania)

## 📦 ZAWARTOŚĆ / CO DOSTAJE KLIENT
[Lista tego, co konkretnie wchodzi w skład oferty]

## 🗣️ OPINIE (3 fikcyjne, wiarygodne)
[Format: cytat + imię + kontekst]

## 💰 CENA I PAKIETY
[Prezentacja ceny z uzasadnieniem wartości]

## ❓ FAQ (5 pytań)

## 🚀 CTA końcowe
[Nagłówek + opis + przycisk + gwarancja]`,
    outputFormat: "sections",
    exampleSnippet: "## HERO\n**Naucz się malować akwarelą w 30 dni**",
    ctaLabel: "Zamów gotową stronę landing page",
    available: true,
  },

  // 17 — SVG logo generator
  {
    id: "generator-logo",
    name: "Generator logo",
    tagline: "Pierwsze wrażenie robi się raz",
    description: "Opisz markę — AI wygeneruje gotowe logo w formacie SVG, które możesz pobrać i użyć od razu.",
    iconName: "Pen",
    category: "design",
    fields: [
      { key: "firma", label: "Nazwa firmy", type: "text", placeholder: "np. Zielona Herbata Studio", required: true },
      { key: "branza", label: "Branża", type: "text", placeholder: "np. herbaciarnia, wellness, kawiarnia" },
      { key: "styl", label: "Styl logo", type: "select", options: [
        { value: "minimalistyczny", label: "Minimalistyczne — litera + geometria" },
        { value: "typograficzne", label: "Typograficzne — sama nazwa, elegancki krój" },
        { value: "emblematyczne", label: "Emblemat — nazwa w kształcie pieczęci / koła" },
        { value: "symboliczne", label: "Symbol + nazwa — ikona branżowa obok tekstu" },
      ]},
      { key: "kolor1", label: "Kolor główny (HEX lub nazwa)", type: "text", placeholder: "np. #2d6a4f lub ciemna zieleń" },
      { key: "kolor2", label: "Kolor tła / akcentu", type: "text", placeholder: "np. #f8f4ec lub kremowy (zostaw puste = białe)" },
    ],
    systemPrompt: "Jesteś generatorem SVG logo. Twoim jedynym zadaniem jest zwrócenie poprawnego kodu SVG logo. Nie piszesz żadnych wyjaśnień, opisów ani markdown. Zwracasz TYLKO kod SVG — zaczynający się od <svg i kończący na </svg>. SVG musi być self-contained, bez zewnętrznych zasobów, z wbudowanymi fontami jako path lub z bezpiecznymi systemowymi fontami (Arial, Georgia, Helvetica). Logo ma być profesjonalne, czytelne i skalowalne.",
    buildPrompt: (v_) => {
      const firma = v(v_, "firma", "Firma");
      const branza = v(v_, "branza", "usługi");
      const styl = v(v_, "styl", "minimalistyczny");
      const kolor1 = v(v_, "kolor1", "#1a1a1a");
      const kolor2 = v(v_, "kolor2", "#ffffff");
      return `Wygeneruj SVG logo dla firmy "${firma}" (branża: ${branza}).

Styl: ${styl}
Kolor główny: ${kolor1}
Kolor tła/akcentu: ${kolor2}

Wymagania techniczne:
- viewBox="0 0 400 150"
- width="400" height="150"
- xmlns="http://www.w3.org/2000/svg"
- Brak zewnętrznych fontów — użyj font-family="Arial, Helvetica, sans-serif" lub "Georgia, serif"
- Nazwa firmy "${firma}" musi być widoczna jako tekst lub path
- Dopasuj elementy graficzne do stylu: ${styl}
- Kolory: główny ${kolor1}, akcent/tło ${kolor2}
- Kod musi być kompletny i samodzielny

Odpowiedz TYLKO kodem SVG. Zacznij od <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 150"`;
    },
    outputFormat: "svg",
    exampleSnippet: '<svg viewBox="0 0 400 150"><rect fill="#2d6a4f" .../><text>Zielona Herbata</text></svg>',
    ctaLabel: "Zamów profesjonalne logo od naszego designera",
    available: true,
  },

  // 18
  {
    id: "generator-czatu-ai",
    name: "Czat AI dla Twojej firmy",
    tagline: "Gotowy widget do wklejenia na stronę klienta",
    description: "Podłącz model i klucz API klienta, skonfiguruj wiedzę firmy i otrzymaj jedną linię kodu do wdrożenia. Klucz pozostaje zaszyfrowany, a rozmowy zapisują się w panelu.",
    iconName: "Bot",
    category: "business",
    badge: "Beta",
    fields: [
      { key: "firma", label: "Nazwa firmy", type: "text", placeholder: "np. Biuro Nieruchomości Bezpieczny Dom", required: true },
      { key: "branza", label: "Branża i usługi", type: "text", placeholder: "np. sprzedaż i wynajem nieruchomości w Krakowie", required: true },
      { key: "pytania", label: "Wiedza, cennik i typowe pytania", type: "textarea", placeholder: "Godziny pracy, ceny, zasady rezerwacji i odpowiedzi na częste pytania klientów", rows: 5 },
      { key: "cel", label: "Cel czatu", type: "select", options: [
        { value: "info", label: "Informowanie o ofercie" },
        { value: "leady", label: "Zbieranie kontaktów (leadów)" },
        { value: "rezerwacje", label: "Umawianie spotkań" },
        { value: "wszystko", label: "Wszystko powyższe" },
      ]},
    ],
    systemPrompt: "Jesteś ekspertem od wdrożeń chatbotów AI dla małych firm. Projektujesz scenariusze rozmów i prompty systemowe. Piszesz po polsku.",
    buildPrompt: (v_) => `Firma: ${v(v_, "firma")}
Branża: ${v(v_, "branza")}
Typowe pytania: ${v(v_, "pytania")}
Cel czatu: ${v(v_, "cel", "informowanie")}

Zaprojektuj konfigurację chatbota AI dla tej firmy:

## PROMPT SYSTEMOWY (gotowy do użycia)
[Kompletny system prompt dla chatbota — kim jest, co wie, jak reaguje, czego nie robi]

## SCENARIUSZE ROZMÓW

**Scenariusz 1: Pytanie o ofertę**
Klient: "Co oferujecie?"
Bot: [przykładowa odpowiedź]

**Scenariusz 2: Pytanie o ceny**
Klient: "Ile to kosztuje?"
Bot: [przykładowa odpowiedź]

**Scenariusz 3: Zbieranie kontaktu**
Bot: [jak naturalnie poprosić o email/telefon]

## INTEGRACJE
[Gdzie i jak wdrożyć — strona, Messenger, WhatsApp]

## PRZEWIDYWANY EFEKT
[Co zyska firma po wdrożeniu]`,
    outputFormat: "sections",
    exampleSnippet: "## PROMPT SYSTEMOWY\nJesteś pomocnym asystentem firmy...",
    ctaLabel: "Zamów wdrożenie chatbota AI",
    available: true,
  },

  // 19
  {
    id: "generator-strony",
    name: "Generator strony internetowej",
    tagline: "Pełna strona w jednym kroku",
    description: "AI generuje kompletną strukturę i treści strony internetowej — hero, usługi, o nas, opinie, FAQ, kontakt i footer.",
    iconName: "Globe",
    category: "content",
    badge: "Nowe",
    fields: [
      { key: "firma", label: "Nazwa firmy", type: "text", placeholder: "np. Pracownia Jubilerska Złoty Czas", required: true },
      { key: "branza", label: "Branża / usługi", type: "text", placeholder: "np. reparacje biżuterii, wycena, skup złota", required: true },
      { key: "miasto", label: "Miasto", type: "text", placeholder: "np. Poznań" },
      { key: "wyroznik", label: "Wyróżnik / przewaga", type: "text", placeholder: "np. 30 lat tradycji, własny zakład, ekspresowe naprawy" },
    ],
    systemPrompt: "Jesteś doświadczonym copywriterem tworzącym pełne treści stron internetowych dla polskich małych firm. Piszesz konkretnie, sprzedażowo, naturalnie. Każda sekcja ma inny charakter — hero angażuje emocjonalnie, usługi informują, opinie budują zaufanie.",
    buildPrompt: (v_) => `Firma: ${v(v_, "firma")}
Branża: ${v(v_, "branza")}
Miasto: ${v(v_, "miasto", "Polska")}
Wyróżnik: ${v(v_, "wyroznik", "jakość i doświadczenie")}

Napisz kompletne treści strony internetowej:

## 🧭 NAWIGACJA
Logo: ${v(v_, "firma")} | Linki: [propozycja 4 linków] | CTA: [tekst przycisku]

## 🎯 HERO
H1: [mocny nagłówek]
Podtytuł: [2 zdania — obietnica]
CTA główne: [tekst] | CTA drugorzędne: [tekst]

## 💼 USŁUGI (3-4 pozycje)
[Każda: nazwa, krótki opis, ikona tematyczna]

## 👤 O FIRMIE (250 słów)
[Autentyczny opis — historia, wartości, dlaczego warto]

## ✨ WYRÓŻNIKI (3 powody)
[Każdy: nagłówek + opis 2 zdania]

## 🗣️ OPINIE KLIENTÓW (3)
[Cytaty z imionami i kontekstem]

## ❓ FAQ (5 pytań)

## 📞 KONTAKT / CTA
[Sekcja kontaktowa — nagłówek, zachęta, dane placeholderowe]

## 🦶 FOOTER
[Copyright, linki, opis firmy]`,
    outputFormat: "sections",
    exampleSnippet: "## HERO\n**Złoty czas Twojej biżuterii**\nNaprawiamy, wyceniamy i dbamy...",
    ctaLabel: "Zamów pełną stronę internetową",
    available: true,
  },

  // 20
  {
    id: "generator-ikon",
    name: "Generator ikon i favicon",
    tagline: "Ikona warta tysiąca słów",
    description: "Podaj inicjały lub symbol marki — AI wygeneruje favicon i ikonę w formacie SVG gotową do użycia na stronie.",
    iconName: "Star",
    category: "design",
    fields: [
      { key: "inicjaly", label: "Inicjały lub skrót (1-3 znaki)", type: "text", placeholder: "np. ZK, MA, BD", required: true, maxLength: 3 },
      { key: "firma", label: "Nazwa firmy", type: "text", placeholder: "np. Zielony Kąt" },
      { key: "styl", label: "Styl ikony", type: "select", options: [
        { value: "kolo", label: "Koło z inicjałami (klasyczny)" },
        { value: "kwadrat", label: "Kwadrat zaokrąglony z inicjałami" },
        { value: "tarcza", label: "Tarcza / emblemat" },
        { value: "diament", label: "Diament / romb" },
      ]},
      { key: "kolor", label: "Kolor główny (HEX lub nazwa)", type: "text", placeholder: "np. #2d6a4f lub granatowy" },
    ],
    systemPrompt: "Jesteś generatorem SVG ikon i faviconów. Twoim jedynym zadaniem jest zwrócenie DWÓCH bloków SVG: favicon (100x100) i ikona app (512x512). Nie piszesz żadnych wyjaśnień. Format odpowiedzi to dokładnie:\nFAVICON:\n<svg...></svg>\n\nAPP ICON:\n<svg...></svg>",
    buildPrompt: (v_) => {
      const inicjaly = v(v_, "inicjaly", "AB").toUpperCase();
      const firma = v(v_, "firma", "");
      const styl = v(v_, "styl", "kolo");
      const kolor = v(v_, "kolor", "#1a3a5c");
      const shapes: Record<string, string> = {
        kolo: "koło (circle) jako tło",
        kwadrat: "prostokąt zaokrąglony (rect z rx) jako tło",
        tarcza: "wielokąt w kształcie tarczy (polygon) jako tło",
        diament: "romb (polygon 50,5 95,50 50,95 5,50) jako tło",
      };
      return `Wygeneruj dwie ikony SVG dla marki ${firma || inicjaly}.

Inicjały: ${inicjaly}
Styl: ${shapes[styl] || styl}
Kolor główny: ${kolor}
Kolor tekstu: biały (#ffffff)

Wymagania:
- Brak zewnętrznych zasobów
- font-family="Arial, Helvetica, sans-serif" font-weight="bold"
- Inicjały "${inicjaly}" wyśrodkowane w ikonie
- Profesjonalny, czytelny wygląd

Odpowiedz DOKŁADNIE w tym formacie (nic więcej):

FAVICON:
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
[elementy SVG]
</svg>

APP ICON:
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
[elementy SVG — proporcjonalnie skalowane]
</svg>`;
    },
    outputFormat: "svg-icons",
    exampleSnippet: 'FAVICON:\n<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="#2d6a4f"/><text x="50" y="65" text-anchor="middle" fill="white" font-size="42" font-weight="bold" font-family="Arial">ZK</text></svg>',
    ctaLabel: "Zamów pełny zestaw ikon od naszego designera",
    available: true,
  },

  // 21 — HTML prototype generator
  {
    id: "generator-html-prototypu",
    name: "Generator HTML prototypu",
    tagline: "Gotowa strona w jednym pliku",
    description: "Opisz stronę — AI wygeneruje kompletny plik HTML+CSS, który możesz podejrzeć w przeglądarce i pobrać od razu.",
    iconName: "Code",
    category: "content",
    badge: "Nowe",
    fields: [
      { key: "typ", label: "Typ strony", type: "select", options: [
        { value: "landing", label: "Landing page — sprzedażowa" },
        { value: "wizytowka", label: "Wizytówka firmy" },
        { value: "portfolio", label: "Portfolio / galeria prac" },
        { value: "restauracja", label: "Restauracja / kawiarnia" },
        { value: "link-bio", label: "Link w bio (mobile)" },
      ], required: true },
      { key: "firma", label: "Nazwa firmy", type: "text", placeholder: "np. Studio Kwiat", required: true },
      { key: "branza", label: "Branża i główne usługi", type: "text", placeholder: "np. florystyka, dekoracje ślubne, warsztaty", required: true },
      { key: "kolor", label: "Kolor przewodni", type: "text", placeholder: "np. #e8b4a0 lub pudrowy róż" },
      { key: "styl", label: "Styl wizualny", type: "select", options: [
        { value: "minimalistyczny", label: "Minimalistyczny — dużo przestrzeni, subtelny" },
        { value: "elegancki", label: "Elegancki — ciemne tło, jasne akcenty" },
        { value: "ciepły", label: "Ciepły — kremowe tony, krój szeryfowy" },
        { value: "nowoczesny", label: "Nowoczesny — gradienty, bezszeryfowy" },
        { value: "odwazny", label: "Odważny — mocne kolory, duża typografia" },
      ]},
    ],
    systemPrompt: "Jesteś generatorem stron HTML. Zwracasz TYLKO kompletny kod HTML — bez opisu, bez markdown, bez backtick bloków kodu. Zaczynasz od <!DOCTYPE html> i kończysz na </html>. CSS jest w <style> w <head>. Strona musi być responsywna (mobile-first), profesjonalna, samodzielna (zero zewnętrznych JS, można użyć Google Fonts przez <link>). Treść po polsku.",
    buildPrompt: (v_) => {
      const typ = v(v_, "typ", "wizytowka");
      const firma = v(v_, "firma", "Firma");
      const branza = v(v_, "branza", "usługi");
      const kolor = v(v_, "kolor", "#1a1a1a");
      const styl = v(v_, "styl", "minimalistyczny");
      const typy: Record<string, string> = {
        landing: "landing page sprzedażowa z hero, korzyściami, CTA i sekcją kontaktu",
        wizytowka: "wizytówka z nawigacją, hero, o firmie, usługami, danymi kontaktowymi i stopką",
        portfolio: "portfolio z nagłówkiem, siatką projektów (6 placeholderów), bio i kontaktem",
        restauracja: "strona restauracji z menu, galerią, godzinami otwarcia i rezerwacją",
        "link-bio": "strona link-in-bio zoptymalizowana pod mobile: awatar, bio, 6-8 linków/przycisków",
      };
      return `Wygeneruj kompletną stronę HTML dla: ${firma}
Typ: ${typy[typ] || typ}
Branża: ${branza}
Kolor główny: ${kolor}
Styl: ${styl}

WYMAGANIA TECHNICZNE:
- Kompletny plik HTML (<!DOCTYPE html> do </html>)
- CSS wbudowany w <style> w <head>
- Responsywny: mobile-first, breakpoint 768px
- Użyj Google Fonts przez <link> jeśli pasuje do stylu (Playfair Display, Inter, DM Sans, Lora)
- Sekcje odpowiednie do typu: ${typy[typ] || typ}
- Placeholder tekst po polsku, pasujący do branży: ${branza}
- Przyciski HTML (bez JS)
- Meta charset="UTF-8", viewport, description
- Żadnych zewnętrznych CSS frameworków (tylko własny CSS)

Odpowiedz WYŁĄCZNIE kodem HTML. Pierwsza linia: <!DOCTYPE html>`;
    },
    outputFormat: "html",
    exampleSnippet: '<!DOCTYPE html>\n<html lang="pl">\n<head>\n  <meta charset="UTF-8">\n  <title>Studio Kwiat</title>\n  <style>/* ... */</style>\n</head>',
    ctaLabel: "Zamów profesjonalną stronę od naszego zespołu",
    available: true,
  },

  // 22 — PDF / print export helper
  {
    id: "generator-umowy",
    name: "Generator umowy o dzieło",
    tagline: "Prosta umowa gotowa do podpisania",
    description: "Wypełnij dane — AI wygeneruje umowę o dzieło lub umowę zlecenia zgodną z polskim prawem, gotową do wydruku.",
    iconName: "FileSignature",
    category: "legal",
    fields: [
      { key: "typ_umowy", label: "Typ umowy", type: "select", options: [
        { value: "dzielo", label: "Umowa o dzieło" },
        { value: "zlecenie", label: "Umowa zlecenia" },
        { value: "b2b", label: "Umowa B2B / współpraca" },
      ], required: true },
      { key: "zamawiajacy", label: "Zamawiający (imię, firma, adres)", type: "textarea", placeholder: "np. Jan Kowalski, ul. Kwiatowa 1, 00-001 Warszawa", rows: 2, required: true },
      { key: "wykonawca", label: "Wykonawca (imię, firma, adres)", type: "textarea", placeholder: "np. Anna Nowak, Freelancer, NIP: 123-456-78-90", rows: 2, required: true },
      { key: "przedmiot", label: "Przedmiot umowy / zakres prac", type: "textarea", placeholder: "np. Zaprojektowanie i wykonanie strony internetowej dla sklepu odzieżowego", rows: 3, required: true },
      { key: "wynagrodzenie", label: "Wynagrodzenie brutto", type: "text", placeholder: "np. 3 000 zł brutto, płatne przelewem w ciągu 14 dni" },
      { key: "termin", label: "Termin wykonania", type: "text", placeholder: "np. do 30 lipca 2026" },
    ],
    systemPrompt: "Jesteś prawnikiem specjalizującym się w umowach cywilnoprawnych w Polsce. Generujesz profesjonalne, zgodne z Kodeksem Cywilnym umowy gotowe do podpisania. Stosujesz standardowy format: §1, §2 itd. Piszesz po polsku.",
    buildPrompt: (v_) => `Typ: ${v(v_, "typ_umowy", "dzielo")}
Zamawiający: ${v(v_, "zamawiajacy")}
Wykonawca: ${v(v_, "wykonawca")}
Przedmiot: ${v(v_, "przedmiot")}
Wynagrodzenie: ${v(v_, "wynagrodzenie", "do uzgodnienia")}
Termin: ${v(v_, "termin", "do uzgodnienia")}

Przygotuj kompletną umowę ${v(v_, "typ_umowy") === "dzielo" ? "o dzieło" : v(v_, "typ_umowy") === "zlecenie" ? "zlecenia" : "o współpracy B2B"} z następującymi paragrafami:

§1. STRONY UMOWY
§2. PRZEDMIOT UMOWY
§3. TERMIN WYKONANIA
§4. WYNAGRODZENIE I WARUNKI PŁATNOŚCI
§5. PRAWA AUTORSKIE / PRAWA DO EFEKTÓW PRACY
§6. ODPOWIEDZIALNOŚĆ STRON
§7. ROZWIĄZANIE UMOWY
§8. POSTANOWIENIA KOŃCOWE

Na końcu: miejsca na datę i podpisy obu stron.`,
    outputFormat: "sections",
    exampleSnippet: "UMOWA O DZIEŁO\nnr __/2026\n\n§1. STRONY UMOWY\nZamawiający: Jan Kowalski...",
    ctaLabel: "Skonsultuj umowę z prawnikiem",
    available: true,
  },
];

export function getToolById(id: string): AIToolDef | undefined {
  return AI_TOOLS.find((tool) => tool.id === id);
}

export const TOOL_CATEGORIES: Record<string, string> = {
  content: "Treści",
  identity: "Tożsamość marki",
  legal: "Dokumenty prawne",
  seo: "SEO i widoczność",
  social: "Social media",
  analysis: "Analiza i audyt",
  design: "Design",
  business: "Dokumenty biznesowe",
};
