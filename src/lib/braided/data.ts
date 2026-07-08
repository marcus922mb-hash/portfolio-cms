import { BagIcon, GlobeIcon, LinkIcon, ToolsIcon } from "@/components/icons";
import { PUBLIC_PACKAGES, formatPriceFrom } from "@/config/public-offer";

export const navItems = [
  { href: "/oferta", label: "Oferta" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/narzedzia-ai", label: "Narzędzia AI" },
  { href: "/proces", label: "Proces" },
  { href: "/cennik", label: "Cennik" },
  { href: "/o-mnie", label: "O mnie" },
  { href: "/faq", label: "FAQ" },
];

export const services = [
  { icon: GlobeIcon, number: "01", title: "Strony internetowe", short: "Przemyślane witryny, które budują zaufanie i prowadzą klienta do kontaktu.", details: ["indywidualny projekt", "wersja mobilna", "podstawowe SEO", "wdrożenie i instrukcja"] },
  { icon: BagIcon, number: "02", title: "Sklepy online", short: "Estetyczne i wygodne sklepy, w których produkt gra pierwszą rolę.", details: ["konfiguracja sprzedaży", "płatności i dostawy", "karty produktów", "wsparcie po starcie"] },
  { icon: LinkIcon, number: "03", title: "Link w bio", short: "Mała strona o dużym znaczeniu: wszystkie ważne miejsca Twojej marki w jednym.", details: ["spójność z marką", "czytelne CTA", "szybkie wdrożenie", "własna domena"] },
  { icon: ToolsIcon, number: "04", title: "WordPress & WooCommerce", short: "Pomoc techniczna, poprawki i rozwój istniejącej strony bez zbędnego chaosu.", details: ["naprawy i aktualizacje", "nowe podstrony", "optymalizacja", "konsultacje 1:1"] },
];

export const processSteps = [
  { number: "01", title: "Poznajmy się", text: "Krótka rozmowa o Twojej marce, odbiorcach i celu projektu. Ustalamy, czego naprawdę potrzebujesz." },
  { number: "02", title: "Kierunek i plan", text: "Porządkuję zakres, strukturę i styl. Otrzymujesz jasną wycenę oraz harmonogram bez niedopowiedzeń." },
  { number: "03", title: "Projekt i budowa", text: "Tworzę kolejne elementy, pokazuję postępy i zbieram feedback w uporządkowanych rundach." },
  { number: "04", title: "Start i wsparcie", text: "Testuję stronę, pomagam z publikacją i pokazuję Ci, jak swobodnie korzystać z gotowego rozwiązania." },
];

export const pricing = PUBLIC_PACKAGES.map((item) => ({
  ...item,
  features: [...item.features],
  price: formatPriceFrom(item.priceFrom),
}));

export const faqs = [
  { q: "Ile trwa stworzenie strony?", a: "Najczęściej od 3 do 5 tygodni. Sklep internetowy zwykle wymaga 5-8 tygodni. Dokładny termin zależy od zakresu i sprawnego przekazania materiałów." },
  { q: "Czy muszę mieć gotowe teksty i zdjęcia?", a: "Nie musisz mieć wszystkiego na pierwszą rozmowę. Pomogę Ci ustalić, jakie materiały będą potrzebne, przygotuję strukturę treści i podpowiem, jak zaplanować zdjęcia." },
  { q: "Czy strona będzie działać na telefonie?", a: "Tak. Każdy projekt przygotowuję i testuję na telefonach, tabletach oraz komputerach. Mobilna wygoda jest częścią procesu, nie dodatkiem." },
  { q: "Czy będę samodzielnie edytować stronę?", a: "Tak, jeśli wybierzemy rozwiązanie z panelem zarządzania. Przy przekazaniu otrzymasz krótką instrukcję dopasowaną do Twojej strony." },
  { q: "Jak wygląda płatność?", a: "Standardowo dzielę płatność na etapy: zadatek rezerwujący termin i pozostałą kwotę przed publikacją. Przy większych projektach możliwy jest dodatkowy etap." },
  { q: "Czy pomagasz także z istniejącym WordPressem?", a: "Tak. Mogę poprawić wygląd, dodać funkcje, uporządkować WooCommerce, rozwiązać konkretny problem lub zaplanować dalszy rozwój." },
  { q: "Czy zapewniasz domenę i hosting?", a: "Pomogę je wybrać i skonfigurować. Usługi są kupowane bezpośrednio na Twoje dane, dzięki czemu zachowujesz pełną kontrolę nad projektem." },
];
