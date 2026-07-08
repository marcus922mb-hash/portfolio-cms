"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { Pencil, Layout, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { EstimateStatusBadge } from "./estimate-status-badge";
import { EstimateTypeBadge } from "./estimate-type-badge";
import { EstimatePriceSummary } from "./estimate-price-summary";
import {
  ESTIMATE_STATUSES,
  ESTIMATE_STATUS_LABELS,
  WEBSITE_TYPE_LABELS,
  getEstimateClientLabel,
} from "@/features/estimates/types";
import type { Estimate } from "@/features/estimates/types";
import type { Demo } from "@/features/demos/types";
import { DemoStatusBadge } from "@/features/demos/components/demo-status-badge";
import {
  updateEstimateStatusAction,
  type StatusActionState,
} from "@/features/estimates/actions/estimate-actions";

type Props = {
  estimate: Estimate;
  demos: Demo[];
};

const ADDON_LABELS: { key: keyof Estimate; label: string }[] = [
  { key: "needs_wordpress",   label: "WordPress" },
  { key: "needs_woocommerce", label: "WooCommerce" },
  { key: "needs_nextjs",      label: "Next.js" },
  { key: "needs_seo",         label: "SEO" },
  { key: "needs_ai",          label: "AI / chatbot" },
  { key: "needs_copywriting", label: "Copywriting" },
  { key: "needs_branding",    label: "Branding" },
  { key: "needs_maintenance", label: "Opieka techniczna" },
];

function StatusSelector({ estimate }: { estimate: Estimate }) {
  const boundAction = updateEstimateStatusAction.bind(null, estimate.id);
  const [state, formAction, isPending] = useActionState<StatusActionState, FormData>(
    boundAction,
    null
  );
  const router = useRouter();

  useEffect(() => {
    if (state?.success) router.refresh();
  }, [state, router]);

  return (
    <form action={formAction} className="crm-status-select-form">
      <select
        name="status"
        defaultValue={estimate.status}
        onChange={(e) => {
          const form = e.currentTarget.closest("form") as HTMLFormElement;
          form?.requestSubmit();
        }}
        disabled={isPending}
        className="crm-select crm-select--inline"
        aria-label="Zmień status"
      >
        {ESTIMATE_STATUSES.map((s) => (
          <option key={s} value={s}>
            {ESTIMATE_STATUS_LABELS[s]}
          </option>
        ))}
      </select>
      {state?.error && (
        <span className="crm-field-error" style={{ marginTop: ".25rem" }}>
          {state.error}
        </span>
      )}
    </form>
  );
}

