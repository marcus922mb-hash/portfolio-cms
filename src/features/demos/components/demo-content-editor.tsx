"use client";

import { parseDemoContent, type DemoContent } from "@/features/demos/types";
import type { Json } from "@/types/database";

type Props = {
  content?: Json | null;
};

function lines(items: { title: string; description: string }[]) {
  return items.map((item) => `${item.title} | ${item.description}`).join("\n");
}

function testimonialLines(items: DemoContent["testimonials"]) {
  return items.map((item) => `${item.name} | ${item.content}`).join("\n");
}

function faqLines(items: DemoContent["faq"]) {
  return items.map((item) => `${item.question} | ${item.answer}`).join("\n");
}

export function DemoContentEditor({ content }: Props) {
  const c = parseDemoContent(content);

  return (
    <>
      <section className="crm-section">
        <h2 className="crm-section-title">6. Treści</h2>
        <div className="crm-grid crm-grid--2">
          <div className="crm-field">
            <label className="crm-label" htmlFor="hero_title">Hero — tytuł</label>
            <input id="hero_title" name="hero_title" className="crm-input" defaultValue={c.hero.title} />
          </div>
          <div className="crm-field">
            <label className="crm-label" htmlFor="hero_cta">Hero — CTA</label>
            <input id="hero_cta" name="hero_cta" className="crm-input" defaultValue={c.hero.cta} />
          </div>
        </div>
        <div className="crm-field" style={{ marginTop: "1rem" }}>
          <label className="crm-label" htmlFor="hero_subtitle">Hero — opis</label>
          <textarea id="hero_subtitle" name="hero_subtitle" rows={3} className="crm-textarea" defaultValue={c.hero.subtitle} />
        </div>
        <div className="crm-grid crm-grid--2" style={{ marginTop: "1rem" }}>
          <div className="crm-field">
            <label className="crm-label" htmlFor="about_title">O firmie — tytuł</label>
            <input id="about_title" name="about_title" className="crm-input" defaultValue={c.about.title} />
          </div>
          <div className="crm-field">
            <label className="crm-label" htmlFor="contact_title">Kontakt — tytuł</label>
            <input id="contact_title" name="contact_title" className="crm-input" defaultValue={c.contact.title} />
          </div>
        </div>
        <div className="crm-field" style={{ marginTop: "1rem" }}>
          <label className="crm-label" htmlFor="about_content">O firmie — treść</label>
          <textarea id="about_content" name="about_content" rows={4} className="crm-textarea" defaultValue={c.about.content} />
        </div>
        <div className="crm-field" style={{ marginTop: "1rem" }}>
          <label className="crm-label" htmlFor="services_text">Usługi, po jednej w linii: tytuł | opis</label>
          <textarea id="services_text" name="services_text" rows={4} className="crm-textarea" defaultValue={lines(c.services)} />
        </div>
        <div className="crm-field" style={{ marginTop: "1rem" }}>
          <label className="crm-label" htmlFor="features_text">Wyróżniki, po jednej w linii: tytuł | opis</label>
          <textarea id="features_text" name="features_text" rows={3} className="crm-textarea" defaultValue={lines(c.features)} />
        </div>
        <div className="crm-field" style={{ marginTop: "1rem" }}>
          <label className="crm-label" htmlFor="process_text">Proces, po jednej w linii: tytuł | opis</label>
          <textarea id="process_text" name="process_text" rows={3} className="crm-textarea" defaultValue={lines(c.process)} />
        </div>
        <div className="crm-grid crm-grid--2" style={{ marginTop: "1rem" }}>
          <div className="crm-field">
            <label className="crm-label" htmlFor="testimonials_text">Opinie: imię | treść</label>
            <textarea id="testimonials_text" name="testimonials_text" rows={4} className="crm-textarea" defaultValue={testimonialLines(c.testimonials)} />
          </div>
          <div className="crm-field">
            <label className="crm-label" htmlFor="faq_text">FAQ: pytanie | odpowiedź</label>
            <textarea id="faq_text" name="faq_text" rows={4} className="crm-textarea" defaultValue={faqLines(c.faq)} />
          </div>
        </div>
        <div className="crm-field" style={{ marginTop: "1rem" }}>
          <label className="crm-label" htmlFor="contact_description">Kontakt — opis</label>
          <textarea id="contact_description" name="contact_description" rows={3} className="crm-textarea" defaultValue={c.contact.description} />
        </div>
        <div className="crm-grid crm-grid--2" style={{ marginTop: "1rem" }}>
          <div className="crm-field">
            <label className="crm-label" htmlFor="contact_cta">Kontakt — CTA</label>
            <input id="contact_cta" name="contact_cta" className="crm-input" defaultValue={c.contact.cta} />
          </div>
          <div className="crm-field">
            <label className="crm-label" htmlFor="seo_title">SEO title</label>
            <input id="seo_title" name="seo_title" className="crm-input" defaultValue={c.seo.title} />
          </div>
        </div>
        <div className="crm-field" style={{ marginTop: "1rem" }}>
          <label className="crm-label" htmlFor="seo_description">SEO description</label>
          <input id="seo_description" name="seo_description" className="crm-input" defaultValue={c.seo.description} />
        </div>
      </section>
    </>
  );
}
