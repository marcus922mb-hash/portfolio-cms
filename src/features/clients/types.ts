import type { Json } from "@/types/database";

export const CLIENT_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "demo_prepared",
  "demo_sent",
  "accepted",
  "rejected",
  "inactive",
] as const;

export type ClientStatus = (typeof CLIENT_STATUSES)[number];

export const CLIENT_STATUS_LABELS: Record<ClientStatus, string> = {
  new: "Nowy",
  contacted: "Skontaktowany",
  qualified: "Zakwalifikowany",
  demo_prepared: "Demo przygotowane",
  demo_sent: "Demo wysłane",
  accepted: "Zaakceptowany",
  rejected: "Odrzucony",
  inactive: "Nieaktywny",
};

export type SocialLinks = {
  linkedin?: string | null;
  facebook?: string | null;
  instagram?: string | null;
};

export type Client = {
  id: string;
  created_at: string;
  updated_at: string;
  first_name: string;
  last_name: string;
  company_name: string | null;
  email: string | null;
  phone: string | null;
  industry: string | null;
  city: string | null;
  website_url: string | null;
  social_links: Json | null;
  notes: string | null;
  status: ClientStatus;
};

export type ClientNote = {
  id: string;
  created_at: string;
  client_id: string | null;
  content: string;
  created_by: string | null;
};

export type ClientActivity = {
  id: string;
  created_at: string;
  entity_type: string;
  entity_id: string | null;
  action: string;
  description: string | null;
  metadata: Json | null;
};

export type ClientFormValues = {
  first_name: string;
  last_name: string;
  company_name: string;
  email: string;
  phone: string;
  industry: string;
  city: string;
  website_url: string;
  social_linkedin: string;
  social_facebook: string;
  social_instagram: string;
  notes: string;
  status: ClientStatus;
};

export function parseSocialLinks(json: Json | null): SocialLinks {
  if (!json || typeof json !== "object" || Array.isArray(json)) return {};
  const obj = json as Record<string, unknown>;
  return {
    linkedin: typeof obj.linkedin === "string" ? obj.linkedin : null,
    facebook: typeof obj.facebook === "string" ? obj.facebook : null,
    instagram: typeof obj.instagram === "string" ? obj.instagram : null,
  };
}

export function getClientDisplayName(client: Pick<Client, "first_name" | "last_name" | "company_name">): string {
  const name = [client.first_name, client.last_name].filter(Boolean).join(" ");
  return name || client.company_name || "—";
}

export function getClientInitials(client: Pick<Client, "first_name" | "last_name" | "company_name">): string {
  if (client.first_name || client.last_name) {
    return [(client.first_name ?? "").charAt(0), (client.last_name ?? "").charAt(0)]
      .filter(Boolean)
      .join("")
      .toUpperCase();
  }
  return (client.company_name ?? "?").charAt(0).toUpperCase();
}
