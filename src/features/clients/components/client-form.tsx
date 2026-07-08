"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Loader2, AlertCircle } from "lucide-react";
import type { ClientActionState } from "@/features/clients/actions/client-actions";
import type { Client } from "@/features/clients/types";
import { CLIENT_STATUSES, CLIENT_STATUS_LABELS, parseSocialLinks } from "@/features/clients/types";

type Props = {
  action: (
    prevState: ClientActionState,
    formData: FormData
  ) => Promise<ClientActionState>;
  defaultValues?: Client;
  submitLabel?: string;
};

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <span className="crm-field-error">{errors[0]}</span>;
}

export function ClientForm({
  action,
  defaultValues,
  submitLabel = "Zapisz",
}: Props) {
  const [state, formAction, isPending] = useActionState<ClientActionState, FormData>(action, null);
  const social = parseSocialLinks(defaultValues?.social_links ?? null);

  return (
    <form action={formAction} className="crm-form" noValidate>
      {state?.error && !state.fieldErrors && (
        <div className="crm-form-alert" role="alert">
          <AlertCircle size={14} />
          {state.error}
        </div>
      )}

      {/* ── 1. Dane podstawowe ── */}
      <section className="crm-section">
        <h2 className="crm-section-title">Dane podstawowe</h2>
        <div className="crm-grid crm-grid--2">
          <div className="crm-field">
            <label className="crm-label" htmlFor="first_name">
              Imię
            </label>
            <input
              id="first_name"
              name="first_name"
              type="text"
              defaultValue={defaultValues?.first_name ?? ""}
              disabled={isPending}
              className={`crm-input${state?.fieldErrors?.first_name ? " crm-input--error" : ""}`}
              placeholder="np. Anna"
              autoFocus
            />
            <FieldError errors={state?.fieldErrors?.first_name} />
          </div>
          <div className="crm-field">
            <label className="crm-label" htmlFor="last_name">
              Nazwisko
            </label>
            <input
              id="last_name"
              name="last_name"
              type="text"
              defaultValue={defaultValues?.last_name ?? ""}
              disabled={isPending}
              className="crm-input"
              placeholder="np. Kowalska"
            />
          </div>
        </div>
      </section>

      {/* ── 2. Dane kontaktowe ── */}
      <section className="crm-section">
        <h2 className="crm-section-title">Dane kontaktowe</h2>
        <div className="crm-grid crm-grid--2">
          <div className="crm-field">
            <label className="crm-label" htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={defaultValues?.email ?? ""}
              disabled={isPending}
              className={`crm-input${state?.fieldErrors?.email ? " crm-input--error" : ""}`}
              placeholder="np. anna@firma.pl"
            />
            <FieldError errors={state?.fieldErrors?.email} />
          </div>
          <div className="crm-field">
            <label className="crm-label" htmlFor="phone">
              Telefon
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={defaultValues?.phone ?? ""}
              disabled={isPending}
              className="crm-input"
              placeholder="np. +48 500 000 000"
            />
          </div>
        </div>
      </section>

      {/* ── 3. Dane firmy ── */}
      <section className="crm-section">
        <h2 className="crm-section-title">Dane firmy</h2>
        <div className="crm-grid crm-grid--2">
          <div className="crm-field">
            <label className="crm-label" htmlFor="company_name">
              Nazwa firmy
            </label>
            <input
              id="company_name"
              name="company_name"
              type="text"
              defaultValue={defaultValues?.company_name ?? ""}
              disabled={isPending}
              className="crm-input"
              placeholder="np. Studio Kreatywne Sp. z o.o."
            />
          </div>
          <div className="crm-field">
            <label className="crm-label" htmlFor="industry">
              Branża
            </label>
            <input
              id="industry"
              name="industry"
              type="text"
              defaultValue={defaultValues?.industry ?? ""}
              disabled={isPending}
              className="crm-input"
              placeholder="np. gastronomia, e-commerce, usługi"
            />
          </div>
          <div className="crm-field">
            <label className="crm-label" htmlFor="city">
              Miasto
            </label>
            <input
              id="city"
              name="city"
              type="text"
              defaultValue={defaultValues?.city ?? ""}
              disabled={isPending}
              className="crm-input"
              placeholder="np. Kraków"
            />
          </div>
          <div className="crm-field">
            <label className="crm-label" htmlFor="website_url">
              Strona internetowa
            </label>
            <input
              id="website_url"
              name="website_url"
              type="url"
              defaultValue={defaultValues?.website_url ?? ""}
              disabled={isPending}
              className={`crm-input${state?.fieldErrors?.website_url ? " crm-input--error" : ""}`}
              placeholder="https://firma.pl"
            />
            <FieldError errors={state?.fieldErrors?.website_url} />
          </div>
        </div>
      </section>

      {/* ── 4. Social media ── */}
      <section className="crm-section">
        <h2 className="crm-section-title">Social media</h2>
        <div className="crm-grid crm-grid--2">
          <div className="crm-field">
            <label className="crm-label" htmlFor="social_linkedin">
              LinkedIn
            </label>
            <input
              id="social_linkedin"
              name="social_linkedin"
              type="url"
              defaultValue={social.linkedin ?? ""}
              disabled={isPending}
              className="crm-input"
              placeholder="https://linkedin.com/in/..."
            />
          </div>
          <div className="crm-field">
            <label className="crm-label" htmlFor="social_facebook">
              Facebook
            </label>
            <input
              id="social_facebook"
              name="social_facebook"
              type="url"
              defaultValue={social.facebook ?? ""}
              disabled={isPending}
              className="crm-input"
              placeholder="https://facebook.com/..."
            />
          </div>
          <div className="crm-field">
            <label className="crm-label" htmlFor="social_instagram">
              Instagram
            </label>
            <input
              id="social_instagram"
              name="social_instagram"
              type="url"
              defaultValue={social.instagram ?? ""}
              disabled={isPending}
              className="crm-input"
              placeholder="https://instagram.com/..."
            />
          </div>
        </div>
      </section>

      {/* ── 5. Notatki ── */}
      <section className="crm-section">
        <h2 className="crm-section-title">Notatki</h2>
        <div className="crm-field">
          <label className="crm-label" htmlFor="notes">
            Notatki wewnętrzne
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            defaultValue={defaultValues?.notes ?? ""}
            disabled={isPending}
            className="crm-textarea"
            placeholder="Informacje o kliencie, ustalenia, historia kontaktu…"
          />
        </div>
      </section>

      {/* ── 6. Status ── */}
      <section className="crm-section">
        <h2 className="crm-section-title">Status</h2>
        <div className="crm-field" style={{ maxWidth: "18rem" }}>
          <label className="crm-label" htmlFor="status">
            Aktualny status klienta
          </label>
          <select
            id="status"
            name="status"
            defaultValue={defaultValues?.status ?? "new"}
            disabled={isPending}
            className="crm-select"
          >
            {CLIENT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {CLIENT_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* ── Akcje ── */}
      <div className="crm-form-footer">
        <Link href="/panel/klienci" className="crm-btn">
          Anuluj
        </Link>
        <button type="submit" disabled={isPending} className="crm-btn crm-btn--primary">
          {isPending ? (
            <>
              <Loader2 size={14} className="crm-spinner" />
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
