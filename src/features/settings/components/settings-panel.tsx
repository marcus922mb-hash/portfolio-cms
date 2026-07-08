"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import {
  AlertCircle,
  Bell,
  Bot,
  Check,
  ChevronRight,
  CircleUserRound,
  Database,
  KeyRound,
  LayoutTemplate,
  Loader2,
  LockKeyhole,
  Mail,
  PlugZap,
  Save,
  Settings2,
  ShieldCheck,
  Store,
  UserRound,
  WrapText,
} from "lucide-react";
import {
  updateAISettingsAction,
  updatePasswordAction,
  updatePreferencesAction,
  updateProfileAction,
} from "@/features/settings/actions/settings-actions";
import type {
  AISettings,
  PanelPreferences,
  PanelUserProfile,
  PlatformStatus,
  SettingsActionState,
} from "@/features/settings/types";

type SettingsTab = "profile" | "preferences" | "notifications" | "security" | "ai" | "system";

const tabs: Array<{ id: SettingsTab; label: string; description: string; Icon: typeof UserRound }> = [
  { id: "profile", label: "Profil", description: "Dane administratora", Icon: UserRound },
  { id: "preferences", label: "Preferencje", description: "Język i Builder", Icon: Settings2 },
  { id: "notifications", label: "Powiadomienia", description: "E-mail i aktywność", Icon: Bell },
  { id: "security", label: "Bezpieczeństwo", description: "Hasło i sesja", Icon: ShieldCheck },
  { id: "ai", label: "AI", description: "Model i dostawca", Icon: Bot },
  { id: "system", label: "System", description: "Status usług", Icon: Database },
];

function FormMessage({ state }: { state: SettingsActionState }) {
  if (state?.error) {
    return <div className="settings-message is-error" role="alert"><AlertCircle size={14} />{state.error}</div>;
  }
  if (state?.success) {
    return <div className="settings-message is-success" role="status"><Check size={14} />{state.success}</div>;
  }
  return null;
}

function FieldError({ errors }: { errors?: string[] }) {
  return errors?.[0] ? <span className="crm-field-error">{errors[0]}</span> : null;
}

function SubmitButton({ pending, label = "Zapisz zmiany" }: { pending: boolean; label?: string }) {
  return (
    <button type="submit" className="crm-btn crm-btn--primary settings-submit" disabled={pending}>
      {pending ? <Loader2 size={13} className="crm-spinner" /> : <Save size={13} />}
      {pending ? "Zapisywanie…" : label}
    </button>
  );
}

function ToggleRow({
  name,
  title,
  description,
  defaultChecked,
}: {
  name: string;
  title: string;
  description: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="settings-toggle-row">
      <span>
        <strong>{title}</strong>
        <small>{description}</small>
      </span>
      <span className="settings-switch">
        <input name={name} type="checkbox" defaultChecked={defaultChecked} />
        <i />
      </span>
    </label>
  );
}

function ProfileForm({ profile }: { profile: PanelUserProfile }) {
  const [state, action, pending] = useActionState(updateProfileAction, null);
  const fieldErrors = state?.fieldErrors ?? {};

  return (
    <form action={action}>
      <div className="settings-section-heading">
        <div className="settings-section-icon"><CircleUserRound size={18} /></div>
        <div><h2>Profil administratora</h2><p>Dane widoczne w panelu i komunikacji systemowej.</p></div>
      </div>
      <FormMessage state={state} />
      <div className="settings-avatar-row">
        <span className="settings-avatar">{profile.initials}</span>
        <div><strong>{profile.fullName}</strong><small>{profile.email}</small></div>
        <span className="settings-role">{profile.role}</span>
      </div>
      <div className="crm-grid crm-grid--2 settings-fields">
        <div className="crm-field">
          <label className="crm-label" htmlFor="full_name">Imię i nazwisko</label>
          <input className="crm-input" id="full_name" name="full_name" defaultValue={profile.fullName} autoComplete="name" />
          <FieldError errors={fieldErrors.full_name} />
        </div>
        <div className="crm-field">
          <label className="crm-label" htmlFor="company_name">Firma / marka</label>
          <input className="crm-input" id="company_name" name="company_name" defaultValue={profile.companyName} />
          <FieldError errors={fieldErrors.company_name} />
        </div>
        <div className="crm-field">
          <label className="crm-label" htmlFor="phone">Telefon</label>
          <input className="crm-input" id="phone" name="phone" type="tel" defaultValue={profile.phone} autoComplete="tel" />
          <FieldError errors={fieldErrors.phone} />
        </div>
        <div className="crm-field">
          <label className="crm-label" htmlFor="account_email">Adres e-mail</label>
          <input className="crm-input" id="account_email" value={profile.email} disabled readOnly />
          <span className="settings-field-hint">Adres logowania jest zarządzany przez Supabase Auth.</span>
        </div>
      </div>
      <div className="settings-form-footer"><SubmitButton pending={pending} /></div>
    </form>
  );
}

