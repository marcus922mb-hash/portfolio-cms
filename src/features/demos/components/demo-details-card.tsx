"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { ExternalLink, FileDown, Pencil, Printer, Send, UserRound, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Demo, DemoActivity } from "@/features/demos/types";
import type { DemoEmailLog } from "@/features/emails/types";
import {
  DEMO_STATUS_LABELS,
  DEMO_STATUSES,
  getDemoClientLabel,
  parseDemoContent,
} from "@/features/demos/types";
import {
  deactivateDemoAction,
  markDemoSentAction,
  updateDemoStatusAction,
  type DemoQuickActionState,
} from "@/features/demos/actions/demo-actions";
import { DemoIndustryBadge } from "./demo-industry-badge";
import { DemoPreview } from "./demo-preview";
import { DemoPublicLink } from "./demo-public-link";
import { DemoStatusBadge } from "./demo-status-badge";
import { DemoStyleBadge } from "./demo-style-badge";
import { AIGenerateDemoButton } from "@/features/ai/components/ai-generate-demo-button";
import { SectionRegeneratePanel } from "@/features/ai/components/section-regenerate-panel";
import { SendDemoModal } from "@/features/emails/components/send-demo-modal";

type Props = {
  demo: Demo;
  activity: DemoActivity[];
  emailLogs: DemoEmailLog[];
};

function StatusSelector({ demo }: { demo: Demo }) {
  const boundAction = updateDemoStatusAction.bind(null, demo.id);
  const [state, formAction, isPending] = useActionState<DemoQuickActionState, FormData>(boundAction, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) router.refresh();
  }, [state, router]);

  return (
    <form action={formAction} className="crm-status-select-form">
      <select
        name="status"
        defaultValue={demo.status}
        onChange={(event) => event.currentTarget.form?.requestSubmit()}
        disabled={isPending}
        className="crm-select crm-select--inline"
      >
        {DEMO_STATUSES.map((item) => (
          <option key={item} value={item}>{DEMO_STATUS_LABELS[item]}</option>
        ))}
      </select>
      {state?.error && <span className="crm-field-error">{state.error}</span>}
    </form>
  );
}

function QuickActionButton({
  action,
  icon,
  label,
}: {
  action: (prevState: DemoQuickActionState) => Promise<DemoQuickActionState>;
  icon: React.ReactNode;
  label: string;
}) {
  const [state, formAction, isPending] = useActionState<DemoQuickActionState, FormData>(
    async () => action(null),
    null
  );
  const router = useRouter();

  useEffect(() => {
    if (state?.success) router.refresh();
  }, [state, router]);

  return (
    <form action={formAction}>
      <button type="submit" className="crm-action-link" disabled={isPending}>
        {icon}
        {label}
      </button>
      {state?.error && <span className="crm-field-error">{state.error}</span>}
    </form>
  );
}

