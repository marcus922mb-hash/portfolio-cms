export const PROJECT_STATUSES = [
  "discovery",
  "design",
  "build",
  "review",
  "launch",
  "support",
  "closed",
] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  discovery: "Discovery",
  design: "Design",
  build: "Build",
  review: "Review",
  launch: "Launch",
  support: "Support",
  closed: "Zamknięty",
};

export const PROJECT_STATUS_COLORS: Record<ProjectStatus, string> = {
  discovery: "#7b8fc9",
  design: "#c97bba",
  build: "#c9a46e",
  review: "#4c9fc9",
  launch: "#4caf7a",
  support: "#7bc97b",
  closed: "rgba(232,232,232,.25)",
};

export type Project = {
  id: string;
  created_at: string;
  updated_at: string;
  client_id: string | null;
  estimate_id: string | null;
  demo_id: string | null;
  name: string;
  status: ProjectStatus;
  start_date: string | null;
  deadline: string | null;
  technology: string | null;
  notes: string | null;
};

export type ProjectWithClient = Project & {
  client_first_name?: string | null;
  client_last_name?: string | null;
  client_company_name?: string | null;
};
