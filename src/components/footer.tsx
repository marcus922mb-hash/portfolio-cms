import Link from "next/link";
import { Arrow, WhatsAppIcon } from "./icons";
import { navItems } from "@/lib/data";
import { CookieSettingsButton } from "./cookie-settings-button";

export function Footer() {
  return (
    <footer
      className="relative border-t border-line bg-paper text-ink"
      data-testid="site-footer"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(60% 60% at 10% 10%, rgba(255,51,0,.12), transparent 65%)",
        }}
      />
      <div className="container-page relative py-20 md:py-24">
        {/* Big top row */}
        <div className="grid gap-10 border-b border-line pb-12 lg:grid-cols-[1.4fr_1fr_1fr] lg:pb-14">
          <div>
            <p className="mono text-signal">Studio</p>
            <p className="mt-5 font-serif text-4xl uppercase tracking-tight text-ink md:text-5xl">
              Braided <span className="text-signal">Digital</span>
            </p>
            <p className="mt-6 max-w-md text-sm leading-7 text-muted">
              Projektuję i wdrażam strony dla małych firm. Rozmawiasz bezpośrednio ze mną, od pierwszej wiadomości do publikacji.
            </p>
            <p className="mt-6 font-mono text-[.62rem] uppercase tracking-[.18em] text-sub">
              Marek Białkowski · Founder
            </p>
            <div className="mt-8 flex flex-col items-start gap-3">
              <a
                href="https://wa.me/48730195530"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 border border-line px-4 py-3 text-sm text-ink transition hover:border-signal hover:text-signal"
                data-testid="footer-whatsapp"
              >
                <WhatsAppIcon className="size-5" /> +48 730 195 530
              </a>
              <a
                href="mailto:ma.atelier.kontakt@gmail.com"
                className="text-sm text-muted transition hover:text-ink"
                data-testid="footer-email"
              >
                ma.atelier.kontakt@gmail.com
              </a>
              <p className="font-mono text-[.62rem] uppercase tracking-[.14em] text-sub">
                Chylin 35 · 62-710 Władysławów
              </p>
            </div>
          </div>

          <div>
            <p className="mb-6 mono text-signal">Nawigacja</p>
            <div className="grid gap-3">
              {navItems.slice(0, 5).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center justify-between border-b border-line/60 py-2 text-sm text-ink transition hover:border-signal hover:text-signal"
                  data-testid={`footer-nav-${item.href.replace(/\//g, "")}`}
                >
                  <span>{item.label}</span>
                  <span className="font-mono text-[.6rem] opacity-0 transition group-hover:opacity-100">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-6 mono text-signal">Zacznijmy</p>
            <Link
              href="/kontakt"
              className="group flex items-center justify-between border-b border-line pb-4 font-serif text-2xl uppercase tracking-tight text-ink transition hover:text-signal"
              data-testid="footer-contact-cta"
            >
              Napisz kilka zdań
              <Arrow className="size-5 transition group-hover:translate-x-1" />
            </Link>
            <Link
              href="/wycena"
              className="mt-5 block text-sm text-muted transition hover:text-ink"
              data-testid="footer-estimate-cta"
            >
              Lub policz orientacyjny budżet online →
            </Link>

            <div className="mt-10 border border-line bg-surface p-5">
              <p className="mono text-signal">Status</p>
              <p className="mt-3 font-serif text-lg uppercase tracking-tight text-ink">
                Wolne miejsca w kolejce
              </p>
              <p className="mt-2 text-xs text-muted">
                Start nowego projektu w 1–3 tygodnie.
              </p>
            </div>
          </div>
        </div>

        {/* Massive brand mark */}
        <div className="hidden select-none border-b border-line py-10 md:block">
          <p
            className="font-serif text-[clamp(4rem,14vw,14rem)] font-bold uppercase leading-[.85] tracking-[-.06em] text-ink"
            aria-hidden="true"
          >
            BRAIDED<span className="text-signal">.</span>
          </p>
        </div>

        {/* Bottom row */}
        <div className="mt-8 flex flex-col gap-4 pt-2 font-mono text-[.6rem] uppercase tracking-[.14em] text-sub lg:flex-row lg:items-center lg:justify-between">
          <p>© {new Date().getFullYear()} Braided Digital · All rights reserved</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/regulamin" className="transition hover:text-ink" data-testid="footer-terms">
              Regulamin
            </Link>
            <Link href="/polityka-prywatnosci" className="transition hover:text-ink" data-testid="footer-privacy">
              Prywatność
            </Link>
            <Link href="/polityka-cookies" className="transition hover:text-ink" data-testid="footer-cookies">
              Cookies
            </Link>
            <CookieSettingsButton />
          </div>
        </div>
      </div>
    </footer>
  );
}