export function EstimateDetailsCard({ estimate, demos }: Props) {
  const activeAddons = ADDON_LABELS.filter(({ key }) => estimate[key] === true);

  return (
    <div className="crm-detail-layout">
      {/* ── Main column ── */}
      <div className="crm-detail-main">

        {/* Header */}
        <div className="panel-card" style={{ marginBottom: "1.25rem" }}>
          <div className="crm-client-header">
            <div className="crm-client-avatar est-avatar">
              {(estimate.final_price ?? 0) > 0
                ? `${Math.round((estimate.final_price ?? 0) / 1000)}k`
                : "—"}
            </div>
            <div className="crm-client-meta">
              <h1 className="crm-client-name">
                {WEBSITE_TYPE_LABELS[estimate.website_type] ?? estimate.website_type}
              </h1>
              {estimate.clients && (
                <p className="crm-client-company">
                  Klient: {getEstimateClientLabel(estimate)}
                </p>
              )}
              <div style={{ marginTop: ".5rem" }}>
                <EstimateStatusBadge status={estimate.status} size="md" />
              </div>
            </div>
            <div className="crm-client-header-actions">
              <Link
                href={`/panel/wyceny/${estimate.id}/edytuj`}
                className="crm-btn crm-btn--sm"
              >
                <Pencil size={12} />
                Edytuj
              </Link>
            </div>
          </div>
        </div>

        {/* Szczegóły */}
        <div className="panel-card" style={{ marginBottom: "1.25rem" }}>
          <div className="panel-card-header">
            <span className="panel-card-title">Zakres projektu</span>
          </div>
          <div className="panel-card-body">
            <div className="crm-info-grid">
              <div className="crm-info-item">
                <div>
                  <span className="crm-info-label">Typ strony</span>
                  <div style={{ marginTop: ".2rem" }}>
                    <EstimateTypeBadge type={estimate.website_type} />
                  </div>
                </div>
              </div>
              <div className="crm-info-item">
                <div>
                  <span className="crm-info-label">Liczba podstron</span>
                  <span className="crm-info-value">{estimate.pages_count ?? 1}</span>
                </div>
              </div>
            </div>

            {activeAddons.length > 0 && (
              <div style={{ marginTop: "1rem" }}>
                <span className="crm-info-label" style={{ display: "block", marginBottom: ".5rem" }}>Dodatki</span>
                <div className="est-addons-list">
                  {activeAddons.map(({ label }) => (
                    <span key={label} className="est-addon-chip">{label}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Cena */}
        <div className="panel-card" style={{ marginBottom: "1.25rem" }}>
          <div className="panel-card-header">
            <span className="panel-card-title">Cena</span>
          </div>
          <div className="panel-card-body">
            <EstimatePriceSummary
              basePrice={estimate.base_price != null ? Number(estimate.base_price) : null}
              finalPrice={estimate.final_price != null ? Number(estimate.final_price) : null}
            />
          </div>
        </div>

        {/* Notatki */}
        {estimate.notes && (
          <div className="panel-card" style={{ marginBottom: "1.25rem" }}>
            <div className="panel-card-header">
              <span className="panel-card-title">Notatki</span>
            </div>
            <div className="panel-card-body">
              <p className="crm-notes-text">{estimate.notes}</p>
            </div>
          </div>
        )}

        <div className="panel-card" style={{ marginBottom: "1.25rem" }}>
          <div className="panel-card-header">
            <span className="panel-card-title">Powiązane demo</span>
            <Link href={`/panel/demo/nowe?estimate=${estimate.id}`} className="panel-card-action">
              + Utwórz demo na podstawie wyceny
            </Link>
          </div>
          <div className="panel-card-body">
            {demos.length === 0 ? (
              <p className="crm-placeholder-text">Brak demo powiązanego z tą wyceną.</p>
            ) : (
              <div className="est-client-estimates">
                {demos.map((demo) => (
                  <Link key={demo.id} href={`/panel/demo/${demo.id}`} className="est-client-estimate-row">
                    <span className="est-client-estimate-type">{demo.title}</span>
                    <span className="est-client-estimate-price">{demo.views_count} wejść</span>
                    <span className="est-client-estimate-status">
                      <DemoStatusBadge status={demo.status} />
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ── Sidebar ── */}
      <div className="crm-detail-sidebar">

        {/* Status */}
        <div className="panel-card" style={{ marginBottom: "1rem" }}>
          <div className="panel-card-header">
            <span className="panel-card-title">Status</span>
          </div>
          <div className="panel-card-body">
            <StatusSelector estimate={estimate} />
          </div>
        </div>

        {/* Szybkie akcje */}
        <div className="panel-card" style={{ marginBottom: "1rem" }}>
          <div className="panel-card-header">
            <span className="panel-card-title">Szybkie akcje</span>
          </div>
          <div className="panel-card-body crm-quick-actions">
            <Link
              href={`/panel/wyceny/${estimate.id}/edytuj`}
              className="crm-action-link"
            >
              <Pencil size={13} />
              Edytuj wycenę
            </Link>
            <Link
              href={`/panel/demo/nowe?estimate=${estimate.id}`}
              className="crm-action-link"
            >
              <Layout size={13} />
              Utwórz demo
            </Link>
            {estimate.client_id && (
              <Link
                href={`/panel/klienci/${estimate.client_id}`}
                className="crm-action-link"
              >
                <UserRound size={13} />
                Wróć do klienta
              </Link>
            )}
          </div>
        </div>

        {/* Meta */}
        <div className="panel-card">
          <div className="panel-card-header">
            <span className="panel-card-title">Informacje</span>
          </div>
          <div className="panel-card-body">
            <div className="crm-meta-list">
              <div className="crm-meta-item">
                <span className="crm-meta-label">Dodano</span>
                <span className="crm-meta-value">
                  {new Date(estimate.created_at).toLocaleDateString("pl-PL")}
                </span>
              </div>
              <div className="crm-meta-item">
                <span className="crm-meta-label">Zaktualizowano</span>
                <span className="crm-meta-value">
                  {new Date(estimate.updated_at).toLocaleDateString("pl-PL")}
                </span>
              </div>
              <div className="crm-meta-item">
                <span className="crm-meta-label">ID</span>
                <span className="crm-meta-value crm-meta-id">{estimate.id.slice(0, 8)}…</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
