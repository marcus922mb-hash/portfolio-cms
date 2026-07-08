"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { ExternalLink, RefreshCw, Server, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { testWooCommerceConnectionAction, type WooCommerceQuickActionState } from "@/features/woocommerce/actions/woocommerce-actions";
import { WooCommerceOrdersPreview } from "@/features/woocommerce/components/woocommerce-orders-preview";
import { WooCommerceProductsPreview } from "@/features/woocommerce/components/woocommerce-products-preview";
import { WooCommerceStatusBadge } from "@/features/woocommerce/components/woocommerce-status-badge";
import type {
  WooCommerceActivity,
  WooCommerceConnection,
  WooCommerceConnectionPreview,
} from "@/features/woocommerce/types";
import { getWooCommerceClientLabel } from "@/features/woocommerce/types";

type Props = {
  connection: WooCommerceConnection;
  activity: WooCommerceActivity[];
  preview: WooCommerceConnectionPreview | null;
  previewError: string | null;
  hasConsumerKey: boolean;
  hasConsumerSecret: boolean;
};

function TestConnectionButton({ connectionId }: { connectionId: string }) {
  const boundAction = testWooCommerceConnectionAction.bind(null, connectionId);
  const [state, formAction, isPending] = useActionState<WooCommerceQuickActionState, FormData>(boundAction, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.refresh();
    }
  }, [router, state]);

  return (
    <form action={formAction}>
      <button type="submit" className="crm-btn crm-btn--primary crm-btn--sm" disabled={isPending}>
        <RefreshCw size={13} className={isPending ? "est-spin" : undefined} />
        {isPending ? "Testowanie…" : "Testuj WooCommerce"}
      </button>
      {state?.error && <span className="crm-field-error" style={{ display: "block", marginTop: ".45rem" }}>{state.error}</span>}
    </form>
  );
}

export function WooCommerceConnectionDetails({
  connection,
  activity,
  preview,
  previewError,
  hasConsumerKey,
  hasConsumerSecret,
}: Props) {
  return (
    <div className="crm-detail-layout">
      <div className="crm-detail-main">
        <div className="panel-card" style={{ marginBottom: "1.25rem" }}>
          <div className="crm-client-header">
            <div className="crm-client-avatar demo-avatar">WC</div>
            <div className="crm-client-meta">
              <h1 className="crm-client-name">{connection.name}</h1>
              <p className="crm-client-company">{connection.store_url}</p>
              <div style={{ marginTop: ".5rem" }}>
                <WooCommerceStatusBadge status={connection.status} size="md" />
              </div>
            </div>
            <div className="crm-client-header-actions">
              <TestConnectionButton connectionId={connection.id} />
            </div>
          </div>
        </div>

        <div className="panel-card" style={{ marginBottom: "1.25rem" }}>
          <div className="panel-card-header"><span className="panel-card-title">Podgląd sklepu</span></div>
          <div className="panel-card-body">
            {preview ? (
              <>
                <div className="woocommerce-store-summary">
                  <strong>{preview.store.name}</strong>
                  <p>{preview.store.description || "Brak opisu sklepu."}</p>
                  <a href={preview.store.url} target="_blank" rel="noreferrer">Otwórz sklep</a>
                </div>
                <WooCommerceProductsPreview products={preview.products} categories={preview.categories} />
              </>
            ) : (
              <p className="crm-placeholder-text">{previewError || "Uruchom test połączenia, aby zobaczyć podgląd produktów i kategorii."}</p>
            )}
          </div>
        </div>

        <div className="panel-card" style={{ marginBottom: "1.25rem" }}>
          <div className="panel-card-header"><span className="panel-card-title">Zamówienia</span></div>
          <div className="panel-card-body">
            <WooCommerceOrdersPreview orders={preview?.orders ?? []} error={preview ? null : "Podgląd zamówień pojawi się po udanym teście połączenia."} />
          </div>
        </div>

        {activity.length > 0 && (
          <div className="panel-card">
            <div className="panel-card-header"><span className="panel-card-title">Historia aktywności</span></div>
            <div className="panel-card-body">
              <div className="crm-activity-list">
                {activity.map((log) => (
                  <div key={log.id} className="crm-activity-item">
                    <div className="crm-activity-dot" />
                    <div>
                      <p className="crm-activity-label">{log.description ?? log.action}</p>
                      <p className="crm-activity-time">{new Date(log.created_at).toLocaleString("pl-PL")}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="crm-detail-sidebar">
        <div className="panel-card" style={{ marginBottom: "1rem" }}>
          <div className="panel-card-header"><span className="panel-card-title">Powiązania</span></div>
          <div className="panel-card-body">
            <div className="crm-meta-list">
              <div className="crm-meta-item"><span className="crm-meta-label">Klient</span><span className="crm-meta-value">{getWooCommerceClientLabel(connection.clients)}</span></div>
              <div className="crm-meta-item"><span className="crm-meta-label">WordPress</span><span className="crm-meta-value">{connection.wordpress_connection?.name || connection.wordpress_connection?.site_url || "—"}</span></div>
              <div className="crm-meta-item"><span className="crm-meta-label">Ostatni test</span><span className="crm-meta-value">{connection.last_sync_at ? new Date(connection.last_sync_at).toLocaleString("pl-PL") : "—"}</span></div>
            </div>
          </div>
        </div>

        <div className="panel-card" style={{ marginBottom: "1rem" }}>
          <div className="panel-card-header"><span className="panel-card-title">Dostęp API</span></div>
          <div className="panel-card-body">
            <div className="crm-meta-list">
              <div className="crm-meta-item"><span className="crm-meta-label">Consumer Key</span><span className="crm-meta-value">{hasConsumerKey ? "Zapisano" : "Brak"}</span></div>
              <div className="crm-meta-item"><span className="crm-meta-label">Consumer Secret</span><span className="crm-meta-value">{hasConsumerSecret ? "Zapisano" : "Brak"}</span></div>
            </div>
            <p className="est-field-hint" style={{ marginTop: ".65rem" }}>Sekrety są przechowywane po stronie serwera i nigdy nie są wyświetlane w panelu.</p>
          </div>
        </div>

        <div className="panel-card" style={{ marginBottom: "1rem" }}>
          <div className="panel-card-header"><span className="panel-card-title">Szybkie akcje</span></div>
          <div className="panel-card-body crm-quick-actions">
            <a href={connection.store_url} target="_blank" rel="noreferrer" className="crm-action-link"><ExternalLink size={13} />Otwórz sklep</a>
            <Link href="/panel/woocommerce/polaczenia" className="crm-action-link"><Server size={13} />Wróć do listy połączeń</Link>
            {connection.client_id && <Link href={`/panel/klienci/${connection.client_id}`} className="crm-action-link"><UserRound size={13} />Wróć do klienta</Link>}
          </div>
        </div>

        {connection.notes && (
          <div className="panel-card">
            <div className="panel-card-header"><span className="panel-card-title">Notatki</span></div>
            <div className="panel-card-body">
              <p className="crm-notes-text">{connection.notes}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
