"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import { AlertCircle, Check, Loader2, UserPlus } from "lucide-react";
import type { DemoActionState } from "@/features/demos/actions/demo-actions";
import {
  DEMO_INDUSTRIES,
  DEMO_INDUSTRY_LABELS,
  DEMO_STATUSES,
  DEMO_STATUS_LABELS,
  DEMO_STYLES,
  DEMO_STYLE_LABELS,
  DEMO_GENERATION_MODES,
  DEMO_GENERATION_MODE_LABELS,
  DEMO_GENERATION_MODE_DESC,
  parseDemoImages,
  type ClientOption,
  type Demo,
  type EstimateOption,
} from "@/features/demos/types";
import { slugify } from "@/features/demos/schemas/demo-schema";
import { DemoContentEditor } from "./demo-content-editor";

type Props = {
  action: (prevState: DemoActionState, formData: FormData) => Promise<DemoActionState>;
  clients: ClientOption[];
  estimates: EstimateOption[];
  defaultValues?: Demo;
  initialClientId?: string;
  initialEstimateId?: string;
  submitLabel?: string;
};

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <span className="crm-field-error">{errors[0]}</span>;
}

export function DemoForm({
  action,
  clients,
  estimates,
  defaultValues,
  initialClientId,
  initialEstimateId,
  submitLabel = "Zapisz demo",
}: Props) {
  const [state, formAction, isPending] = useActionState<DemoActionState, FormData>(action, null);
  const [clientId, setClientId] = useState(defaultValues?.client_id ?? initialClientId ?? "");
  const [title, setTitle] = useState(defaultValues?.title ?? "");
  const [slug, setSlug] = useState(defaultValues?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(defaultValues?.slug));
  const noClients = clients.length === 0;
  const fieldErrors = state?.fieldErrors ?? {};

  const client = clients.find((item) => item.id === clientId);
  const availableEstimates = useMemo(
    () => estimates.filter((estimate) => !clientId || estimate.client_id === clientId),
    [estimates, clientId]
  );

  function updateTitle(value: string) {
    setTitle(value);
    if (!slugTouched) {
      setSlug(slugify(client?.companyName || value || client?.label || ""));
    }
  }

  function updateClient(value: string) {
    setClientId(value);
    if (!slugTouched) {
      const selected = clients.find((item) => item.id === value);
      setSlug(slugify(selected?.companyName || title || selected?.label || ""));
    }
  }

  return (
    <form action={formAction} className="crm-form-wrap">
      <div className="crm-form">
        {state?.error && !state.fieldErrors && (
          <div className="crm-form-alert" role="alert">
            <AlertCircle size={14} />
            {state.error}
          </div>
        )}

        <section className="crm-section">
          <h2 className="crm-section-title">1. Klient</h2>
          {noClients ? (
            <div className="est-no-clients">
              <p>Najpierw dodaj klienta w CRM, aby utworzyć demo.</p>
              <Link href="/panel/klienci/nowy" className="crm-btn crm-btn--sm crm-btn--primary" style={{ marginTop: ".75rem" }}>
                <UserPlus size={12} />
                Dodaj klienta
              </Link>
            </div>
          ) : (
            <div className="crm-field">
              <label className="crm-label" htmlFor="client_id">Klient</label>
              <select id="client_id" name="client_id" className="crm-select" value={clientId} onChange={(event) => updateClient(event.target.value)}>
                <option value="">— Wybierz klienta —</option>
                {clients.map((item) => (
                  <option key={item.id} value={item.id}>{item.label}</option>
                ))}
              </select>
              <FieldError errors={fieldErrors.client_id} />
            </div>
          )}
        </section>

        <section className="crm-section">
          <h2 className="crm-section-title">2. Powiązana wycena</h2>
          <div className="crm-field">
            <label className="crm-label" htmlFor="estimate_id">Wycena</label>
            <select id="estimate_id" name="estimate_id" className="crm-select" defaultValue={defaultValues?.estimate_id ?? initialEstimateId ?? ""}>
              <option value="">— Bez powiązanej wyceny —</option>
              {availableEstimates.map((item) => (
                <option key={item.id} value={item.id}>{item.label}</option>
              ))}
            </select>
          </div>
        </section>

        <section className="crm-section">
          <h2 className="crm-section-title">3. Dane demo</h2>
          <div className="crm-grid crm-grid--2">
            <div className="crm-field">
              <label className="crm-label" htmlFor="title">Tytuł demo</label>
              <input id="title" name="title" className="crm-input" value={title} onChange={(event) => updateTitle(event.target.value)} placeholder="np. Demo strony dla marki biżuterii" />
              <FieldError errors={fieldErrors.title} />
            </div>
            <div className="crm-field">
              <label className="crm-label" htmlFor="slug">Slug publicznego linku</label>
              <input id="slug" name="slug" className="crm-input" value={slug} onChange={(event) => { setSlugTouched(true); setSlug(slugify(event.target.value)); }} placeholder="np. atelier-kamieni" />
              <FieldError errors={fieldErrors.slug} />
            </div>
          </div>
        </section>

        <section className="crm-section">
          <h2 className="crm-section-title">4. Branża i styl</h2>
          <div className="crm-grid crm-grid--2">
            <div className="crm-field">
              <label className="crm-label" htmlFor="industry">Branża</label>
              <select id="industry" name="industry" className="crm-select" defaultValue={defaultValues?.industry ?? "handmade_jewelry"}>
                {DEMO_INDUSTRIES.map((item) => (
                  <option key={item} value={item}>{DEMO_INDUSTRY_LABELS[item]}</option>
                ))}
              </select>
              <FieldError errors={fieldErrors.industry} />
            </div>
            <div className="crm-field">
              <label className="crm-label" htmlFor="style">Styl</label>
              <select id="style" name="style" className="crm-select" defaultValue={defaultValues?.style ?? "premium"}>
                {DEMO_STYLES.map((item) => (
                  <option key={item} value={item}>{DEMO_STYLE_LABELS[item]}</option>
                ))}
              </select>
              <FieldError errors={fieldErrors.style} />
            </div>
          </div>

          <div className="crm-field">
            <label className="crm-label" htmlFor="generation_mode">Tryb generowania</label>
            <select id="generation_mode" name="generation_mode" className="crm-select" defaultValue={defaultValues?.generation_mode ?? "full"}>
              {DEMO_GENERATION_MODES.map((mode) => (
                <option key={mode} value={mode}>{DEMO_GENERATION_MODE_LABELS[mode]}</option>
              ))}
            </select>
            <span className="est-field-hint">
              {DEMO_GENERATION_MODE_DESC[defaultValues?.generation_mode ?? "full"]}
            </span>
            <FieldError errors={fieldErrors.generation_mode} />
          </div>
        </section>

        <section className="crm-section">
          <h2 className="crm-section-title">5. Kolory i media</h2>
          <div className="crm-grid crm-grid--2">
            <div className="crm-field">
              <label className="crm-label" htmlFor="primary_color">Kolor główny</label>
              <input id="primary_color" name="primary_color" type="color" className="crm-input demo-color-input" defaultValue={defaultValues?.primary_color ?? "#9a6f48"} />
              <FieldError errors={fieldErrors.primary_color} />
            </div>
            <div className="crm-field">
              <label className="crm-label" htmlFor="secondary_color">Kolor dodatkowy</label>
              <input id="secondary_color" name="secondary_color" type="color" className="crm-input demo-color-input" defaultValue={defaultValues?.secondary_color ?? "#d8c4a8"} />
              <FieldError errors={fieldErrors.secondary_color} />
            </div>
            <div className="crm-field">
              <label className="crm-label" htmlFor="logo_url">Logo URL</label>
              <input id="logo_url" name="logo_url" className="crm-input" defaultValue={defaultValues?.logo_url ?? ""} placeholder="https://..." />
              <FieldError errors={fieldErrors.logo_url} />
            </div>
            <div className="crm-field">
              <label className="crm-label" htmlFor="images_text">Zdjęcia, po jednym URL w linii</label>
              <textarea id="images_text" name="images_text" rows={3} className="crm-textarea" defaultValue={parseDemoImages(defaultValues?.images).join("\n")} />
            </div>
          </div>
        </section>

        <DemoContentEditor content={defaultValues?.content} />

        <section className="crm-section">
          <h2 className="crm-section-title">7. Ustawienia publikacji</h2>
          <div className="crm-grid crm-grid--2">
            <div className="crm-field">
              <label className="crm-label" htmlFor="status">Status</label>
              <select id="status" name="status" className="crm-select" defaultValue={defaultValues?.status ?? "draft"}>
                {DEMO_STATUSES.map((item) => (
                  <option key={item} value={item}>{DEMO_STATUS_LABELS[item]}</option>
                ))}
              </select>
              <FieldError errors={fieldErrors.status} />
            </div>
            <div className="crm-field">
              <label className="crm-label" htmlFor="expires_at">Data wygaśnięcia</label>
              <input id="expires_at" name="expires_at" type="datetime-local" className="crm-input" defaultValue={defaultValues?.expires_at ? defaultValues.expires_at.slice(0, 16) : ""} />
            </div>
          </div>
          <label className="demo-check-row">
            <input type="checkbox" name="is_active" defaultChecked={defaultValues?.is_active ?? false} />
            <Check size={13} />
            Demo aktywne publicznie
          </label>
        </section>
      </div>

      <div className="crm-form-footer">
        <Link href="/panel/demo" className="crm-btn">Anuluj</Link>
        <button type="submit" disabled={isPending || noClients} className="crm-btn crm-btn--primary">
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
