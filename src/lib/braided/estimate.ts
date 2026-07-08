import type {
  Budget,
  EstimateBreakdownItem,
  EstimateResult,
  LeadFormData,
  ProjectType,
} from "./types";
import { PUBLIC_PACKAGE_PRICES } from "@/config/public-offer";

export const PROJECT_LABELS: Record<ProjectType, string> = {
  website: "Strona internetowa",
  shop: "Sklep internetowy",
  landing: "Landing page",
  bio: "Link w bio",
  wordpress: "WordPress / WooCommerce",
};

const BUDGET_MAX: Record<Budget, number> = {
  "do-1000": 1000,
  "1000-2500": 2500,
  "2500-5000": 5000,
  "5000+": Number.POSITIVE_INFINITY,
};

export function calculateEstimate(data: LeadFormData): EstimateResult {
  const breakdown: EstimateBreakdownItem[] = [];
  const features: string[] = [];

  const add = (label: string, min: number, max = min) => {
    breakdown.push({ label, min, max });
    features.push(label);
  };

  if (data.projectType === "website") {
    if (data.websitePages === "one-page") add("projekt i wdrożenie strony one page", PUBLIC_PACKAGE_PRICES["one-page"], 890);
    if (data.websitePages === "2-5") add("strona firmowa do 5 podstron", PUBLIC_PACKAGE_PRICES["strona-firmowa"], 1790);
    if (data.websitePages === "6-10") add("rozbudowana strona 6–10 podstron", 1990, 2690);
    if (data.serviceCount === "4-8") add("rozbudowana prezentacja usług", 120, 220);
    if (data.serviceCount === "9+") add("katalog wielu usług", 250, 450);
    if (!data.hasBrandAssets) add("podstawowa identyfikacja wizualna (logo, kolory, typografia)", 250, 490);
    if (data.needsContactForm) add("formularz kontaktowy", 60, 120);
    if (data.needsAnalytics) add("konfiguracja analityki i baner cookie", 80, 150);
    if (data.needsBlog) add("blog / aktualności z panelem", 250, 450);
    if (data.needsBooking) add("rezerwacje lub kalendarz", 250, 490);
    if (data.needsMultilanguage) add("druga wersja językowa", 390, 690);
  }

  if (data.projectType === "shop") {
    if (data.productCount === "1-10") add("mini sklep do 10 produktów", PUBLIC_PACKAGE_PRICES["mini-sklep-handmade"], 2290);
    if (data.productCount === "11-30") add("sklep do 30 produktów", PUBLIC_PACKAGE_PRICES["sklep-online"], 3590);
    if (data.productCount === "31-100") add("sklep 31–100 produktów", 3590, 5190);
    if (data.productCount === "100+") add("rozbudowany sklep 100+ produktów", 4990, 6990);
    if (!data.productContentReady) add("przygotowanie i wprowadzenie produktów", 200, data.productCount === "100+" ? 1200 : 600);
    if (data.shopCategoryCount === "4-8") add("struktura kategorii i nawigacja (4–8 kategorii)", 120, 250);
    if (data.shopCategoryCount === "9+") add("rozbudowana struktura kategorii (9+)", 250, 490);
    if (data.needsVariants) add("warianty produktów", 180, 350);
    if (data.needsPayments) add("konfiguracja płatności", 150, 270);
    if (data.needsShipping) add("metody dostawy i kurierzy", 150, 300);
    if (data.needsInvoicing) add("integracja fakturowania", 180, 380);
    if (data.needsMigration) add("migracja produktów lub zamówień", 390, 1100);
    if (data.needsCustomerAccounts) add("konta klientów i historia zamówień", 180, 380);
    if (data.needsPromoCodes) add("kupony i reguły rabatowe", 100, 220);
  }

  if (data.projectType === "landing") {
    if (data.landingSize === "single-screen") add("cyfrowa wizytówka / pojedynczy ekran", PUBLIC_PACKAGE_PRICES["cyfrowa-wizytowka"], 390);
    if (data.landingSize === "standard") add("landing page 4–6 sekcji", PUBLIC_PACKAGE_PRICES["one-page"], 890);
    if (data.landingSize === "sales") add("rozbudowany landing sprzedażowy", 790, 1290);
    if (!data.hasBrandAssetsLanding) add("przygotowanie materiałów wizualnych (kolory, typografia)", 150, 350);
    if (data.needsCopywriting) add("opracowanie treści sprzedażowej", 200, 450);
    if (data.needsAdsTracking) add("analityka kampanii i zdarzeń", 130, 280);
    if (data.formComplexity === "simple") add("formularz kontaktowy", 70, 140);
    if (data.formComplexity === "advanced") add("rozbudowany formularz / brief", 180, 390);
    if (data.needsVideoSection) add("sekcja wideo lub tło wideo", 120, 280);
    if (data.needsSocialProof) add("sekcja opinii i logotypów klientów", 70, 160);
  }

  if (data.projectType === "bio") {
    add("indywidualna strona link w bio", PUBLIC_PACKAGE_PRICES["link-w-bio"], 490);
    if (data.bioLinks === "6-10") add("rozszerzony układ 6–10 linków", 60, 120);
    if (data.bioLinks === "10+") add("ponad 10 linków i sekcji", 120, 220);
    if (data.needsGallery) add("galeria lub wyróżnione realizacje", 90, 180);
    if (data.needsNewsletter) add("zapis do newslettera", 90, 200);
    if (data.needsBioProducts) add("sekcja produktów lub kolekcji", 100, 240);
    if (data.needsCustomDomain) add("podpięcie własnej domeny", 40, 80);
    if (data.needsLinkAnalytics) add("analityka kliknięć w linki", 60, 120);
  }

  if (data.projectType === "wordpress") {
    const hourly: Record<LeadFormData["workHours"], [number, number]> = {
      "1": [90, 120],
      "2-3": [180, 360],
      "4-6": [340, 620],
      "7+": [600, 1100],
    };
    const taskLabels: Record<LeadFormData["wordpressTask"], string> = {
      "small-fix": "drobna poprawka techniczna",
      visual: "poprawki wyglądu i wersji mobilnej",
      "new-page": "nowa sekcja lub podstrona",
      woocommerce: "prace przy WooCommerce",
      audit: "audyt i plan naprawy",
    };
    const [min, max] = hourly[data.workHours];
    add(taskLabels[data.wordpressTask], min, max);
    if (data.wordpressTask === "woocommerce") add("diagnostyka środowiska sklepu", 80, 190);
    if (data.wordpressTask === "new-page") add("dopasowanie do istniejącego motywu", 80, 200);
    if (data.hasPluginIssues) add("diagnostyka konfliktów wtyczek lub motywu", 150, 400);
    if (data.isLiveSite && data.wordpressTask !== "audit") add("zabezpieczenie backupu przed pracami", 40, 80);
  }

  if (data.projectType !== "wordpress") {
    if (!data.hasDomain) add("pomoc w rejestracji i podpięciu domeny", 40, 80);
    if (!data.hasHosting) add("konfiguracja hostingu lub Vercel", 80, 160);
    const landingCopyIncluded = data.projectType === "landing" && data.needsCopywriting;
    if (!landingCopyIncluded && data.contentStatus === "czesciowe") add("uporządkowanie dostarczonych treści", 100, 220);
    if (!landingCopyIncluded && data.contentStatus === "brak") add("wsparcie w przygotowaniu treści", 220, 490);
  }

  let min = breakdown.reduce((sum, item) => sum + item.min, 0);
  let max = breakdown.reduce((sum, item) => sum + item.max, 0);

  const urgent = data.timeline === "asap" || (data.projectType === "wordpress" && data.isUrgentFix);
  if (urgent) {
    const surchargeMin = Math.round(min * 0.2 / 10) * 10;
    const surchargeMax = Math.round(max * 0.25 / 10) * 10;
    breakdown.push({ label: "tryb pilny, jeśli termin będzie dostępny", min: surchargeMin, max: surchargeMax });
    features.push("tryb pilny");
    min += surchargeMin;
    max += surchargeMax;
  }

  min = Math.round(min / 10) * 10;
  max = Math.round(max / 10) * 10;

  return {
    minPrice: min,
    maxPrice: max,
    timelineLabel: getTimeline(data, max),
    projectTypeLabel: PROJECT_LABELS[data.projectType],
    features,
    breakdown,
    budgetFit: getBudgetFit(data.budget, min, max),
    briefSummary: buildBrief(data, features),
  };
}

