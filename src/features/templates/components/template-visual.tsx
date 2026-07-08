import Image from "next/image";
import { ArrowUpRight, Check, ShoppingBag } from "lucide-react";
import type { TemplateDefinition } from "@/features/templates/types";

export function TemplateVisual({
  template,
  compact = false,
}: {
  template: TemplateDefinition;
  compact?: boolean;
}) {
  if (template.websiteType === "link-in-bio") {
    return <LinkInBioVisual template={template} compact={compact} />;
  }

  const images = template.previewImages;
  const isShop =
    template.websiteType === "mini-shop" ||
    template.websiteType === "online-shop";

  return (
    <div
      className={`tpl-visual${compact ? " is-compact" : ""}`}
      style={templateVariables(template)}
    >
      <BrowserBar template={template} />
      <div className="tpl-site-nav">
        <strong>{template.name}</strong>
        <div>
          <span>{isShop ? "Sklep" : "O nas"}</span>
          <span>{isShop ? "Nowości" : "Oferta"}</span>
          <span>{isShop ? "Kolekcje" : "Realizacje"}</span>
          <span>Kontakt</span>
        </div>
        {isShop ? <ShoppingBag className="tpl-site-cart" size={14} /> : null}
      </div>

      <section className="tpl-site-hero">
        <div className="tpl-site-copy">
          <small>{template.copy.eyebrow}</small>
          <h3>{template.copy.heroTitle}</h3>
          <p>{template.copy.heroSubtitle}</p>
          <span className="tpl-site-cta">
            {isShop ? "Zobacz kolekcję" : "Poznaj ofertę"}{" "}
            <ArrowUpRight size={10} />
          </span>
        </div>
        <div className="tpl-site-image">
          <Image
            src={images[0]}
            alt={`${template.name} — zdjęcie główne`}
            fill
            sizes={compact ? "(max-width: 900px) 100vw, 45vw" : "55vw"}
          />
          <span>PEXELS / LIBRARY IMAGE</span>
        </div>
      </section>

      {compact ? (
        <div className="tpl-site-ticker">
          {template.copy.services.map((service) => (
            <span key={service}>{service}</span>
          ))}
        </div>
      ) : (
        <FullTemplateBody template={template} isShop={isShop} />
      )}
    </div>
  );
}