function PreferencesForm({ preferences }: { preferences: PanelPreferences }) {
  const [state, action, pending] = useActionState(updatePreferencesAction, null);
  return (
    <form action={action}>
      <div className="settings-section-heading">
        <div className="settings-section-icon"><LayoutTemplate size={18} /></div>
        <div><h2>Preferencje pracy</h2><p>Domyślne zachowanie panelu i edytora stron.</p></div>
      </div>
      <FormMessage state={state} />
      <div className="crm-grid crm-grid--2 settings-fields">
        <div className="crm-field">
          <label className="crm-label" htmlFor="language">Język panelu</label>
          <select className="crm-select" id="language" name="language" defaultValue={preferences.language}>
            <option value="pl">Polski</option>
            <option value="en">English</option>
          </select>
        </div>
        <div className="crm-field">
          <label className="crm-label" htmlFor="timezone">Strefa czasowa</label>
          <select className="crm-select" id="timezone" name="timezone" defaultValue={preferences.timezone}>
            <option value="Europe/Warsaw">Europe/Warsaw (CET/CEST)</option>
            <option value="Europe/London">Europe/London</option>
            <option value="UTC">UTC</option>
          </select>
        </div>
        <div className="crm-field">
          <label className="crm-label" htmlFor="default_builder_device">Domyślny widok Buildera</label>
          <select className="crm-select" id="default_builder_device" name="default_builder_device" defaultValue={preferences.defaultBuilderDevice}>
            <option value="desktop">Desktop — 1440 px</option>
            <option value="tablet">Tablet — 768 px</option>
            <option value="mobile">Mobile — 375 px</option>
          </select>
        </div>
      </div>
      <div className="settings-toggle-group">
        <ToggleRow
          name="reduced_motion"
          title="Ogranicz animacje interfejsu"
          description="Zmniejsza ruch w panelu. Nie zmienia animacji projektowanej strony."
          defaultChecked={preferences.reducedMotion}
        />
      </div>
      <div className="settings-form-footer"><SubmitButton pending={pending} /></div>
    </form>
  );
}

function NotificationsForm({ preferences }: { preferences: PanelPreferences }) {
  const [state, action, pending] = useActionState(updatePreferencesAction, null);
  return (
    <form action={action}>
      <input type="hidden" name="language" value={preferences.language} />
      <input type="hidden" name="timezone" value={preferences.timezone} />
      <input type="hidden" name="default_builder_device" value={preferences.defaultBuilderDevice} />
      {preferences.reducedMotion && <input type="hidden" name="reduced_motion" value="on" />}
      <div className="settings-section-heading">
        <div className="settings-section-icon"><Bell size={18} /></div>
        <div><h2>Powiadomienia</h2><p>Wybierz zdarzenia, o których system ma Cię informować.</p></div>
      </div>
      <FormMessage state={state} />
      <div className="settings-toggle-group">
        <ToggleRow
          name="email_notifications"
          title="Powiadomienia e-mail"
          description="Wiadomości dotyczące ważnych zdarzeń i błędów integracji."
          defaultChecked={preferences.emailNotifications}
        />
        <ToggleRow
          name="demo_notifications"
          title="Aktywność demo"
          description="Informacja, gdy klient pierwszy raz otworzy wysłane demo."
          defaultChecked={preferences.demoNotifications}
        />
        <ToggleRow
          name="weekly_summary"
          title="Podsumowanie tygodnia"
          description="Krótki raport nowych klientów, wycen, demo i projektów."
          defaultChecked={preferences.weeklySummary}
        />
      </div>
      <div className="settings-form-footer"><SubmitButton pending={pending} /></div>
    </form>
  );
}

