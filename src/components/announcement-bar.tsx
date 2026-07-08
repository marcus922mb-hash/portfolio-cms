import Link from "next/link";
import { Arrow } from "./icons";

export function AnnouncementBar() {
  return (
    <div className="bg-gold px-4 py-2.5 text-center text-white">
      <p className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[.65rem] font-bold uppercase tracking-[.12em]">
        <span className="opacity-80">Oferta specjalna</span>
        <span>·</span>
        <span>Realizacja strony dla pierwszej osoby — GRATIS</span>
        <span className="opacity-80">· płacisz tylko domenę i hosting</span>
        <Link
          href="/wycena"
          className="inline-flex items-center gap-1 underline underline-offset-2 transition hover:opacity-80"
        >
          Sprawdź wycenę <Arrow className="size-3" />
        </Link>
      </p>
    </div>
  );
}