function FullTemplateBody({
  template,
  isShop,
}: {
  template: TemplateDefinition;
  isShop: boolean;
}) {
  const images = template.previewImages;
  return (
    <>
      <div className="tpl-site-trust">
        <small>Zaufali nam</small>
        {["Studio Forma", "Local & Co.", "Atelier 24", "Dobra Marka"].map(
          (name) => <span key={name}>{name}</span>
        )}
      </div>

      {isShop ? (
        <section className="tpl-site-products">
          <div className="tpl-site-section-heading">
            <small>{template.websiteType === "mini-shop" ? "Mała kolekcja" : "Bestsellery"}</small>
            <h4>Produkty wybrane dla Ciebie</h4>
          </div>
          <div className="tpl-site-product-grid">
            {images.slice(0, 4).map((image, index) => (
              <article key={image}>
                <div>
                  <Image
                    src={image}
                    alt={`Produkt ${index + 1}`}
                    fill
                    sizes="25vw"
                  />
                </div>
                <strong>{template.copy.services[index % template.copy.services.length]}</strong>
                <span>{[89, 119, 149, 189][index]} zł</span>
              </article>
            ))}
          </div>
        </section>
      ) : (
        <div className="tpl-site-ticker">
          {template.copy.services.map((service) => (
            <span key={service}>{service}</span>
          ))}
        </div>
      )}

      <section className="tpl-site-about">
        <div className="tpl-site-about-image">
          <Image
            src={images[1]}
            alt={`${template.name} — o marce`}
            fill
            sizes="48vw"
          />
        </div>
        <div>
          <small>O nas</small>
          <h4>{template.copy.aboutTitle}</h4>
          <p>{template.copy.aboutText}</p>
          <ul>
            {["Indywidualne podejście", "Jasny proces współpracy", "Dbałość o każdy detal"].map(
              (item) => <li key={item}><Check size={11} /> {item}</li>
            )}
          </ul>
        </div>
      </section>

      <section className="tpl-site-services">
        <div className="tpl-site-section-heading">
          <small>{isShop ? "Kategorie" : "Co robimy"}</small>
          <h4>{isShop ? "Znajdź swoją kolekcję" : "Kompleksowe usługi"}</h4>
        </div>
        <div>
          {template.copy.services.map((service, index) => (
            <article key={service}>
              <span>0{index + 1}</span>
              <h5>{service}</h5>
              <p>
                Konkretna, dopracowana propozycja dopasowana do potrzeb klienta.
              </p>
              <small>Dowiedz się więcej →</small>
            </article>
          ))}
        </div>
      </section>

      <section className="tpl-site-wide-cta">
        <div>
          <small>Porozmawiajmy o Twoim projekcie</small>
          <h4>{template.copy.ctaTitle}</h4>
        </div>
        <span>Zapytaj o ofertę <ArrowUpRight size={10} /></span>
      </section>

      <section className="tpl-site-gallery">
        <div className="tpl-site-section-heading">
          <small>{isShop ? "Kolekcja" : "Realizacje"}</small>
          <h4>{isShop ? "Produkty w codziennym użyciu" : "Zobacz nasze projekty"}</h4>
        </div>
        <div>
          {images.map((image, index) => (
            <figure key={`${image}-${index}`}>
              <Image
                src={image}
                alt={`${template.name} — galeria ${index + 1}`}
                fill
                sizes="33vw"
              />
            </figure>
          ))}
        </div>
      </section>

      <section className="tpl-site-testimonials">
        <small>Opinie klientów</small>
        <h4>Co mówią o współpracy</h4>
        <div>
          {[
            "Profesjonalnie, sprawnie i z bardzo dobrym kontaktem.",
            "Efekt jest jeszcze lepszy, niż zakładaliśmy na początku.",
            "Każdy etap był jasny, a całość dopracowana w detalach.",
          ].map((quote, index) => (
            <blockquote key={quote}>
              “{quote}”
              <cite>{["Anna K.", "Michał R.", "Karolina M."][index]}</cite>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="tpl-site-contact">
        <div>
          <small>Kontakt</small>
          <h4>Opowiedz nam, czego potrzebujesz.</h4>
          <p>Odpowiemy z konkretną propozycją kolejnego kroku.</p>
        </div>
        <div className="tpl-site-form">
          <span>Imię i nazwisko</span>
          <span>Adres e-mail</span>
          <span>Wiadomość</span>
          <b>Wyślij wiadomość</b>
        </div>
      </section>

      <footer className="tpl-site-footer">
        <strong>{template.name}</strong>
        <span>Oferta · Realizacje · FAQ · Kontakt</span>
        <small>© 2026 Wszystkie prawa zastrzeżone.</small>
      </footer>
    </>
  );
}

function LinkInBioVisual({
  template,
  compact,
}: {
  template: TemplateDefinition;
  compact: boolean;
}) {
  return (
    <div
      className={`tpl-visual tpl-visual--bio${compact ? " is-compact" : ""}`}
      style={templateVariables(template)}
    >
      <BrowserBar template={template} />
      <div className="tpl-bio-surface">
        <div className="tpl-bio-avatar">
          <Image
            src={template.previewImages[0]}
            alt={template.name}
            fill
            sizes="160px"
          />
        </div>
        <small>{template.copy.eyebrow}</small>
        <h3>{template.name}</h3>
        <p>{template.copy.aboutText}</p>
        <div>
          {template.copy.services.map((service) => (
            <span key={service}>{service}<ArrowUpRight size={10} /></span>
          ))}
        </div>
        <footer>Instagram · TikTok · Facebook</footer>
      </div>
    </div>
  );
}

function BrowserBar({ template }: { template: TemplateDefinition }) {
  return (
    <div className="tpl-browser-bar">
      <span /><span /><span />
      <div>{template.id}.studio</div>
    </div>
  );
}

function templateVariables(template: TemplateDefinition) {
  return {
    "--tpl-primary": template.colors.primary,
    "--tpl-secondary": template.colors.secondary,
    "--tpl-accent": template.colors.accent,
    "--tpl-neutral": template.colors.neutral,
    "--tpl-dark": template.colors.dark,
    "--tpl-light": template.colors.light,
  } as React.CSSProperties;
}
