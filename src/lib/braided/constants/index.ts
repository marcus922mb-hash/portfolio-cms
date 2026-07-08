export const PANEL_PATH = "/panel";
export const API_BASE = "/api";

export const PROJECT_STATUS_LABELS: Record<string, string> = {
  discovery: "Odkrywanie",
  design: "Projekt",
  build: "Budowa",
  review: "Przegląd",
  launch: "Start",
  support: "Wsparcie",
  closed: "Zamknięty",
};

export const CLIENT_STATUS_LABELS: Record<string, string> = {
  lead: "Lead",
  active: "Aktywny",
  completed: "Zakończony",
  archived: "Archiwum",
};

export const ESTIMATE_STATUS_LABELS: Record<string, string> = {
  draft: "Szkic",
  sent: "Wysłana",
  accepted: "Przyjęta",
  rejected: "Odrzucona",
  expired: "Wygasła",
};
