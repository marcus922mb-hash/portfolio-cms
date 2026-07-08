"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { AlertCircle, AlertTriangle, Loader2 } from "lucide-react";
import type { WPConnectionActionState } from "@/features/wordpress/actions/wordpress-actions";
import {
  WP_AUTH_TYPES,
  WP_AUTH_TYPE_LABELS,
  type WordPressConnection,
  type WPClientOption,
} from "@/features/wordpress/types";

type Props = {
  action: (prevState: WPConnectionActionState, formData: FormData) => Promise<WPConnectionActionState>;
  clients: WPClientOption[];
  defaultValues?: WordPressConnection;
  encryptionAvailable: boolean;
  submitLabel?: string;
  preselectedClientId?: string;
};

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <span className="crm-field-error">{errors[0]}</span>;
}

export function WordPressConnectionForm({
  action,
  clients,
  defaultValues,
  encryptionAvailable,
  submitLabel = "Zapisz połączenie",
  preselectedClientId,
}: Props) {
  const [state, formAction, isPending] = useActionState<WPConnectionActionState, FormData>(
    action,
    null
  );

  const [authType, setAuthType] = useState<string>(defaultValues?.auth_type ?? "application_password");
  const fe = state?.fieldErrors ?? {};
  const isEdit = Boolean(defaultValues);

  return (
    <form action={formAction} className="crm-form-wrap">
      <div className="crm-form">
        {state?.error && !state.fieldErrors && (
          <div className="crm-form-alert" role="alert">
            <AlertCircle size={14} />
            {state.error}
          </div>
        )}

        {/* Sekcja 1: Klient */}
        <div className="crm-section">
          <h2 className="crm-section-title">1. Klient</h2>
          <div className="crm-field" style={{ maxWidth: "28rem" }}>
            <label className="crm-label" htmlFor="client_id">
              Klient (opcjonalny)
            </label>
            <select
              id="client_id"
              name="client_id"
              className="crm-select"
              defaultValue={defaultValues?.client_id ?? preselectedClientId ?? ""}
            >
              <option value="">— Bez klienta —</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
            <FieldError errors={fe.client_id} />
          </div>
        </div>

        {/* Sekcja 2: Dane strony WordPress */}
        <div className="crm-section">
          <h2 className="crm-section-title">2. Dane strony WordPress</h2>
          <div className="crm-grid crm-grid--2">
            <div className="crm-field">
              <label className="crm-label" htmlFor="name">
                Nazwa połączenia
              </label>
              <input
                id="name"
                name="name"
                className="crm-input"
                defaultValue={defaultValues?.name ?? ""}
                placeholder="np. Blog firmowy"
              />
              <FieldError errors={fe.name} />
            </div>
            <div className="crm-field">
              <label className="crm-label" htmlFor="site_url">
                Adres strony WordPress <span className="crm-field-required">*</span>
              </label>
              <input
                id="site_url"
                name="site_url"
                type="url"
                className="crm-input"
                defaultValue={defaultValues?.site_url ?? ""}
                placeholder="https://example.com"
              />
              <FieldError errors={fe.site_url} />
            </div>
          </div>
          <div className="crm-field" style={{ maxWidth: "36rem", marginTop: "1rem" }}>
            <label className="crm-label" htmlFor="api_base_url">
              Własny endpoint REST API (opcjonalny)
            </label>
            <input
              id="api_base_url"
              name="api_base_url"
              type="url"
              className="crm-input"
              defaultValue={defaultValues?.api_base_url ?? ""}
              placeholder="Zostaw puste — domyślnie: https://example.com/wp-json/wp/v2"
            />
            <p className="est-field-hint">
              Zostaw puste, jeśli WordPress jest zainstalowany pod standardowym adresem.
            </p>
            <FieldError errors={fe.api_base_url} />
          </div>
        </div>

        {/* Sekcja 3: Autoryzacja */}
        <div className="crm-section">
          <h2 className="crm-section-title">3. Autoryzacja</h2>
          <div className="crm-field" style={{ maxWidth: "24rem" }}>
            <label className="crm-label" htmlFor="auth_type">
              Typ autoryzacji
            </label>
            <select
              id="auth_type"
              name="auth_type"
              className="crm-select"
              value={authType}
              onChange={(e) => setAuthType(e.target.value)}
            >
              {WP_AUTH_TYPES.map((t) => (
                <option key={t} value={t}>
                  {WP_AUTH_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </div>

          {authType === "application_password" && (
            <>
              {!encryptionAvailable && (
                <div className="wp-warning-box">
                  <AlertTriangle size={14} />
                  <p>
                    <strong>WORDPRESS_ENCRYPTION_KEY</strong> nie jest skonfigurowany.
                    Ustaw go w zmiennych środowiskowych, aby zapisać Application Password.
                  </p>
                </div>
              )}
              <div className="crm-grid crm-grid--2" style={{ marginTop: "1rem" }}>
                <div className="crm-field">
                  <label className="crm-label" htmlFor="username">
                    Login WordPress
                  </label>
                  <input
                    id="username"
                    name="username"
                    autoComplete="off"
                    className="crm-input"
                    defaultValue={defaultValues?.username ?? ""}
                    placeholder="np. admin"
                  />
                  <FieldError errors={fe.username} />
                </div>
                <div className="crm-field">
                  <label className="crm-label" htmlFor="application_password">
                    Application Password
                  </label>
                  <input
                    id="application_password"
                    name="application_password"
                    type="password"
                    autoComplete="new-password"
                    className="crm-input"
                    placeholder={
                      isEdit && defaultValues?.application_password_encrypted
                        ? "Hasło zapisane — wpisz nowe, aby zmienić"
                        : "xxxx xxxx xxxx xxxx xxxx xxxx"
                    }
                  />
                  <p className="est-field-hint">
                    {isEdit
                      ? "Zostaw puste, aby zachować obecne hasło."
                      : "Wygeneruj w WordPress: Użytkownicy → Twój profil → Application Passwords."}
                  </p>
                  <FieldError errors={fe.application_password} />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Sekcja 4: Notatki */}
        <div className="crm-section">
          <h2 className="crm-section-title">4. Notatki</h2>
          <div className="crm-field">
            <label className="crm-label" htmlFor="notes">
              Wewnętrzne notatki
            </label>
            <textarea
              id="notes"
              name="notes"
              className="crm-textarea"
              rows={3}
              defaultValue={defaultValues?.notes ?? ""}
              placeholder="Dodatkowe informacje o połączeniu…"
            />
          </div>
        </div>
      </div>

      <div className="crm-form-footer">
        <Link href="/panel/wordpress" className="crm-btn">
          Anuluj
        </Link>
        <button type="submit" disabled={isPending} className="crm-btn crm-btn--primary">
          {isPending ? (
            <>
              <Loader2 size={13} className="est-spin" />
              Zapisywanie…
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
}
