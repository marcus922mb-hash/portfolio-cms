import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Star } from "lucide-react";
import { getTemplateById, templates } from "@/features/templates/catalog";
import { TemplateVisual } from "@/features/templates/components/template-visual";
import { UseTemplateButton } from "@/features/templates/components/use-template-button";
import { TEMPLATE_WEBSITE_TYPE_LABELS } from "@/features/templates/types";
import { formatPriceFrom } from "@/config/public-offer";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return templates.map((template) => ({ id: template.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const template = getTemplateById(id);
  return { title: template ? `${template.name} — szablon` : "Szablon nie istnieje" };
}

export default async function TemplateDetailsPage({ params }: Props) {
  const { id } = await params;
  const template = getTemplateById(id);
  if (!template) notFound();

  return (
    <div className="tpl-detail">
      <div className="tpl-detail-nav">
        <Link href="/panel/templates"><ArrowLeft size={13} /> Wszystkie szablony</Link>
        <span>{TEMPLATE_WEBSITE_TYPE_LABELS[template.websiteType]} / {template.industry} / {template.style}</span>
      </div>

      <div className="tpl-detail-header">
        <div>
          <span className="tpl-kicker">
            {TEMPLATE_WEBSITE_TYPE_LABELS[template.websiteType]} / {formatPriceFrom(template.priceFrom)}
          </span>
          <h1>{template.name}</h1>
          <p>{template.summary}</p>
          <div className="tpl-detail-tags">
            {template.tags.map((tag) => <span key={tag}>{tag}</span>)}
            <span><Star size={10} fill="currentColor" /> {template.rating.toFixed(1)}</span>
          </div>
        </div>
        <UseTemplateButton templateId={template.id} templateName={template.name} />
      </div>

      <div className="tpl-detail-preview">
        <TemplateVisual template={template} />
      </div>

      <div className="tpl-detail-specs">
        <section>
          <span className="tpl-spec-number">01</span>
          <h2>Kompletna struktura</h2>
          <div className="tpl-section-list">
            {template.sections.map((section) => (
              <span key={section}><Check size={11} /> {section}</span>
            ))}
          </div>
        </section>
        <section>
          <span className="tpl-spec-number">02</span>
          <h2>System wizualny</h2>
          <div className="tpl-palette-detail">
            {Object.entries(template.colors).map(([name, color]) => (
              <div key={name}>
                <span style={{ background: color }} />
                <small>{name}</small>
                <code>{color}</code>
              </div>
            ))}
          </div>
          <p className="tpl-font-pair">{template.fonts.heading} <span>+</span> {template.fonts.body}</p>
        </section>
        <section>
          <span className="tpl-spec-number">03</span>
          <h2>Ruch i interakcje</h2>
          <div className="tpl-section-list">
            {template.animations.map((animation) => (
              <span key={animation}><Check size={11} /> {animation}</span>
            ))}
            <span><Check size={11} /> Framer Motion</span>
            <span><Check size={11} /> One-click image replace</span>
          </div>
        </section>
      </div>
    </div>
  );
}
