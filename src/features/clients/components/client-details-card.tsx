"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  Globe,
  MapPin,
  Briefcase,
  Pencil,
  Calculator,
  Layout,
  ExternalLink,
  ShoppingBag,
  WrapText,
} from "lucide-react";
import { ClientStatusBadge } from "./client-status-badge";
import {
  CLIENT_STATUSES,
  CLIENT_STATUS_LABELS,
  getClientDisplayName,
  getClientInitials,
  parseSocialLinks,
} from "@/features/clients/types";
import type { Client } from "@/features/clients/types";
import {
  updateClientStatusAction,
  type StatusActionState,
} from "@/features/clients/actions/client-actions";
import { EstimateStatusBadge } from "@/features/estimates/components/estimate-status-badge";
import { EstimateTypeBadge } from "@/features/estimates/components/estimate-type-badge";
import type { Estimate } from "@/features/estimates/types";
import type { Demo } from "@/features/demos/types";
import { DemoStatusBadge } from "@/features/demos/components/demo-status-badge";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { WordPressConnection } from "@/features/wordpress/types";
import { WordPressStatusBadge } from "@/features/wordpress/components/wordpress-status-badge";
import type { WooCommerceConnection } from "@/features/woocommerce/types";
import { WooCommerceStatusBadge } from "@/features/woocommerce/components/woocommerce-status-badge";

type Props = {
  client: Client;
  estimates: Estimate[];
  demos: Demo[];
  wooCommerceConnections: WooCommerceConnection[];
  wordpressConnections: WordPressConnection[];
};

