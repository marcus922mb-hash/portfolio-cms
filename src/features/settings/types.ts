export type PanelUserProfile = {
  fullName: string;
  companyName: string;
  phone: string;
  email: string;
  role: string;
  initials: string;
  createdAt: string;
  lastSignInAt: string;
};

export type PanelPreferences = {
  language: "pl" | "en";
  timezone: string;
  defaultBuilderDevice: "desktop" | "tablet" | "mobile";
  reducedMotion: boolean;
  emailNotifications: boolean;
  demoNotifications: boolean;
  weeklySummary: boolean;
};

export type AISettings = {
  preferredProvider: "openrouter" | "cloudflare";
  preferredModel: string;
};

export type PlatformStatus = {
  supabase: boolean;
  ai: boolean;
  email: boolean;
  encryption: boolean;
  wordpressConnections: number;
  woocommerceConnections: number;
};

export type SettingsActionState = {
  success?: string;
  error?: string;
  fieldErrors?: Partial<Record<string, string[]>>;
} | null;