function SecurityForm({ profile }: { profile: PanelUserProfile }) {
  const [state, action, pending] = useActionState(updatePasswordAction, null);
  const fieldErrors = state?.fieldErrors ?? {};
  return (
    <form action={action}>
      <div className="settings-section-heading">
        <div className="settings-section-icon"><LockKeyhole size={18} /></div>
        <div><h2>Bezpieczeństwo konta</h2><p>Zmień hasło i sprawdź ostatnią aktywność.</p></div>
      </div>
      <FormMessage state={state} />
      <div className="settings-security-facts">
        <div><span><Mail size={13} /> Konto</span><strong>{profile.email}</strong></div>
        <div><span><KeyRound size={13} /> Ostatnie logowanie</span><strong>{profile.lastSignInAt}</strong></div>
        <div><span><ShieldCheck size={13} /> Rola</span><strong>{profile.role}</strong></div>
      </div>
      <div className="crm-grid crm-grid--2 settings-fields">
        <div className="crm-field">
          <label className="crm-label" htmlFor="password">Nowe hasło</label>
          <input className="crm-input" id="password" name="password" type="password" autoComplete="new-password" placeholder="Minimum 10 znaków" />
          <FieldError errors={fieldErrors.password} />
        </div>
        <div className="crm-field">
          <label className="crm-label" htmlFor="password_confirmation">Powtórz nowe hasło</label>
          <input className="crm-input" id="password_confirmation" name="password_confirmation" type="password" autoComplete="new-password" />
          <FieldError errors={fieldErrors.password_confirmation} />
        </div>
      </div>
      <div className="settings-form-footer"><SubmitButton pending={pending} label="Zmień hasło" /></div>
    </form>
  );
}

const OPENROUTER_FREE_MODELS: Array<{ value: string; label: string; note: string }> = [
  { value: "meta-llama/llama-3.3-70b-instruct:free", label: "Llama 3.3 70B", note: "Meta · duży · domyślny" },
  { value: "google/gemma-4-31b-it:free", label: "Gemma 4 31B", note: "Google · długi kontekst" },
  { value: "qwen/qwen3-next-80b-a3b-instruct:free", label: "Qwen3 80B", note: "Alibaba · mocny model" },
  { value: "openai/gpt-oss-120b:free", label: "GPT OSS 120B", note: "OpenAI · open source" },
  { value: "openai/gpt-oss-20b:free", label: "GPT OSS 20B", note: "OpenAI · szybszy" },
  { value: "nousresearch/hermes-3-llama-3.1-405b:free", label: "Hermes 3 405B", note: "Nous · największy" },
  { value: "nvidia/nemotron-3-super-120b-a12b:free", label: "Nemotron Super 120B", note: "NVIDIA" },
  { value: "nvidia/nemotron-3-ultra-550b-a55b:free", label: "Nemotron Ultra 550B", note: "NVIDIA · ogromny" },
  { value: "google/gemma-4-26b-a4b-it:free", label: "Gemma 4 26B", note: "Google · kompaktowy" },
  { value: "nvidia/nemotron-3-nano-30b-a3b:free", label: "Nemotron Nano 30B", note: "NVIDIA · szybki" },
  { value: "meta-llama/llama-3.2-3b-instruct:free", label: "Llama 3.2 3B", note: "Meta · najszybszy" },
  { value: "liquid/lfm-2.5-1.2b-instruct:free", label: "LFM 1.2B", note: "Liquid · ultralekki" },
];

