"use client";

import { useState } from "react";
import Link from "next/link";
import { Arrow, CheckIcon } from "./icons";
import type {
  Budget,
  ContentStatus,
  EstimateResult,
  LeadFormData,
  ProjectType,
  Timeline,
} from "@/lib/types";
import { PUBLIC_PACKAGE_PRICES, formatPriceFrom } from "@/config/public-offer";

const STEPS = 5;

const DEFAULT_DATA: LeadFormData = {
  projectType: "website",
  hasDomain: false,
  hasHosting: false,
  contentStatus: "czesciowe",
  budget: "1000-2500",
  timeline: "1-miesiac",
  websitePages: "one-page",
  serviceCount: "1-3",
  hasBrandAssets: true,
  needsContactForm: true,
  needsAnalytics: false,
  needsBlog: false,
  needsBooking: false,
  needsMultilanguage: false,
  productCount: "1-10",
  productContentReady: true,
  shopCategoryCount: "1-3",
  needsVariants: false,
  needsPayments: true,
  needsShipping: true,
  needsInvoicing: false,
  needsMigration: false,
  needsCustomerAccounts: false,
  needsPromoCodes: false,
  landingSize: "standard",
  hasBrandAssetsLanding: true,
  needsCopywriting: false,
  needsAdsTracking: false,
  formComplexity: "simple",
  needsVideoSection: false,
  needsSocialProof: false,
  bioLinks: "1-5",
  needsGallery: false,
  needsNewsletter: false,
  needsBioProducts: false,
  needsCustomDomain: false,
  needsLinkAnalytics: false,
  wordpressTask: "small-fix",
  workHours: "1",
  isUrgentFix: false,
  hasAdminAccess: true,
  isLiveSite: true,
  hasPluginIssues: false,
  description: "",
  name: "",
  email: "",
  phone: "",
};

const PROJECTS: { id: ProjectType; title: string; price: string; text: string }[] = [
  { id: "website", title: "Strona internetowa", price: formatPriceFrom(PUBLIC_PACKAGE_PRICES["one-page"]), text: "One page lub serwis firmowy" },
  { id: "shop", title: "Sklep internetowy", price: formatPriceFrom(PUBLIC_PACKAGE_PRICES["mini-sklep-handmade"]), text: "Produkty, płatności i dostawa" },
  { id: "landing", title: "Landing page", price: formatPriceFrom(PUBLIC_PACKAGE_PRICES["cyfrowa-wizytowka"]), text: "Jedna kampania lub oferta" },
  { id: "bio", title: "Link w bio", price: formatPriceFrom(PUBLIC_PACKAGE_PRICES["link-w-bio"]), text: "Mobilna mini-strona marki" },
  { id: "wordpress", title: "WordPress / WooCommerce", price: "od 120 zł", text: "Poprawka, audyt lub rozwój" },
];

type Option<T extends string> = { id: T; title: string; text?: string };

function Progress({ step }: { step: number }) {
  return <div className="mb-10"><div className="flex items-center gap-2">{Array.from({ length: STEPS }).map((_,i)=><span key={i} className={`h-1 flex-1 transition ${i <= step ? "bg-brass" : "bg-ink/10"}`}/>)}</div><p className="mt-3 text-right text-[.58rem] font-bold uppercase tracking-widest text-ink/40">Krok {step + 1} z {STEPS}</p></div>;
}