export function DemoDetailsCard({ demo, activity, emailLogs }: Props) {
  const content = parseDemoContent(demo.content);

  return (
    <div className="crm-detail-layout">
      <div className="crm-detail-main">
        <div className="panel-card" style={{ marginBottom: "1.25rem" }}>
          <div className="crm-client-header">
            <div className="crm-client-avatar demo-avatar">{demo.views_count}</div>
            <div className="crm-client-meta">
              <h1 className="crm-client-name">{demo.title}</h1>
              <p className="crm-client-company">/{demo.slug} · {getDemoClientLabel(demo.clients)}</p>
              <div style={{ marginTop: ".5rem" }}><DemoStatusBadge status={demo.status} size="md" /></div>
            </div>
            <div className="crm-client-header-actions">
              <Link href={`/panel/demo/${demo.id}/edytuj`} className="crm-btn crm-btn--sm">
                <Pencil size={12} />
                Edytuj
              </Link>
            </div>
          </div>
        </div>

        <div className="panel-card" style={{ marginBottom: "1.25rem" }}>
          <div className="panel-card-header"><span className="panel-card-title">Podgląd treści</span></div>
          <div className="panel-card-body">
            <DemoPreview demo={demo} />
            <div className="demo-content-summary">
              <h3>{content.hero.title}</h3>
              <p>{content.hero.subtitle}</p>
            </div>
          </div>
        </div>

        <div className="panel-card" style={{ marginBottom: "1.25rem" }}>
          <div className="panel-card-body">
            <AIGenerateDemoButton demoId={demo.id} />
            <div style={{ marginTop: "1rem" }}>
              <SectionRegeneratePanel demoId={demo.id} />
            </div>
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

        <div className="panel-card" style={{ marginTop: "1.25rem" }}>
          <div className="panel-card-header"><span className="panel-card-title">Historia wysyłki</span></div>
          <div className="panel-card-body">
            {emailLogs.length > 0 ? (
              <div className="crm-email-log-list">
                {emailLogs.map((log) => (
                  <div key={log.id} className="crm-email-log-item">
                    <div className="crm-email-log-row">
                      <strong>{log.to_email}</strong>
                      <span className={`crm-email-log-status crm-email-log-status--${log.status}`}>{log.status}</span>
                    </div>
                    <p className="crm-email-log-subject">{log.subject}</p>
                    <div className="crm-email-log-meta">
                      <span>{new Date(log.created_at).toLocaleString("pl-PL")}</span>
                      <span>{log.provider}</span>
                    </div>
                    {log.error && <p className="crm-email-log-error">{log.error}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="crm-placeholder-text">Brak historii wysyłki dla tego demo.</p>
            )}
          </div>
        </div>
      </div>

      <div className="crm-detail-sidebar">
        <div className="panel-card" style={{ marginBottom: "1rem" }}>
          <div className="panel-card-header"><span className="panel-card-title">Publiczny link</span></div>
          <div className="panel-card-body">
            <DemoPublicLink slug={demo.slug} demoId={demo.id} />
          </div>
        </div>

        <div className="panel-card" style={{ marginBottom: "1rem" }}>
          <div className="panel-card-header"><span className="panel-card-title">Status</span></div>
          <div className="panel-card-body"><StatusSelector demo={demo} /></div>
        </div>

        <div className="panel-card" style={{ marginBottom: "1rem" }}>
          <div className="panel-card-header"><span className="panel-card-title">Szybkie akcje</span></div>
          <div className="panel-card-body crm-quick-actions">
            <Link href={`/panel/demo/${demo.id}/edytuj`} className="crm-action-link"><Pencil size={13} />Edytuj demo</Link>
            <a href={`/demo/${demo.slug}`} target="_blank" rel="noreferrer" className="crm-action-link"><ExternalLink size={13} />Otwórz demo</a>
            <DemoPublicLink slug={demo.slug} demoId={demo.id} compact label="Kopiuj link" />
            <SendDemoModal demo={demo} compact />
            <a href={`/demo/${demo.slug}?print=1`} target="_blank" rel="noreferrer" className="crm-action-link"><Printer size={13} />Drukuj / PDF</a>
            <a href={`/api/demo/${demo.slug}/export-html`} download={`demo-${demo.slug}.html`} className="crm-action-link"><FileDown size={13} />Eksport HTML</a>
            <QuickActionButton action={markDemoSentAction.bind(null, demo.id)} icon={<Send size={13} />} label="Oznacz jako wysłane" />
            <QuickActionButton action={deactivateDemoAction.bind(null, demo.id)} icon={<XCircle size={13} />} label="Dezaktywuj demo" />
            {demo.client_id && <Link href={`/panel/klienci/${demo.client_id}`} className="crm-action-link"><UserRound size={13} />Wróć do klienta</Link>}
          </div>
        </div>

        <div className="panel-card">
          <div className="panel-card-header"><span className="panel-card-title">Informacje</span></div>
          <div className="panel-card-body">
            <div className="crm-meta-list">
              <div className="crm-meta-item"><span className="crm-meta-label">Branża</span><span className="crm-meta-value"><DemoIndustryBadge industry={demo.industry} /></span></div>
              <div className="crm-meta-item"><span className="crm-meta-label">Styl</span><span className="crm-meta-value"><DemoStyleBadge style={demo.style} /></span></div>
              <div className="crm-meta-item"><span className="crm-meta-label">Aktywne</span><span className="crm-meta-value">{demo.is_active ? "Tak" : "Nie"}</span></div>
              <div className="crm-meta-item"><span className="crm-meta-label">Wejścia</span><span className="crm-meta-value">{demo.views_count}</span></div>
              <div className="crm-meta-item"><span className="crm-meta-label">Wysłano</span><span className="crm-meta-value">{demo.sent_at ? new Date(demo.sent_at).toLocaleString("pl-PL") : "—"}</span></div>
              <div className="crm-meta-item"><span className="crm-meta-label">Pierwsze wejście</span><span className="crm-meta-value">{demo.first_viewed_at ? new Date(demo.first_viewed_at).toLocaleString("pl-PL") : "—"}</span></div>
              <div className="crm-meta-item"><span className="crm-meta-label">Wygasa</span><span className="crm-meta-value">{demo.expires_at ? new Date(demo.expires_at).toLocaleString("pl-PL") : "—"}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
