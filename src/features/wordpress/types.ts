export const WP_CONNECTION_STATUSES = ["draft", "connected", "error", "disabled"] as const;
export type WPConnectionStatus = (typeof WP_CONNECTION_STATUSES)[number];

export const WP_CONNECTION_STATUS_LABELS: Record<WPConnectionStatus, string> = {
  draft: "Szkic",
  connected: "Połączono",
  error: "Błąd",
  disabled: "Wyłączone",
};

export const WP_AUTH_TYPES = ["application_password", "none"] as const;
export type WPAuthType = (typeof WP_AUTH_TYPES)[number];

export const WP_AUTH_TYPE_LABELS: Record<WPAuthType, string> = {
  application_password: "Application Password",
  none: "Brak (tylko publiczne dane)",
};

export type WordPressConnection = {
  id: string;
  created_at: string;
  updated_at: string;
  client_id: string | null;
  name: string | null;
  site_url: string;
  api_base_url: string | null;
  auth_type: WPAuthType;
  username: string | null;
  // NEVER expose the encrypted value in UI — only used server-side for decryption
  application_password_encrypted: string | null;
  status: WPConnectionStatus;
  last_sync_at: string | null;
  notes: string | null;
  clients?: { first_name: string; last_name: string; company_name: string | null } | null;
};

export type WPConnectionActivity = {
  id: string;
  created_at: string;
  action: string;
  description: string | null;
};

export type WPClientOption = {
  id: string;
  label: string;
};

export function getWPConnectionLabel(connection: WordPressConnection): string {
  return connection.name || connection.site_url;
}

export function getWPClientLabel(
  client?: { first_name: string; last_name: string; company_name: string | null } | null
): string {
  if (!client) return "—";
  return client.company_name || [client.first_name, client.last_name].filter(Boolean).join(" ") || "—";
}
