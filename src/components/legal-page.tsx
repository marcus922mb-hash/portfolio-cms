import type { ReactNode } from "react";

export function LegalPage({ eyebrow, title, intro, updated = "24 czerwca 2026", children }: { eyebrow: string; title: string; intro: string; updated?: string; children: ReactNode }) {
  return <><section className="grain bg-ink text-white"><div className="container-page py-20 md:py-28"><p className="eyebrow">{eyebrow}</p><h1 className="display mt-7 max-w-4xl text-[clamp(3.3rem,8vw,7rem)]">{title}</h1><p className="mt-7 max-w-2xl text-sm leading-7 text-white/55">{intro}</p><p className="mt-5 text-[.58rem] uppercase tracking-[.16em] text-gold-light">Ostatnia aktualizacja: {updated}</p></div></section><section className="section-space"><div className="container-page"><article className="legal-copy mx-auto max-w-4xl">{children}</article></div></section></>;
}