// Aktywne modele Cloudflare Workers AI — rejestr 2026-06-28
const CLOUDFLARE_MODELS: Array<{ value: string; label: string }> = [
  { value: "@cf/qwen/qwen3-30b-a3b-fp8",                    label: "Qwen3 30B-A3B — jakość 30B w cenie 3B ★" },
  { value: "@cf/meta/llama-3.2-3b-instruct",                label: "Llama 3.2 3B — Meta · szybki i tani" },
  { value: "@cf/zai-org/glm-4.7-flash",                     label: "GLM 4.7 Flash — 131k kontekst" },
  { value: "@cf/google/gemma-4-26b-a4b-it",                 label: "Gemma 4 26B — Google · vision" },
  { value: "@cf/meta/llama-4-scout-17b-16e-instruct",       label: "Llama 4 Scout 17B — Meta · multimodalny" },
  { value: "@cf/meta/llama-3.3-70b-instruct-fp8-fast",     label: "Llama 3.3 70B FP8 — Meta · najwyższa jakość" },
  { value: "@cf/meta/llama-3.1-8b-instruct-fp8",           label: "Llama 3.1 8B FP8 — Meta · kod" },
  { value: "@cf/qwen/qwen2.5-coder-32b-instruct",          label: "Qwen 2.5 Coder 32B — kod · precyzyjny" },
  { value: "@cf/openai/gpt-oss-20b",                        label: "GPT OSS 20B — OpenAI · rozumowanie" },
  { value: "@cf/deepseek-ai/deepseek-r1-distill-qwen-32b", label: "DeepSeek R1 Qwen 32B — rozumowanie" },
  { value: "@cf/ibm-granite/granite-4.0-h-micro",          label: "Granite 4.0 Micro — IBM · najtańszy" },
  { value: "@cf/meta/llama-3.2-1b-instruct",               label: "Llama 3.2 1B — Meta · ultramały" },
];

