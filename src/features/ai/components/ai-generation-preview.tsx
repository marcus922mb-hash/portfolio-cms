"use client";

import { AlertTriangle, Check, Clock, RefreshCw, X } from "lucide-react";
import type { DemoContent } from "@/features/demos/types";
import type { AIProvider, GenerateDemoContentOutput } from "@/lib/ai/types";

type Props = {
  result: GenerateDemoContentOutput;
  durationSeconds: number | null;
  isSaving: boolean;
  saveError: string | null;
  saveSuccess: string | null;
  onSave: () => void;
  onReject: () => void;
  onRegenerate: () => void;
  isRegenerating: boolean;
};

const PROVIDER_LABELS: Record<AIProvider, string> = {
  openrouter: "OpenRouter",
  gemini: "Gemini",
  groq: "Groq",
  cloudflare: "Cloudflare Workers AI",
  local: "Model lokalny",
};

function ContentList({ items }: { items: { title: string; description: string }[] }) {
  return (
    <div className="ai-preview-list">
      {items.map((item) => (
        <div key={`${item.title}-${item.description}`}>
          <strong>{item.title}</strong>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  );
}

function FaqList({ items }: { items: DemoContent["faq"] }) {
  return (
    <div className="ai-preview-list">
      {items.map((item) => (
        <div key={`${item.question}-${item.answer}`}>
          <strong>{item.question}</strong>
          <p>{item.answer}</p>
        </div>
      ))}
    </div>
  );
}

export function AIGenerationPreview({
  result,
  durationSeconds,
  isSaving,
  saveError,
  saveSuccess,
  onSave,
  onReject,
  onRegenerate,
  isRegenerating,
}: Props) {
  const content = result.content;

  const stats = [
    content.services?.length && `${content.services.length} usług`,
    content.features?.length && `${content.features.length} wyróżniki`,
    content.gallery?.items?.length && `${content.gallery.items.length} zdjęć`,
    content.testimonials?.length && `${content.testimonials.length} opinie`,
    content.faq?.length && `${content.faq.length} FAQ`,
  ].filter(Boolean).join(" · ");

  return (
    <div className="ai-preview">
      <div className="ai-preview-meta">
        <span className="ai-provider-badge">{PROVIDER_LABELS[result.provider]}</span>
        <span className="ai-preview-model">{result.model}</span>
        {durationSeconds !== null && (
          <span className="ai-preview-duration">
            <Clock size={11} />
            {durationSeconds}s
          </span>
        )}
        {stats && <span className="ai-preview-stats">{stats}</span>}
      </div>

      <div className="ai-warning">
        <AlertTriangle size={14} />
        Sprawdź treści przed wysłaniem klientowi.
      </div>

      {saveError && <div className="crm-form-alert">{saveError}</div>}
      {saveSuccess && <div className="ai-success">{saveSuccess}</div>}

      <section className="ai-preview-section">
        <span>Hero</span>
        <h3>{content.hero.title}</h3>
        <p>{content.hero.subtitle}</p>
        <small>CTA: {content.hero.cta}</small>
      </section>

      <section className="ai-preview-section">
        <span>About</span>
        <h3>{content.about.title}</h3>
        <p>{content.about.content}</p>
      </section>

      <section className="ai-preview-section">
        <span>Services</span>
        <ContentList items={content.services} />
      </section>

      <section className="ai-preview-section">
        <span>Features</span>
        <ContentList items={content.features} />
      </section>

      <section className="ai-preview-section">
        <span>Process</span>
        <ContentList items={content.process} />
      </section>

      <section className="ai-preview-section">
        <span>Testimonials</span>
        <div className="ai-preview-list">
          {content.testimonials.map((item) => (
            <div key={`${item.name}-${item.content}`}>
              <strong>{item.name}</strong>
              <p>{item.content}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="ai-preview-section">
        <span>FAQ</span>
        <FaqList items={content.faq} />
      </section>

      <section className="ai-preview-section">
        <span>Contact</span>
        <h3>{content.contact.title}</h3>
        <p>{content.contact.description}</p>
        <small>CTA: {content.contact.cta}</small>
      </section>

      <section className="ai-preview-section">
        <span>SEO</span>
        <h3>{content.seo.title}</h3>
        <p>{content.seo.description}</p>
      </section>

      <div className="ai-preview-actions">
        <button type="button" className="crm-btn crm-btn--primary" onClick={onSave} disabled={isSaving}>
          <Check size={13} />
          {isSaving ? "Zapisywanie…" : "Zapisz do demo"}
        </button>
        <button type="button" className="crm-btn" onClick={onReject} disabled={isSaving || isRegenerating}>
          <X size={13} />
          Odrzuć
        </button>
        <button type="button" className="crm-btn" onClick={onRegenerate} disabled={isSaving || isRegenerating}>
          <RefreshCw size={13} className={isRegenerating ? "est-spin" : undefined} />
          Wygeneruj ponownie
        </button>
      </div>
    </div>
  );
}
