import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SettingsPanel } from "@/features/settings/components/settings-panel";
import type { AISettings, PanelPreferences, PanelUserProfile } from "@/features/settings/types";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Ustawienia" };

function formatDate(value?: string | null) {
  if (!value) return "Brak danych";
  return new Intl.DateTimeFormat("pl-PL", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Warsaw",
  }).format(new Date(value));
}

function getInitials(name: string, email: string) {
  const source = name.trim() || email.split("@")[0] || "AD";
  return source.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

export default async function PanelUstawienia() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const metadata = user.user_metadata ?? {};
  const fullName = typeof metadata.full_name === "string" && metadata.full_name.trim()
    ? metadata.full_name.trim()
    : user.email?.split("@")[0] ?? "Administrator";
  const email = user.email ?? "";

  const [{ count: wordpressConnections }, { count: woocommerceConnections }] = await Promise.all([
    supabase.from("wordpress_connections").select("id", { count: "exact", head: true }),
    supabase.from("woocommerce_connections").select("id", { count: "exact", head: true }),
  ]);

  const profile: PanelUserProfile = {
    fullName,
    companyName: typeof metadata.company_name === "string" ? metadata.company_name : "",
    phone: typeof metadata.phone === "string" ? metadata.phone : "",
    email,
    role: "Administrator",
    initials: getInitials(fullName, email),
    createdAt: formatDate(user.created_at),
    lastSignInAt: formatDate(user.last_sign_in_at),
  };

  const preferences: PanelPreferences = {
    language: metadata.language === "en" ? "en" : "pl",
    timezone: typeof metadata.timezone === "string" ? metadata.timezone : "Europe/Warsaw",
    defaultBuilderDevice: ["desktop", "tablet", "mobile"].includes(metadata.default_builder_device)
      ? metadata.default_builder_device
      : "desktop",
    reducedMotion: metadata.reduced_motion === true,
    emailNotifications: metadata.email_notifications !== false,
    demoNotifications: metadata.demo_notifications !== false,
    weeklySummary: metadata.weekly_summary === true,
  };

  const aiSettings: AISettings = {
    preferredProvider: metadata.ai_preferred_provider === "cloudflare" ? "cloudflare" : "openrouter",
    preferredModel: typeof metadata.ai_preferred_model === "string" && metadata.ai_preferred_model
      ? metadata.ai_preferred_model
      : (process.env.OPENROUTER_MODEL ?? "google/gemini-2.0-flash-exp:free"),
  };

  return (
    <>
      <div className="crm-page-header settings-page-header">
        <div>
          <h1 className="crm-page-title">Ustawienia</h1>
          <p className="crm-page-desc">Konto, preferencje i konfiguracja platformy</p>
        </div>
        <span className="settings-account-since">Konto od {profile.createdAt}</span>
      </div>
      <SettingsPanel
        profile={profile}
        preferences={preferences}
        aiSettings={aiSettings}
        status={{
          supabase: true,
          ai: Boolean(process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY || process.env.GROQ_API_KEY || process.env.CLOUDFLARE_API_TOKEN),
          email: Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM),
          encryption: Boolean(process.env.WORDPRESS_ENCRYPTION_KEY || process.env.APP_ENCRYPTION_KEY),
          wordpressConnections: wordpressConnections ?? 0,
          woocommerceConnections: woocommerceConnections ?? 0,
        }}
      />
    </>
  );
}