function AISettingsForm({ aiSettings, status }: { aiSettings: AISettings; status: PlatformStatus }) {
  const [state, action, pending] = useActionState(updateAISettingsAction, null);
  const [provider, setProvider] = useState<AISettings["preferredProvider"]>(aiSettings.preferredProvider);

  const models = provider === "openrouter" ? OPENROUTER_FREE_MODELS.map(m => ({ value: m.value, label: `${m.label} — ${m.note}` })) : CLOUDFLARE_MODELS;
  const currentModelValid = models.some(m => m.value === aiSettings.preferredModel);
  const defaultModel = currentModelValid && aiSettings.preferredProvider === provider ? aiSettings.preferredModel : models[0]?.value ?? "";

  return (
    <form action={action}>
      <div className="settings-section-heading">
        <div className="settings-section-icon"><Bot size={18} /></div>
        <div><h2>Sztuczna inteligencja</h2><p>Wybierz dostawcę i model używany do generowania treści demo.</p></div>
      </div>
      <FormMessage state={state} />

      <div className="settings-ai-providers">
        <strong className="crm-label">Dostawca AI</strong>
        <div className="settings-ai-provider-grid">
          {([
            { id: "openrouter" as const, label: "OpenRouter", note: "Darmowe modele Google, Meta, DeepSeek", active: Boolean(status.ai) },
            { id: "cloudflare" as const, label: "Cloudflare Workers AI", note: "Natywny binding — woo-saas Worker", active: Boolean(process.env.NEXT_PUBLIC_SITE_URL) },
          ] as const).map(({ id, label, note, active }) => (
            <label key={id} className={`settings-ai-provider-card${provider === id ? " is-selected" : ""}`}>
              <input
                type="radio"
                name="ai_preferred_provider"
                value={id}
                checked={provider === id}
                onChange={() => setProvider(id)}
              />
              <span>
                <strong>{label}</strong>
                <small>{note}</small>
              </span>
              {active ? <span className="settings-status is-active"><i />Aktywny</span> : <span className="settings-status"><i />Wymaga klucza</span>}
            </label>
          ))}
        </div>
      </div>

      <div className="crm-field" style={{ marginTop: "1.25rem" }}>
        <label className="crm-label" htmlFor="ai_preferred_model">Model</label>
        <select className="crm-select" id="ai_preferred_model" name="ai_preferred_model" defaultValue={defaultModel}>
          {models.map(m => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
        {provider === "openrouter" && (
          <span className="settings-field-hint">Wszystkie modele z sufiksem <code>:free</code> są bezpłatne.</span>
        )}
      </div>

      <div className="settings-ai-current">
        <span><AlertCircle size={13} />Aktualnie aktywny: <strong>{aiSettings.preferredProvider} / {aiSettings.preferredModel || "domyślny z .env"}</strong></span>
      </div>

      <div className="settings-form-footer"><SubmitButton pending={pending} /></div>
    </form>
  );
}

function StatusBadge({ active, activeLabel = "Aktywne", inactiveLabel = "Wymaga konfiguracji" }: { active: boolean; activeLabel?: string; inactiveLabel?: string }) {
  return <span className={`settings-status${active ? " is-active" : ""}`}><i />{active ? activeLabel : inactiveLabel}</span>;
}

function SystemPanel({ status }: { status: PlatformStatus }) {
  return (
    <div>
      <div className="settings-section-heading">
        <div className="settings-section-icon"><PlugZap size={18} /></div>
        <div><h2>System i integracje</h2><p>Stan usług wymaganych przez platformę.</p></div>
      </div>
      <div className="settings-system-list">
        <div>
          <span className="settings-system-icon"><Database size={16} /></span>
          <span><strong>Supabase</strong><small>Baza danych i uwierzytelnianie</small></span>
          <StatusBadge active={status.supabase} />
        </div>
        <div>
          <span className="settings-system-icon"><Bot size={16} /></span>
          <span><strong>Provider AI</strong><small>OpenRouter, Gemini, Groq lub Cloudflare</small></span>
          <StatusBadge active={status.ai} />
        </div>
        <div>
          <span className="settings-system-icon"><Mail size={16} /></span>
          <span><strong>Resend</strong><small>Wysyłka wiadomości i demo</small></span>
          <StatusBadge active={status.email} />
        </div>
        <div>
          <span className="settings-system-icon"><KeyRound size={16} /></span>
          <span><strong>Szyfrowanie sekretów</strong><small>Klucze WordPress i integracji</small></span>
          <StatusBadge active={status.encryption} />
        </div>
      </div>
      <h3 className="settings-subheading">Połączenia</h3>
      <div className="settings-integration-grid">
        <Link href="/panel/wordpress/polaczenia">
          <span className="settings-integration-icon"><WrapText size={17} /></span>
          <span><strong>WordPress</strong><small>{status.wordpressConnections} skonfigurowanych połączeń</small></span>
          <ChevronRight size={15} />
        </Link>
        <Link href="/panel/woocommerce/polaczenia">
          <span className="settings-integration-icon"><Store size={17} /></span>
          <span><strong>WooCommerce</strong><small>{status.woocommerceConnections} skonfigurowanych połączeń</small></span>
          <ChevronRight size={15} />
        </Link>
      </div>
    </div>
  );
}

export function SettingsPanel({
  profile,
  preferences,
  aiSettings,
  status,
}: {
  profile: PanelUserProfile;
  preferences: PanelPreferences;
  aiSettings: AISettings;
  status: PlatformStatus;
}) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  return (
    <div className="settings-layout">
      <aside className="settings-nav" aria-label="Sekcje ustawień">
        {tabs.map(({ id, label, description, Icon }) => (
          <button
            type="button"
            key={id}
            className={activeTab === id ? "is-active" : ""}
            onClick={() => setActiveTab(id)}
          >
            <Icon size={15} />
            <span><strong>{label}</strong><small>{description}</small></span>
            <ChevronRight size={13} />
          </button>
        ))}
      </aside>
      <section className="settings-content">
        {activeTab === "profile" && <ProfileForm profile={profile} />}
        {activeTab === "preferences" && <PreferencesForm preferences={preferences} />}
        {activeTab === "notifications" && <NotificationsForm preferences={preferences} />}
        {activeTab === "security" && <SecurityForm profile={profile} />}
        {activeTab === "ai" && <AISettingsForm aiSettings={aiSettings} status={status} />}
        {activeTab === "system" && <SystemPanel status={status} />}
      </section>
    </div>
  );
}