function StatusSelector({ client }: { client: Client }) {
  const boundAction = updateClientStatusAction.bind(null, client.id);
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
        defaultValue={client.status}
        onChange={(e) => {
          const form = e.currentTarget.closest("form") as HTMLFormElement;
          form?.requestSubmit();
        }}
        disabled={isPending}
        className="crm-select crm-select--inline"
        aria-label="Zmień status"
      >
        {CLIENT_STATUSES.map((s) => (
          <option key={s} value={s}>
            {CLIENT_STATUS_LABELS[s]}
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

export function ClientDetailsCard({
  client,
  estimates,
  demos,
  wooCommerceConnections,
  wordpressConnections,
}: Props) {
  const social = parseSocialLinks(client.social_links);
  const displayName = getClientDisplayName(client);
  const initials = getClientInitials(client);

  return (
    <div className="crm-detail-layout">
      {/* ── Main column ── */}
      <div className="crm-detail-main">
        {/* Header */}
        <div className="panel-card" style={{ marginBottom: "1.25rem" }}>
          <div className="crm-client-header">
            <div className="crm-client-avatar">{initials}</div>
            <div className="crm-client-meta">
              <h1 className="crm-client-name">{displayName}</h1>
              {client.company_name && (
                <p className="crm-client-company">{client.company_name}</p>
              )}
              <div style={{ marginTop: ".5rem" }}>
                <ClientStatusBadge status={client.status} size="md" />
              </div>
            </div>
            <div className="crm-client-header-actions">
              <Link
                href={`/panel/klienci/${client.id}/edytuj`}
                className="crm-btn crm-btn--sm"
              >
                <Pencil size={12} />
                Edytuj
              </Link>
            </div>
          </div>
        </div>

        {/* Contact info */}
        <div className="panel-card" style={{ marginBottom: "1.25rem" }}>
          <div className="panel-card-header">
            <span className="panel-card-title">Dane kontaktowe</span>
          </div>
          <div className="panel-card-body">
            <div className="crm-info-grid">
              {client.email && (
                <div className="crm-info-item">
                  <Mail size={13} className="crm-info-icon" />
                  <div>
                    <span className="crm-info-label">E-mail</span>
                    <a href={`mailto:${client.email}`} className="crm-info-link">
                      {client.email}
                    </a>
                  </div>
                </div>
              )}
              {client.phone && (
                <div className="crm-info-item">
                  <Phone size={13} className="crm-info-icon" />
                  <div>
                    <span className="crm-info-label">Telefon</span>
                    <a href={`tel:${client.phone}`} className="crm-info-link">
                      {client.phone}
                    </a>
                  </div>
                </div>
              )}
              {client.city && (
                <div className="crm-info-item">
                  <MapPin size={13} className="crm-info-icon" />
                  <div>
                    <span className="crm-info-label">Miasto</span>
                    <span className="crm-info-value">{client.city}</span>
                  </div>
                </div>
              )}
              {client.industry && (
                <div className="crm-info-item">
                  <Briefcase size={13} className="crm-info-icon" />
                  <div>
                    <span className="crm-info-label">Branża</span>
                    <span className="crm-info-value">{client.industry}</span>
                  </div>
                </div>
              )}
              {client.website_url && (
                <div className="crm-info-item">
                  <Globe size={13} className="crm-info-icon" />
                  <div>
                    <span className="crm-info-label">Strona</span>
                    <a
                      href={client.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="crm-info-link"
                    >
                      {client.website_url.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                </div>
              )}
              {(social.linkedin || social.facebook || social.instagram) && (
                <div className="crm-info-item">
                  <ExternalLink size={13} className="crm-info-icon" />
                  <div>
                    <span className="crm-info-label">Social media</span>
                    <div className="crm-social-links">
                      {social.linkedin && (
                        <a
                          href={social.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="crm-social-text-btn"
                        >
                          LinkedIn
                        </a>
                      )}
                      {social.facebook && (
                        <a
                          href={social.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="crm-social-text-btn"
                        >
                          Facebook
                        </a>
                      )}
                      {social.instagram && (
                        <a
                          href={social.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="crm-social-text-btn"
                        >
                          Instagram
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Internal notes from client record */}
        {client.notes && (
          <div className="panel-card" style={{ marginBottom: "1.25rem" }}>
            <div className="panel-card-header">
              <span className="panel-card-title">Notatki</span>
            </div>
            <div className="panel-card-body">
              <p className="crm-notes-text">{client.notes}</p>
            </div>
          </div>
        )}

        {/* Wyceny klienta */}
        <div className="panel-card" style={{ marginBottom: "1.25rem" }}>
          <div className="panel-card-header">
            <span className="panel-card-title">Wyceny</span>
            <Link href={`/panel/wyceny/nowa?client=${client.id}`} className="panel-card-action">
              + Utwórz wycenę
            </Link>
          </div>
          <div className="panel-card-body">
            {estimates.length === 0 ? (
              <p className="crm-placeholder-text">Brak wycen dla tego klienta.</p>
            ) : (
              <div className="est-client-estimates">
                {estimates.map((est) => (
                  <Link key={est.id} href={`/panel/wyceny/${est.id}`} className="est-client-estimate-row">
                    <span className="est-client-estimate-type">
                      <EstimateTypeBadge type={est.website_type} />
                    </span>
                    <span className="est-client-estimate-price">
                      {est.final_price != null
                        ? `${Number(est.final_price).toLocaleString("pl-PL")} zł`
                        : "—"}
                    </span>
                    <span className="est-client-estimate-status">
                      <EstimateStatusBadge status={est.status} />
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="panel-card" style={{ marginBottom: "1.25rem" }}>
          <div className="panel-card-header">
            <span className="panel-card-title">Demo klienta</span>
            <Link href={`/panel/demo/nowe?client=${client.id}`} className="panel-card-action">
              + Utwórz demo
            </Link>
          </div>
          <div className="panel-card-body">
            {demos.length === 0 ? (
              <p className="crm-placeholder-text">Brak demo dla tego klienta.</p>
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

        {/* Połączenia WordPress */}
        <div className="panel-card" style={{ marginBottom: "1.25rem" }}>
          <div className="panel-card-header">
            <span className="panel-card-title">Połączenia WooCommerce</span>
            <Link
              href={`/panel/woocommerce/nowe?client=${client.id}`}
              className="panel-card-action"
            >
              + Dodaj WooCommerce
            </Link>
          </div>
          <div className="panel-card-body">
            {wooCommerceConnections.length === 0 ? (
              <p className="crm-placeholder-text">Brak połączeń WooCommerce dla tego klienta.</p>
            ) : (
              <div className="est-client-estimates">
                {wooCommerceConnections.map((conn) => (
                  <Link
                    key={conn.id}
                    href={`/panel/woocommerce/${conn.id}`}
                    className="est-client-estimate-row"
                  >
                    <span className="est-client-estimate-type">{conn.name}</span>
                    <span
                      className="est-client-estimate-price crm-td-muted"
                      style={{ fontSize: "0.72rem" }}
                    >
                      {conn.store_url}
                    </span>
                    <span className="est-client-estimate-status">
                      <WooCommerceStatusBadge status={conn.status} />
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="panel-card" style={{ marginBottom: "1.25rem" }}>
          <div className="panel-card-header">
            <span className="panel-card-title">Połączenia WordPress</span>
            <Link
              href={`/panel/wordpress/nowe?client=${client.id}`}
              className="panel-card-action"
            >
              + Dodaj WordPress
            </Link>
          </div>
          <div className="panel-card-body">
            {wordpressConnections.length === 0 ? (
              <p className="crm-placeholder-text">Brak połączeń WordPress dla tego klienta.</p>
            ) : (
              <div className="est-client-estimates">
                {wordpressConnections.map((conn) => (
                  <Link
                    key={conn.id}
                    href={`/panel/wordpress/${conn.id}`}
                    className="est-client-estimate-row"
                  >
                    <span className="est-client-estimate-type">
                      {conn.name || conn.site_url}
                    </span>
                    <span className="est-client-estimate-price crm-td-muted" style={{ fontSize: "0.72rem" }}>
                      {conn.site_url}
                    </span>
                    <span className="est-client-estimate-status">
                      <WordPressStatusBadge status={conn.status} />
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="panel-card">
          <div className="panel-card-header">
            <span className="panel-card-title">Projekty</span>
          </div>
          <div className="panel-card-body">
            <p className="crm-placeholder-text">Brak projektów — moduł dostępny w kolejnym etapie.</p>
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
            <StatusSelector client={client} />
          </div>
        </div>

        {/* Quick actions */}
        <div className="panel-card" style={{ marginBottom: "1rem" }}>
          <div className="panel-card-header">
            <span className="panel-card-title">Szybkie akcje</span>
          </div>
          <div className="panel-card-body crm-quick-actions">
            <Link
              href={`/panel/klienci/${client.id}/edytuj`}
              className="crm-action-link"
            >
              <Pencil size={13} />
              Edytuj klienta
            </Link>
            <Link
              href={`/panel/wyceny/nowa?client=${client.id}`}
              className="crm-action-link"
            >
              <Calculator size={13} />
              Utwórz wycenę
            </Link>
            <Link
              href={`/panel/demo/nowe?client=${client.id}`}
              className="crm-action-link"
            >
              <Layout size={13} />
              Utwórz demo
            </Link>
            <Link
              href={`/panel/wordpress/nowe?client=${client.id}`}
              className="crm-action-link"
            >
              <WrapText size={13} />
              Dodaj WordPress
            </Link>
            <Link
              href={`/panel/woocommerce/nowe?client=${client.id}`}
              className="crm-action-link"
            >
              <ShoppingBag size={13} />
              Dodaj WooCommerce
            </Link>
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
                  {new Date(client.created_at).toLocaleDateString("pl-PL")}
                </span>
              </div>
              <div className="crm-meta-item">
                <span className="crm-meta-label">Zaktualizowano</span>
                <span className="crm-meta-value">
                  {new Date(client.updated_at).toLocaleDateString("pl-PL")}
                </span>
              </div>
              <div className="crm-meta-item">
                <span className="crm-meta-label">ID</span>
                <span className="crm-meta-value crm-meta-id">{client.id.slice(0, 8)}…</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