function getTimeline(data: LeadFormData, max: number): string {
  if (data.projectType === "wordpress") {
    if (data.workHours === "1") return "1–3 dni robocze";
    if (data.workHours === "2-3") return "3–7 dni roboczych";
    return "1–2 tygodnie";
  }
  if (data.projectType === "bio") return "5–7 dni roboczych";
  if (data.projectType === "landing") return data.landingSize === "sales" ? "2–3 tygodnie" : "5–10 dni roboczych";
  if (data.projectType === "shop") return max > 6000 ? "6–10 tygodni" : "3–6 tygodni";
  return max > 2800 ? "3–5 tygodni" : "1–3 tygodnie";
}

function getBudgetFit(budget: Budget, min: number, max: number): EstimateResult["budgetFit"] {
  const budgetMax = BUDGET_MAX[budget];
  if (!Number.isFinite(budgetMax)) return "within";
  if (max <= budgetMax) return "within";
  if (min <= budgetMax) return "close";
  if (min <= budgetMax * 1.2) return "close";
  return "below";
}

function buildBrief(data: LeadFormData, features: string[]): string {
  const parts = [`Projekt: ${PROJECT_LABELS[data.projectType]}`, `Zakres: ${features.join(", ")}`];
  if (data.projectType === "wordpress" && !data.hasAdminAccess) parts.push("Dostęp administratora wymaga ustalenia");
  if (data.description.trim()) parts.push(`Opis: ${data.description.trim()}`);
  return parts.join(" · ");
}
