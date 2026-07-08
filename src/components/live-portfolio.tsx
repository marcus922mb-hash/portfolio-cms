"use client";

import { useState } from "react";

export function LivePortfolio() {
  const [loaded, setLoaded] = useState(false);
  return (
    <div
      className="overflow-hidden border border-line bg-surface shadow-2xl"
      style={{ boxShadow: "-14px 14px 0 var(--signal)" }}
      data-testid="live-portfolio"
    >
      <div className="flex h-9 items-center gap-2 border-b border-line bg-surface-2 px-4">
        <span className="size-2.5 rounded-full bg-line-strong" style={{ background: "var(--line-strong)" }} />
        <span className="size-2.5 rounded-full" style={{ background: "var(--line-strong)" }} />
        <span className="size-2.5 rounded-full" style={{ background: "var(--signal)" }} />
        <span
          className="mx-auto rounded-none border border-line px-12 py-1 font-mono text-[.5rem] uppercase tracking-[.14em] md:px-24"
          style={{ color: "var(--muted)" }}
        >
          ma-atelier.pl
        </span>
      </div>
      {loaded ? (
        <iframe
          src="https://ma-atelier.pl"
          title="Aktualny podgląd strony MA Atelier"
          className="h-[470px] w-full md:h-[650px]"
          style={{ background: "#fff" }}
        />
      ) : (
        <div
          className="grid h-[470px] place-items-center bg-surface px-6 text-center md:h-[650px]"
          style={{
            backgroundImage:
              "radial-gradient(60% 60% at 50% 40%, rgba(255,51,0,.08), transparent 60%)",
          }}
        >
          <div className="max-w-md">
            <p className="eyebrow mx-auto w-fit">Zewnętrzna zawartość</p>
            <h3 className="mt-5 font-serif text-4xl uppercase tracking-tight text-ink">
              Podgląd MA Atelier<br />na żywo
            </h3>
            <p className="mt-5 text-sm leading-7 text-muted">
              Po uruchomieniu przeglądarka połączy się z ma-atelier.pl. Ta zewnętrzna strona
              może korzystać z własnych plików cookies i narzędzi analitycznych.
            </p>
            <button
              type="button"
              onClick={() => setLoaded(true)}
              className="btn-primary mt-8"
              data-testid="live-portfolio-load"
            >
              Uruchom podgląd 1:1
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
