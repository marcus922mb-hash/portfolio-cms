"use client";

import { useActionState } from "react";
import { Loader2, Save } from "lucide-react";
import { PROJECT_STATUSES, PROJECT_STATUS_LABELS } from "@/features/projects/types";
import type { Project } from "@/features/projects/types";
import type { ProjectActionState } from "@/features/projects/actions/project-actions";

type ClientOption = { id: string; label: string };
type EstimateOption = { id: string; label: string };

type Props = {
  action: (prev: ProjectActionState, fd: FormData) => Promise<ProjectActionState>;
  submitLabel?: string;
  defaultValues?: Partial<Project>;
  clients?: ClientOption[];
  estimates?: EstimateOption[];
};

function FieldError({ errors }: { errors?: string[] }) {
  return errors?.[0] ? <span className="crm-field-error">{errors[0]}</span> : null;
}

export function ProjectForm({
  action,
  submitLabel = "Zapisz",
  defaultValues,
  clients = [],
  estimates = [],
}: Props) {
  const [state, formAction, pending] = useActionState<ProjectActionState, FormData>(
    action,
    null
  );
  const fe = state?.fieldErrors ?? {};

  return (
    <form action={formAction} className="crm-form">
      {state?.error && (
        <div className="crm-form-error">{state.error}</div>
      )}

      <div className="crm-grid crm-grid--2">
        <div className="crm-field" style={{ gridColumn: "1 / -1" }}>
          <label className="crm-label" htmlFor="name">Nazwa projektu *</label>
          <input
            className="crm-input"
            id="name"
            name="name"
            defaultValue={defaultValues?.name ?? ""}
            placeholder="np. Strona firmowa dla Jan Kowalski"
          />
          <FieldError errors={fe.name} />
        </div>

        <div className="crm-field">
          <label className="crm-label" htmlFor="status">Status</label>
          <select className="crm-select" id="status" name="status" defaultValue={defaultValues?.status ?? "discovery"}>
            {PROJECT_STATUSES.map((s) => (
              <option key={s} value={s}>{PROJECT_STATUS_LABELS[s]}</option>
            ))}
          </select>
        </div>

        <div className="crm-field">
          <label className="crm-label" htmlFor="technology">Technologia</label>
          <input
            className="crm-input"
            id="technology"
            name="technology"
            defaultValue={defaultValues?.technology ?? ""}
            placeholder="np. Next.js, WordPress, WooCommerce"
          />
          <FieldError errors={fe.technology} />
        </div>

        {clients.length > 0 && (
          <div className="crm-field">
            <label className="crm-label" htmlFor="client_id">Klient</label>
            <select className="crm-select" id="client_id" name="client_id" defaultValue={defaultValues?.client_id ?? "none"}>
              <option value="none">— Brak klienta —</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>
        )}

        {estimates.length > 0 && (
          <div className="crm-field">
            <label className="crm-label" htmlFor="estimate_id">Powiązana wycena</label>
            <select className="crm-select" id="estimate_id" name="estimate_id" defaultValue={defaultValues?.estimate_id ?? "none"}>
              <option value="none">— Brak wyceny —</option>
              {estimates.map((e) => (
                <option key={e.id} value={e.id}>{e.label}</option>
              ))}
            </select>
          </div>
        )}

        <div className="crm-field">
          <label className="crm-label" htmlFor="start_date">Data rozpoczęcia</label>
          <input
            className="crm-input"
            id="start_date"
            name="start_date"
            type="date"
            defaultValue={defaultValues?.start_date ?? ""}
          />
        </div>

        <div className="crm-field">
          <label className="crm-label" htmlFor="deadline">Termin oddania</label>
          <input
            className="crm-input"
            id="deadline"
            name="deadline"
            type="date"
            defaultValue={defaultValues?.deadline ?? ""}
          />
        </div>

        <div className="crm-field" style={{ gridColumn: "1 / -1" }}>
          <label className="crm-label" htmlFor="notes">Notatki</label>
          <textarea
            className="crm-input"
            id="notes"
            name="notes"
            rows={4}
            defaultValue={defaultValues?.notes ?? ""}
            placeholder="Opis projektu, wymagania, uwagi…"
          />
          <FieldError errors={fe.notes} />
        </div>
      </div>

      <div className="crm-form-footer">
        <button type="submit" className="crm-btn crm-btn--primary" disabled={pending}>
          {pending ? <Loader2 size={13} className="crm-spinner" /> : <Save size={13} />}
          {pending ? "Zapisywanie…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
