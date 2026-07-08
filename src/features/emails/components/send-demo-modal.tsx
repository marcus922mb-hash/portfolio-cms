"use client";

import { useState, useTransition } from "react";
import { Loader2, Mail, Send, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { sendDemoEmailAction } from "@/features/emails/actions/send-demo-email-action";
import { EmailPreview } from "@/features/emails/components/email-preview";
import {
  buildDemoPublicUrl,
  getDefaultDemoEmailBody,
  getDefaultDemoEmailSubject,
} from "@/features/emails/types";
import type { Demo } from "@/features/demos/types";

type Props = {
  demo: Demo;
  compact?: boolean;
};

export function SendDemoModal({ demo, compact = false }: Props) {
  const router = useRouter();
  const publicUrl = buildDemoPublicUrl(demo.slug);
  const companyName = demo.clients?.company_name ?? null;
  const [open, setOpen] = useState(false);
  const [toEmail, setToEmail] = useState(demo.clients?.email ?? "");
  const [subject, setSubject] = useState(getDefaultDemoEmailSubject(companyName));
  const [body, setBody] = useState(getDefaultDemoEmailBody(publicUrl));
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function close() {
    if (isPending) return;
    setOpen(false);
    setError(null);
  }

  function openModal() {
    setToEmail(demo.clients?.email ?? "");
    setSubject(getDefaultDemoEmailSubject(companyName));
    setBody(getDefaultDemoEmailBody(publicUrl));
    setError(null);
    setOpen(true);
  }

  function submit() {
    setError(null);

    startTransition(async () => {
      const response = await sendDemoEmailAction({
        demoId: demo.id,
        toEmail,
        subject,
        body,
      });

      if (response.success) {
        toast.success(response.message);
        setOpen(false);
        router.refresh();
      } else {
        setError(response.error);
        toast.error(response.error);
      }
    });
  }

  return (
    <>
      <button
        type="button"
        className={compact ? "crm-action-link" : "crm-btn crm-btn--primary"}
        onClick={openModal}
      >
        <Mail size={compact ? 13 : 14} />
        Wyślij demo e-mailem
      </button>

      {open && (
        <div className="send-demo-modal-backdrop" role="presentation" onClick={close}>
          <div
            className="send-demo-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="send-demo-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="send-demo-modal-header">
              <div>
                <span className="panel-card-title">Resend</span>
                <h2 id="send-demo-modal-title">Wyślij demo do klienta</h2>
                <p>Możesz edytować temat i treść przed wysyłką. Demo zostanie wysłane wyłącznie z panelu administratora.</p>
              </div>
              <button type="button" className="send-demo-modal-close" onClick={close} aria-label="Zamknij modal">
                <X size={16} />
              </button>
            </div>

            <div className="send-demo-modal-grid">
              <div className="send-demo-modal-form">
                <div className="crm-field">
                  <label className="crm-label" htmlFor="demo_email_to">Adres e-mail klienta</label>
                  <input
                    id="demo_email_to"
                    className="crm-input"
                    value={toEmail}
                    onChange={(event) => setToEmail(event.target.value)}
                    placeholder="klient@firma.pl"
                  />
                </div>

                <div className="crm-field">
                  <label className="crm-label" htmlFor="demo_email_subject">Temat wiadomości</label>
                  <input
                    id="demo_email_subject"
                    className="crm-input"
                    value={subject}
                    onChange={(event) => setSubject(event.target.value)}
                  />
                </div>

                <div className="crm-field">
                  <label className="crm-label" htmlFor="demo_email_body">Treść wiadomości</label>
                  <textarea
                    id="demo_email_body"
                    className="crm-textarea"
                    rows={12}
                    value={body}
                    onChange={(event) => setBody(event.target.value)}
                  />
                </div>

                <div className="send-demo-modal-link">
                  <span className="crm-label">Publiczny link do demo</span>
                  <a href={publicUrl} target="_blank" rel="noreferrer">
                    {publicUrl}
                  </a>
                </div>

                {error && <div className="crm-form-alert">{error}</div>}

                <div className="send-demo-modal-actions">
                  <button type="button" className="crm-btn" onClick={close} disabled={isPending}>
                    Zamknij
                  </button>
                  <button type="button" className="crm-btn crm-btn--primary" onClick={submit} disabled={isPending}>
                    {isPending ? <Loader2 size={14} className="est-spin" /> : <Send size={14} />}
                    {isPending ? "Wysyłanie…" : "Wyślij"}
                  </button>
                </div>
              </div>

              <EmailPreview toEmail={toEmail} subject={subject} body={body} publicUrl={publicUrl} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
