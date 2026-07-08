import Link from "next/link";

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}
function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.82a8.18 8.18 0 0 0 4.78 1.53V6.9a4.85 4.85 0 0 1-1.01-.21z" />
    </svg>
  );
}

const links = [
  { label: "Oferta", href: "#oferta" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Opinie", href: "#opinie" },
  { label: "Wycena", href: "/wycena" },
];

export function MaFooter() {
  return (
    <footer className="border-t border-white/5 bg-[#060606] px-6 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 md:flex-row md:justify-between">
        {/* Logo */}
        <div className="flex flex-col items-center gap-1 md:items-start">
          <span className="text-[.9rem] font-light tracking-[.4em] text-white">MA ATELIER</span>
          <span className="text-[.5rem] tracking-[.38em] text-[#D4AF37]">WEB STUDIO</span>
        </div>

        {/* Nav */}
        <nav>
          <ul className="flex flex-wrap justify-center gap-x-7 gap-y-2">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-[.62rem] font-medium uppercase tracking-[.12em] text-white/40 transition hover:text-[#D4AF37]"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Socials */}
        <div className="flex gap-3">
          {[
            { href: "https://www.facebook.com/profile.php?id=61576888994040", Icon: FacebookIcon, label: "Facebook" },
            { href: "https://www.instagram.com/ma.atelierr/", Icon: InstagramIcon, label: "Instagram" },
            { href: "https://www.tiktok.com/@ma.atelierr", Icon: TikTokIcon, label: "TikTok" },
          ].map(({ href, Icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="grid size-9 place-items-center border border-white/10 text-white/40 transition hover:border-[#D4AF37]/40 hover:text-[#D4AF37]"
            >
              <Icon />
            </a>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-7xl flex-col items-center gap-1 border-t border-white/5 pt-6 text-center sm:flex-row sm:justify-between">
        <p className="text-[.58rem] text-white/25">
          &copy; {new Date().getFullYear()} MA Atelier Web Studio. Wszelkie prawa zastrzeżone.
        </p>
        <div className="flex gap-5">
          <Link href="/polityka-prywatnosci" className="text-[.58rem] text-white/25 transition hover:text-white/50">
            Polityka prywatności
          </Link>
          <Link href="/regulamin" className="text-[.58rem] text-white/25 transition hover:text-white/50">
            Regulamin
          </Link>
        </div>
      </div>
    </footer>
  );
}