function Choices<T extends string>({ options, value, onChange, columns = 2 }: {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  columns?: 2 | 3;
}) {
  return <div className={`grid gap-3 ${columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>{options.map(option=><button type="button" key={option.id} onClick={()=>onChange(option.id)} className={`relative min-h-24 border p-4 text-left transition ${value === option.id ? "border-brass bg-ink text-white" : "border-ink/12 bg-paper hover:border-brass/60"}`}><strong className="block font-serif text-xl font-medium">{option.title}</strong>{option.text && <span className={`mt-1 block text-xs leading-5 ${value === option.id ? "text-white/55" : "text-ink/50"}`}>{option.text}</span>}{value === option.id && <CheckIcon className="absolute right-3 top-3 size-4 text-brass-light"/>}</button>)}</div>;
}

function Toggle({ label, hint, value, onChange }: { label: string; hint: string; value: boolean; onChange: (value: boolean)=>void }) {
  return <button type="button" onClick={()=>onChange(!value)} className={`flex w-full items-center justify-between gap-5 border p-4 text-left transition ${value ? "border-brass bg-ink text-white" : "border-ink/12 bg-paper hover:border-brass/60"}`}><span><strong className="block text-sm">{label}</strong><small className={`mt-1 block leading-5 ${value ? "text-white/50" : "text-ink/50"}`}>{hint}</small></span><span className={`grid size-6 shrink-0 place-items-center rounded-full border ${value ? "border-brass bg-brass" : "border-ink/20"}`}>{value && <CheckIcon className="size-3 text-white"/>}</span></button>;
}

function SectionTitle({ eyebrow, children, text }: { eyebrow: string; children: React.ReactNode; text?: string }) {
  return <div className="mb-8"><p className="kicker">{eyebrow}</p><h2 className="mt-5 font-serif text-3xl leading-tight md:text-4xl">{children}</h2>{text && <p className="mt-3 max-w-xl text-sm leading-7 text-ink/55">{text}</p>}</div>;
}

export function EstimateForm() {
  const [step,setStep] = useState(0);
  const [data,setData] = useState<LeadFormData>(DEFAULT_DATA);
  const [submitting,setSubmitting] = useState(false);
  const [error,setError] = useState("");
  const [result,setResult] = useState<EstimateResult | null>(null);

  const set = <K extends keyof LeadFormData>(key: K, value: LeadFormData[K]) => setData(current=>({...current,[key]:value}));

  async function submit() {
    setSubmitting(true); setError("");
    try {
      const response = await fetch("/api/lead",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
      const json = await response.json() as {success:boolean;estimate?:EstimateResult;error?:string};
      if (!response.ok || !json.success || !json.estimate) throw new Error(json.error || "Nie udało się obliczyć wyceny.");
      setResult(json.estimate);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Nie udało się obliczyć wyceny.");
    } finally { setSubmitting(false); }
  }

  if (result) return <ResultCard estimate={result} data={data} onReset={()=>{setResult(null);setStep(0);}}/>;

  return <div className="mx-auto max-w-3xl">
    <Progress step={step}/>

    {step === 0 && <div>
      <SectionTitle eyebrow="Rodzaj projektu" text="Po tym wyborze formularz pokaże pytania przygotowane tylko dla danego zakresu.">Co mam dla Ciebie przygotować?</SectionTitle>
      <div className="grid gap-3 sm:grid-cols-2">{PROJECTS.map(project=><button type="button" key={project.id} onClick={()=>set("projectType",project.id)} className={`relative border p-5 text-left transition ${data.projectType === project.id ? "border-brass bg-ink text-white" : "border-ink/12 bg-paper hover:border-brass/60"}`}><span className={`text-[.58rem] font-bold uppercase tracking-widest ${data.projectType === project.id ? "text-brass-light" : "text-brass"}`}>{project.price}</span><strong className="mt-5 block font-serif text-2xl font-medium">{project.title}</strong><span className={`mt-2 block text-xs ${data.projectType === project.id ? "text-white/50" : "text-ink/50"}`}>{project.text}</span>{data.projectType === project.id && <CheckIcon className="absolute right-4 top-4 size-5 text-brass-light"/>}</button>)}</div>
    </div>}

    {step === 1 && <ProjectScope data={data} set={set}/>}
    {step === 2 && <ProjectFeatures data={data} set={set}/>}

    {step === 3 && <div>
      <SectionTitle eyebrow="Materiały, termin i budżet" text="Budżet nie zmienia wyniku. Służy wyłącznie do sprawdzenia, czy wybrany zakres jest realny.">Warunki realizacji.</SectionTitle>
      {data.projectType !== "wordpress" && <div className="space-y-7">
        <div><p className="mb-3 text-sm font-semibold">Na jakim etapie są teksty i zdjęcia?</p><Choices value={data.contentStatus} onChange={(v)=>set("contentStatus",v)} options={[
          {id:"gotowe",title:"Gotowe",text:"Materiały są przygotowane"},
          {id:"czesciowe",title:"Częściowe",text:"Potrzebują uporządkowania"},
          {id:"brak",title:"Jeszcze ich nie mam",text:"Potrzebuję wsparcia"},
        ] as Option<ContentStatus>[]} columns={3}/></div>
        <div className="grid gap-3 sm:grid-cols-2"><Toggle label="Mam domenę" hint="Adres jest już kupiony" value={data.hasDomain} onChange={(v)=>set("hasDomain",v)}/><Toggle label="Mam hosting" hint="Serwer lub Vercel są skonfigurowane" value={data.hasHosting} onChange={(v)=>set("hasHosting",v)}/></div>
      </div>}
      <div className="mt-7 grid gap-7 md:grid-cols-2">
        <div><p className="mb-3 text-sm font-semibold">Orientacyjny budżet</p><Choices value={data.budget} onChange={(v)=>set("budget",v)} options={[
          {id:"do-1000",title:"do 1000 zł"},{id:"1000-2500",title:"1000–2500 zł"},{id:"2500-5000",title:"2500–5000 zł"},{id:"5000+",title:"powyżej 5000 zł"},
        ] as Option<Budget>[]}/></div>
        <div><p className="mb-3 text-sm font-semibold">Kiedy chcesz wystartować?</p><Choices value={data.timeline} onChange={(v)=>set("timeline",v)} options={[
          {id:"asap",title:"Pilnie",text:"dopłata 20–25%"},{id:"1-miesiac",title:"W ciągu miesiąca"},{id:"2-3-miesiace",title:"Za 2–3 miesiące"},{id:"bez-presji",title:"Bez presji"},
        ] as Option<Timeline>[]}/></div>
      </div>
    </div>}

    {step === 4 && <div>
      <SectionTitle eyebrow="Podsumowanie" text="Dane kontaktowe są opcjonalne. Wynik zobaczysz od razu na stronie.">Opowiedz krótko o projekcie.</SectionTitle>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Imię / marka" value={data.name} onChange={(v)=>set("name",v)} placeholder="Marek / Moja Pracownia"/>
        <Field label="E-mail" value={data.email} onChange={(v)=>set("email",v)} placeholder="kontakt@marka.pl" type="email"/>
        <Field label="Telefon / WhatsApp" value={data.phone} onChange={(v)=>set("phone",v)} placeholder="+48..." type="tel"/>
      </div>
      <label className="mt-4 block"><span className="mb-2 block text-[.62rem] font-bold uppercase tracking-widest">Najważniejsze informacje</span><textarea rows={5} value={data.description} onChange={(e)=>set("description",e.target.value)} placeholder={descriptionPlaceholder(data.projectType)} className="w-full resize-y border border-ink/15 bg-white px-4 py-3 text-ink outline-none transition focus:border-brass"/></label>
    </div>}

    {error && <p className="mt-5 border border-red-300 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
    <div className="mt-9 flex gap-3">
      {step > 0 && <button type="button" className="btn-secondary" onClick={()=>setStep(s=>s-1)}>← Wstecz</button>}
      <button type="button" disabled={submitting} className="btn-primary flex-1 disabled:opacity-50" onClick={()=>step < STEPS-1 ? setStep(s=>s+1) : void submit()}>{submitting ? "Obliczam..." : step === STEPS-1 ? "Pokaż realną wycenę →" : "Dalej →"}</button>
    </div>
  </div>;
}

function ProjectScope({data,set}:{data:LeadFormData;set:<K extends keyof LeadFormData>(key:K,value:LeadFormData[K])=>void}) {
  if (data.projectType === "website") return <div>
    <SectionTitle eyebrow="Zakres strony">Jak duża ma być strona?</SectionTitle>
    <div className="space-y-7">
      <Choices value={data.websitePages} onChange={(v)=>set("websitePages",v)} options={[{id:"one-page",title:"One page",text:"Wszystko na jednej stronie"},{id:"2-5",title:"2–5 podstron",text:"Typowa strona firmowa"},{id:"6-10",title:"6–10 podstron",text:"Szersza oferta i treści"}]}/>
      <div><p className="mb-3 text-sm font-semibold">Ile usług lub głównych pozycji oferty?</p><Choices value={data.serviceCount} onChange={(v)=>set("serviceCount",v)} options={[{id:"1-3",title:"1–3"},{id:"4-8",title:"4–8"},{id:"9+",title:"9 lub więcej"}]} columns={3}/></div>
      <Toggle label="Mam gotowe logo i kolory marki" hint="Palleta barw, krój pisma, ewentualnie gotowe pliki graficzne" value={data.hasBrandAssets} onChange={(v)=>set("hasBrandAssets",v)}/>
    </div>
  </div>;

  if (data.projectType === "shop") return <div>
    <SectionTitle eyebrow="Asortyment" text="Liczba produktów i gotowość materiałów mają największy wpływ na pracochłonność sklepu.">Jak wygląda Twoja oferta?</SectionTitle>
    <div className="space-y-7">
      <Choices value={data.productCount} onChange={(v)=>set("productCount",v)} options={[{id:"1-10",title:"1–10 produktów",text:"Mała kolekcja handmade"},{id:"11-30",title:"11–30 produktów"},{id:"31-100",title:"31–100 produktów"},{id:"100+",title:"Ponad 100",text:"Wymaga szerszego planu"}]}/>
      <div><p className="mb-3 text-sm font-semibold">Ile kategorii będzie miał sklep?</p><Choices value={data.shopCategoryCount} onChange={(v)=>set("shopCategoryCount",v)} options={[{id:"1-3",title:"1–3",text:"Np. jeden rodzaj wyrobów"},{id:"4-8",title:"4–8",text:"Kilka grup asortymentu"},{id:"9+",title:"9 lub więcej",text:"Rozbudowana struktura"}]} columns={3}/></div>
      <Toggle label="Mam gotowe zdjęcia, opisy i ceny produktów" hint="Materiały można od razu wprowadzać do sklepu" value={data.productContentReady} onChange={(v)=>set("productContentReady",v)}/>
    </div>
  </div>;

  if (data.projectType === "landing") return <div>
    <SectionTitle eyebrow="Wielkość landing page">Jak rozbudowana ma być prezentacja?</SectionTitle>
    <div className="space-y-7">
      <Choices value={data.landingSize} onChange={(v)=>set("landingSize",v)} options={[{id:"single-screen",title:"Jeden ekran",text:"Kontakt i najważniejsza informacja"},{id:"standard",title:"4–6 sekcji",text:"Oferta, korzyści, FAQ i kontakt"},{id:"sales",title:"Strona sprzedażowa",text:"Pełna narracja i wiele CTA"}]} columns={3}/>
      <Toggle label="Mam gotowe logo i materiały wizualne" hint="Kolory, krój pisma — nie muszę tego przygotowywać od zera" value={data.hasBrandAssetsLanding} onChange={(v)=>set("hasBrandAssetsLanding",v)}/>
    </div>
  </div>;

  if (data.projectType === "bio") return <div>
    <SectionTitle eyebrow="Zawartość linku w bio">Ile miejsc ma łączyć?</SectionTitle>
    <div className="space-y-7">
      <Choices value={data.bioLinks} onChange={(v)=>set("bioLinks",v)} options={[{id:"1-5",title:"1–5 linków",text:"Prosty zestaw"},{id:"6-10",title:"6–10 linków",text:"Kilka obszarów marki"},{id:"10+",title:"Ponad 10",text:"Linki i dodatkowe sekcje"}]} columns={3}/>
    </div>
  </div>;

  return <div>
    <SectionTitle eyebrow="Rodzaj pomocy" text="Wycena prac technicznych jest oparta na przewidywanym czasie. Po uzyskaniu dostępu potwierdzę zakres przed rozpoczęciem.">Co trzeba zrobić?</SectionTitle>
    <div className="space-y-7">
      <Choices value={data.wordpressTask} onChange={(v)=>set("wordpressTask",v)} options={[{id:"small-fix",title:"Drobna poprawka",text:"Błąd, tekst, formularz"},{id:"visual",title:"Wygląd / mobile",text:"CSS, układ, responsywność"},{id:"new-page",title:"Nowa sekcja lub strona"},{id:"woocommerce",title:"WooCommerce",text:"Koszyk, produkty, płatności"},{id:"audit",title:"Audyt",text:"Lista problemów i plan"}]}/>
      <div className="grid gap-3 sm:grid-cols-2">
        <Toggle label="Strona jest aktualnie live" hint="Działa w produkcji i obsługuje ruch" value={data.isLiveSite} onChange={(v)=>set("isLiveSite",v)}/>
        <Toggle label="Mam dostęp administratora" hint="Mogę przekazać dane do panelu WordPress" value={data.hasAdminAccess} onChange={(v)=>set("hasAdminAccess",v)}/>
      </div>
    </div>
  </div>;
}

function ProjectFeatures({data,set}:{data:LeadFormData;set:<K extends keyof LeadFormData>(key:K,value:LeadFormData[K])=>void}) {
  if (data.projectType === "website") return <div>
    <SectionTitle eyebrow="Funkcje strony">Czego potrzebujesz poza podstawą?</SectionTitle>
    <div className="space-y-3">
      <Toggle label="Formularz kontaktowy lub zapytanie ofertowe" hint="Wiadomość przychodzi na e-mail lub do panelu" value={data.needsContactForm} onChange={(v)=>set("needsContactForm",v)}/>
      <Toggle label="Blog lub aktualności" hint="Samodzielne publikowanie wpisów bez dewelopera" value={data.needsBlog} onChange={(v)=>set("needsBlog",v)}/>
      <Toggle label="Rezerwacje lub kalendarz online" hint="Terminy wizyt, konsultacji albo usług" value={data.needsBooking} onChange={(v)=>set("needsBooking",v)}/>
      <Toggle label="Druga wersja językowa" hint="Osobny zestaw przetłumaczonych treści" value={data.needsMultilanguage} onChange={(v)=>set("needsMultilanguage",v)}/>
      <Toggle label="Analityka i baner zgody na cookies" hint="Google Analytics 4 lub Matomo + RODO-zgodna zgoda" value={data.needsAnalytics} onChange={(v)=>set("needsAnalytics",v)}/>
    </div>
  </div>;

  if (data.projectType === "shop") return <div>
    <SectionTitle eyebrow="Funkcje sklepu">Jak ma działać sprzedaż?</SectionTitle>
    <div className="grid gap-3 sm:grid-cols-2">
      <Toggle label="Warianty produktów" hint="Np. rozmiar, kolor, materiał" value={data.needsVariants} onChange={(v)=>set("needsVariants",v)}/>
      <Toggle label="Płatności online" hint="Przelewy24, Stripe lub podobne" value={data.needsPayments} onChange={(v)=>set("needsPayments",v)}/>
      <Toggle label="Kurierzy i paczkomaty" hint="Metody dostawy i progi cenowe" value={data.needsShipping} onChange={(v)=>set("needsShipping",v)}/>
      <Toggle label="Konta klientów" hint="Rejestracja, logowanie, historia zamówień" value={data.needsCustomerAccounts} onChange={(v)=>set("needsCustomerAccounts",v)}/>
      <Toggle label="Kupony i rabaty" hint="Kody promocyjne i reguły cenowe" value={data.needsPromoCodes} onChange={(v)=>set("needsPromoCodes",v)}/>
      <Toggle label="Program do faktur" hint="Automatyczne przekazywanie zamówień" value={data.needsInvoicing} onChange={(v)=>set("needsInvoicing",v)}/>
      <Toggle label="Migracja ze starego sklepu" hint="Produkty, klienci lub zamówienia" value={data.needsMigration} onChange={(v)=>set("needsMigration",v)}/>
    </div>
  </div>;

  if (data.projectType === "landing") return <div>
    <SectionTitle eyebrow="Treść i konwersja">Co ma robić landing page?</SectionTitle>
    <div className="space-y-5">
      <Toggle label="Potrzebuję opracowania tekstów" hint="Struktura i treść sprzedażowa od podstaw" value={data.needsCopywriting} onChange={(v)=>set("needsCopywriting",v)}/>
      <Toggle label="Sekcja wideo" hint="Tło wideo, osadzony film lub wideo-nagłówek" value={data.needsVideoSection} onChange={(v)=>set("needsVideoSection",v)}/>
      <Toggle label="Opinie klientów lub logotypy firm" hint="Social proof budujący zaufanie do oferty" value={data.needsSocialProof} onChange={(v)=>set("needsSocialProof",v)}/>
      <Toggle label="Śledzenie kampanii reklamowej" hint="Piksel Meta, Google Ads, analityka zdarzeń i konwersji" value={data.needsAdsTracking} onChange={(v)=>set("needsAdsTracking",v)}/>
      <div><p className="mb-3 text-sm font-semibold">Formularz kontaktowy</p><Choices value={data.formComplexity} onChange={(v)=>set("formComplexity",v)} options={[{id:"none",title:"Bez formularza",text:"Link, telefon lub zewnętrzny"},{id:"simple",title:"Prosty kontakt",text:"Imię, e-mail, wiadomość"},{id:"advanced",title:"Brief / więcej pól",text:"Pytania kwalifikujące"}]} columns={3}/></div>
    </div>
  </div>;

  if (data.projectType === "bio") return <div>
    <SectionTitle eyebrow="Dodatkowe sekcje">Co ma znaleźć się poza linkami?</SectionTitle>
    <div className="space-y-3">
      <Toggle label="Galeria lub portfolio" hint="Zdjęcia, realizacje albo wyróżnione treści" value={data.needsGallery} onChange={(v)=>set("needsGallery",v)}/>
      <Toggle label="Zapis do newslettera" hint="Integracja z narzędziem mailingowym" value={data.needsNewsletter} onChange={(v)=>set("needsNewsletter",v)}/>
      <Toggle label="Produkty lub kolekcja" hint="Karty prowadzące do sklepu lub zamówienia" value={data.needsBioProducts} onChange={(v)=>set("needsBioProducts",v)}/>
      <Toggle label="Własna domena (np. linki.mojamarka.pl)" hint="Zamiast domyślnego adresu Braided Digital" value={data.needsCustomDomain} onChange={(v)=>set("needsCustomDomain",v)}/>
      <Toggle label="Analityka kliknięć" hint="Statystyki które linki klikają odwiedzający" value={data.needsLinkAnalytics} onChange={(v)=>set("needsLinkAnalytics",v)}/>
    </div>
  </div>;

  return <div>
    <SectionTitle eyebrow="Zakres i środowisko" text="To wstępna ocena. Ukryte problemy w motywie lub wtyczkach mogą zmienić zakres dopiero po audycie.">Jak duże jest zadanie?</SectionTitle>
    <div className="space-y-7">
      <Choices value={data.workHours} onChange={(v)=>set("workHours",v)} options={[{id:"1",title:"Około 1 godziny"},{id:"2-3",title:"2–3 godziny"},{id:"4-6",title:"4–6 godzin"},{id:"7+",title:"Większy zakres"}]}/>
      <div className="grid gap-3 sm:grid-cols-2">
        <Toggle label="Są widoczne błędy lub konflikty wtyczek" hint="Komunikaty PHP, biały ekran, niespójna funkcja" value={data.hasPluginIssues} onChange={(v)=>set("hasPluginIssues",v)}/>
        <Toggle label="To awaria wymagająca pilnej reakcji" hint="Tryb pilny zależy od dostępności terminu" value={data.isUrgentFix} onChange={(v)=>set("isUrgentFix",v)}/>
      </div>
    </div>
  </div>;
}

function Field({label,value,onChange,placeholder,type="text"}:{label:string;value:string;onChange:(value:string)=>void;placeholder:string;type?:string}) {
  return <label className="block"><span className="mb-2 block text-[.62rem] font-bold uppercase tracking-widest">{label}</span><input type={type} value={value} onChange={(e)=>onChange(e.target.value)} placeholder={placeholder} className="w-full border border-ink/15 bg-white px-4 py-3 text-ink outline-none transition focus:border-brass"/></label>;
}

function descriptionPlaceholder(type: ProjectType) {
  if (type === "shop") return "Co sprzedajesz? Czy masz już sklep, regulamin, zdjęcia i wybranego operatora płatności?";
  if (type === "wordpress") return "Podaj adres strony, opisz problem i napisz, od kiedy występuje.";
  if (type === "landing") return "Jaki produkt lub usługę promujesz i skąd będzie kierowany ruch?";
  if (type === "bio") return "Jakie linki i treści mają znaleźć się na stronie?";
  return "Czym zajmuje się firma, kto jest klientem i jaki jest główny cel strony?";
}

function ResultCard({estimate,data,onReset}:{estimate:EstimateResult;data:LeadFormData;onReset:()=>void}) {
  const budgetText = estimate.budgetFit === "within" ? "Wybrany budżet obejmuje ten zakres." : estimate.budgetFit === "close" ? "Budżet jest blisko wyceny. Zakres doprecyzujemy podczas rozmowy." : "Wybrany zakres przekracza budżet. Mogę zaproponować mniejszy pierwszy etap.";
  const waText = encodeURIComponent(`Cześć! Uzupełniłem kalkulator Braided Digital.\nProjekt: ${estimate.projectTypeLabel}\nWycena: ${estimate.minPrice}–${estimate.maxPrice} zł\nZakres: ${estimate.features.join(", ")}${data.description ? `\nOpis: ${data.description}` : ""}`);
  return <div>
    <div className="bg-ink px-6 py-12 text-center text-white md:px-10"><p className="kicker kicker-light mx-auto w-fit">Orientacyjna, szczegółowa wycena</p><div className="mt-6 font-serif text-[clamp(2.6rem,7vw,5rem)] leading-none text-brass-light">{estimate.minPrice.toLocaleString("pl-PL")}–{estimate.maxPrice.toLocaleString("pl-PL")} zł</div><p className="mt-4 text-sm text-white/55">Realizacja: {estimate.timelineLabel}</p></div>
    <div className="border-x border-b border-ink/12 bg-paper p-6 md:p-9">
      <div className={`border p-4 text-sm ${estimate.budgetFit === "below" ? "border-rust/40 bg-rust/5 text-rust" : "border-brass/30 bg-brass/5 text-ink/70"}`}>{budgetText}</div>
      <h2 className="mt-8 font-serif text-3xl">{estimate.projectTypeLabel}</h2>
      <div className="mt-6 overflow-hidden border border-ink/12">
        {estimate.breakdown.map((item,index)=><div key={`${item.label}-${index}`} className="grid grid-cols-[1fr_auto] gap-5 border-b border-ink/10 p-4 last:border-b-0"><span className="text-sm text-ink/65">{item.label}</span><strong className="text-sm text-brass">{item.min === item.max ? `${item.min.toLocaleString("pl-PL")} zł` : `${item.min.toLocaleString("pl-PL")}–${item.max.toLocaleString("pl-PL")} zł`}</strong></div>)}
      </div>
      <p className="mt-6 text-xs leading-6 text-ink/45">Koszty domeny, hostingu, płatnych licencji oraz prowizje operatorów płatności nie są wliczone, chyba że dana pozycja wskazuje inaczej. Ostateczna cena powstaje po sprawdzeniu materiałów i środowiska technicznego.</p>
    </div>
    <div className="mt-5 grid gap-3 sm:grid-cols-2"><a href={`https://wa.me/48730195530?text=${waText}`} target="_blank" rel="noreferrer" className="btn-primary">Omów wynik na WhatsApp <Arrow/></a><Link href="/kontakt" className="btn-secondary">Wyślij zapytanie <Arrow/></Link></div>
    <button type="button" onClick={onReset} className="mt-5 w-full py-3 text-xs text-ink/45 hover:text-ink">← Policz inny wariant</button>
  </div>;
}
