"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { ExternalLink, Pencil, RefreshCw, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import type { WordPressConnection, WPConnectionActivity } from "@/features/wordpress/types";
import {
  WP_AUTH_TYPE_LABELS,
  WP_CONNECTION_STATUS_LABELS,
  WP_CONNECTION_STATUSES,
  getWPClientLabel,
} from "@/features/wordpress/types";
import {
  testWordPressConnectionAction,
  updateWPConnectionStatusAction,
  type WPStatusActionState,
  type WPTestActionState,
} from "@/features/wordpress/actions/wordpress-actions";
import { WordPressStatusBadge } from "./wordpress-status-badge";
import type { WPPage, WPPost, WPMedia } from "@/lib/wordpress/types";
import { formatWPDate, stripHtml, truncate } from "@/lib/wordpress/normalize";

type Props = {
  connection: WordPressConnection;
  activity: WPConnectionActivity[];
  pages: WPPage[] | null;
  posts: WPPost[] | null;
  media: WPMedia[] | null;
  wpError: string | null;
};

function TestButton({ connectionId }: { connectionId: string }) {
  const boundAction = testWordPressConnectionAction.bind(null, connectionId);
  const [state, formAction, isPending] = useActionState<WPTestActionState, FormData>(
    boundAction,
    null
  );
  const router = useRouter();

  useEffect(() => {
    if (state?.success !== undefined) router.refresh();
  }, [state, router]);

  return (
    <div>
      <form action={formAction}>
        <button
          type="submit"
          disabled={isPending}
          className="crm-btn crm-btn--primary crm-btn--sm"
          style={{ width: "100%" }}
        >
          <RefreshCw size={12} className={isPending ? "est-spin" : ""} />
          {isPending ? "Testowanie…" : "Testuj połączenie"}
        </button>
      </form>
      {state && (
        <div
          className={`wp-test-result ${state.success ? "wp-test-result--ok" : "wp-test-result--err"}`}
          style={{ marginTop: ".75rem" }}
        >
          {state.success ? (
            <>
              <strong>Połączono</strong>
              {state.siteName && <p>{state.siteName}</p>}
              {state.siteUrl && <p className="crm-td-muted">{state.siteUrl}</p>}
            </>
          ) : (
            <>
              <strong>Błąd</strong>
              <p>{state.error}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function StatusSelector({ connection }: { connection: WordPressConnection }) {
  const boundAction = updateWPConnectionStatusAction.bind(null, connection.id);
  const [state, formAction, isPending] = useActionState<WPStatusActionState, FormData>(
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
        defaultValue={connection.status}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        disabled={isPending}
        className="crm-select crm-select--inline"
      >
        {WP_CONNECTION_STATUSES.map((s) => (
          <option key={s} value={s}>
            {WP_CONNECTION_STATUS_LABELS[s]}
          </option>
        ))}
      </select>
      {state?.error && <span className="crm-field-error">{state.error}</span>}
    </form>
  );
}

export function WordPressConnectionDetails({
  connection,
  activity,
  pages,
  posts,
  media,
  wpError,
}: Props) {
  return (
    <div className="crm-detail-layout">
      {/* ── Main column ── */}
      <div className="crm-detail-main">
        {/* Header card */}
        <div className="panel-card" style={{ marginBottom: "1.25rem" }}>
          <div className="crm-client-header">
            <div className="crm-client-avatar wp-avatar">WP</div>
            <div className="crm-client-meta">
              <h1 className="crm-client-name">
                {connection.name || connection.site_url}
              </h1>
              <p className="crm-client-company">
                {connection.site_url} · {getWPClientLabel(connection.clients)}
              </p>
              <div style={{ marginTop: ".5rem" }}>
                <WordPressStatusBadge status={connection.status} size="md" />
              </div>
            </div>
            <div className="crm-client-header-actions">
              <Link
                href={`/panel/wordpress/${connection.id}/edytuj`}
                className="crm-btn crm-btn--sm"
              >
                <Pencil size={12} />
                Edytuj
              </Link>
            </div>
          </div>
        </div>

        {/* Dane połączenia */}
        <div className="panel-card" style={{ marginBottom: "1.25rem" }}>
          <div className="panel-card-header">
            <span className="panel-card-title">Dane połączenia</span>
          </div>
          <div className="panel-card-body">
            <div className="crm-info-grid">
              <div className="crm-info-item">
                <span className="crm-info-label">Typ autoryzacji</span>
                <span className="crm-info-value">{WP_AUTH_TYPE_LABELS[connection.auth_type]}</span>
              </div>
              {connection.username && (
                <div className="crm-info-item">
                  <span className="crm-info-label">Login</span>
                  <span className="crm-info-value">{connection.username}</span>
                </div>
              )}
              <div className="crm-info-item">
                <span className="crm-info-label">Hasło</span>
                <span className="crm-info-value crm-td-muted">
                  {connection.application_password_encrypted ? "••••••••••• (zaszyfrowane)" : "—"}
                </span>
              </div>
              {connection.api_base_url && (
                <div className="crm-info-item">
                  <span className="crm-info-label">REST API endpoint</span>
                  <span className="crm-info-value">{connection.api_base_url}</span>
                </div>
              )}
            </div>
            {connection.notes && (
              <p className="crm-notes-text" style={{ marginTop: "1rem" }}>
                {connection.notes}
              </p>
            )}
          </div>
        </div>

        {/* Strony WordPress */}
        <div className="panel-card" style={{ marginBottom: "1.25rem" }}>
          <div className="panel-card-header">
            <span className="panel-card-title">Ostatnie strony</span>
            {connection.site_url && (
              <a
                href={`${connection.site_url}/wp-admin/edit.php?post_type=page`}
                target="_blank"
                rel="noreferrer"
                className="panel-card-action"
              >
                Otwórz w WP-Admin
              </a>
            )}
          </div>
          <div className="panel-card-body">
            {wpError ? (
              <div className="wp-fetch-error">{wpError}</div>
            ) : pages && pages.length > 0 ? (
              <div className="wp-content-list">
                {pages.map((page) => (
                  <div key={page.id} className="wp-content-item">
                    <a
                      href={page.link}
                      target="_blank"
                      rel="noreferrer"
                      className="wp-content-item-link"
                    >
                      {page.title.rendered || page.slug}
                      <ExternalLink size={11} />
                    </a>
                    <span className="wp-content-item-meta">{formatWPDate(page.date)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="crm-placeholder-text">
                {connection.status === "connected"
                  ? "Brak stron lub nie udało się pobrać."
                  : "Przetestuj połączenie, aby załadować strony."}
              </p>
            )}
          </div>
        </div>

        {/* Wpisy WordPress */}
        <div className="panel-card" style={{ marginBottom: "1.25rem" }}>
          <div className="panel-card-header">
            <span className="panel-card-title">Ostatnie wpisy</span>
            {connection.site_url && (
              <a
                href={`${connection.site_url}/wp-admin/edit.php`}
                target="_blank"
                rel="noreferrer"
                className="panel-card-action"
              >
                Otwórz w WP-Admin
              </a>
            )}
          </div>
          <div className="panel-card-body">
            {wpError ? (
              <div className="wp-fetch-error">{wpError}</div>
            ) : posts && posts.length > 0 ? (
              <div className="wp-content-list">
                {posts.map((post) => (
                  <div key={post.id} className="wp-content-item">
                    <a
                      href={post.link}
                      target="_blank"
                      rel="noreferrer"
                      className="wp-content-item-link"
                    >
                      {post.title.rendered || post.slug}
                      <ExternalLink size={11} />
                    </a>
                    <span className="wp-content-item-meta">{formatWPDate(post.date)}</span>
                    {post.excerpt.rendered && (
                      <p className="wp-content-item-excerpt">
                        {truncate(stripHtml(post.excerpt.rendered), 100)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="crm-placeholder-text">
                {connection.status === "connected"
                  ? "Brak wpisów lub nie udało się pobrać."
                  : "Przetestuj połączenie, aby załadować wpisy."}
              </p>
            )}
          </div>
        </div>

        {/* Media */}
        {media && media.length > 0 && (
          <div className="panel-card" style={{ marginBottom: "1.25rem" }}>
            <div className="panel-card-header">
              <span className="panel-card-title">Ostatnie media</span>
            </div>
            <div className="panel-card-body">
              <div className="wp-media-grid">
                {media.map((item) => (
                  <a
                    key={item.id}
                    href={item.source_url}
                    target="_blank"
                    rel="noreferrer"
                    className="wp-media-thumb"
                    title={item.title.rendered || item.mime_type}
                  >
                    {item.media_type === "image" ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.source_url} alt={item.title.rendered} loading="lazy" />
                    ) : (
                      <span className="wp-media-type">{item.mime_type}</span>
                    )}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Aktywność */}
        {activity.length > 0 && (
          <div className="panel-card">
            <div className="panel-card-header">
              <span className="panel-card-title">Historia aktywności</span>
            </div>
            <div className="panel-card-body">
              <div className="crm-activity-list">
                {activity.map((log) => (
                  <div key={log.id} className="crm-activity-item">
                    <div className="crm-activity-dot" />
                    <div>
                      <p className="crm-activity-label">{log.description ?? log.action}</p>
                      <p className="crm-activity-time">
                        {new Date(log.created_at).toLocaleString("pl-PL")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Sidebar ── */}
      <div className="crm-detail-sidebar">
        <div className="panel-card" style={{ marginBottom: "1rem" }}>
          <div className="panel-card-header">
            <span className="panel-card-title">Test połączenia</span>
          </div>
          <div className="panel-card-body">
            <TestButton connectionId={connection.id} />
          </div>
        </div>

        <div className="panel-card" style={{ marginBottom: "1rem" }}>
          <div className="panel-card-header">
            <span className="panel-card-title">Status</span>
          </div>
          <div className="panel-card-body">
            <StatusSelector connection={connection} />
          </div>
        </div>

        <div className="panel-card" style={{ marginBottom: "1rem" }}>
          <div className="panel-card-header">
            <span className="panel-card-title">Szybkie akcje</span>
          </div>
          <div className="panel-card-body crm-quick-actions">
            <Link href={`/panel/wordpress/${connection.id}/edytuj`} className="crm-action-link">
              <Pencil size={13} />
              Edytuj połączenie
            </Link>
            <a
              href={`${connection.site_url}/wp-admin`}
              target="_blank"
              rel="noreferrer"
              className="crm-action-link"
            >
              <ExternalLink size={13} />
              Otwórz WP-Admin
            </a>
            {connection.client_id && (
              <Link href={`/panel/klienci/${connection.client_id}`} className="crm-action-link">
                <UserRound size={13} />
                Wróć do klienta
              </Link>
            )}
          </div>
        </div>

        <div className="panel-card">
          <div className="panel-card-header">
            <span className="panel-card-title">Informacje</span>
          </div>
          <div className="panel-card-body">
            <div className="crm-meta-list">
              <div className="crm-meta-item">
                <span className="crm-meta-label">Klient</span>
                <span className="crm-meta-value">{getWPClientLabel(connection.clients)}</span>
              </div>
              <div className="crm-meta-item">
                <span className="crm-meta-label">Ostatni test</span>
                <span className="crm-meta-value">
                  {connection.last_sync_at
                    ? new Date(connection.last_sync_at).toLocaleString("pl-PL")
                    : "—"}
                </span>
              </div>
              <div className="crm-meta-item">
                <span className="crm-meta-label">Dodano</span>
                <span className="crm-meta-value">
                  {new Date(connection.created_at).toLocaleDateString("pl-PL")}
                </span>
              </div>
              <div className="crm-meta-item">
                <span className="crm-meta-label">ID</span>
                <span className="crm-meta-value crm-meta-id">{connection.id.slice(0, 8)}…</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
