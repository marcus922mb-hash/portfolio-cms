"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CloseIcon, MenuIcon } from "./icons";
import { navItems } from "@/lib/data";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-50 border-b border-line bg-paper/95 backdrop-blur-xl"
      data-testid="site-header"
    >
      <div className="container-page flex h-[72px] items-center justify-between gap-8">
        <Link
          href="/"
          className="group flex items-center gap-3.5"
          aria-label="Braided Digital — strona główna"
          data-testid="site-logo"
        >
          <span className="brand-mark" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="leading-none">
            <span className="block font-serif text-[1.4rem] font-bold uppercase tracking-[.02em] text-ink">
              BRAIDED
            </span>
            <span className="mt-1 block font-mono text-[.52rem] font-medium uppercase tracking-[.36em] text-signal">
              DIGITAL · STUDIO
            </span>
          </span>
        </Link>

        <nav
          className="hidden items-center gap-7 xl:flex"
          aria-label="Główna nawigacja"
          data-testid="main-nav"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${pathname === item.href ? "is-active" : ""}`}
              data-testid={`nav-link-${item.href.replace(/\//g, "")}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/kontakt"
          className="btn-primary hidden min-h-[2.8rem]! lg:inline-flex"
          data-testid="header-contact-cta"
        >
          Zacznijmy projekt
        </Link>

        <div className="hidden xl:block">
          <ThemeToggle />
        </div>

        <button
          type="button"
          className="grid size-11 place-items-center border border-line bg-surface text-ink xl:hidden"
          aria-label={open ? "Zamknij menu" : "Otwórz menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          data-testid="mobile-menu-toggle"
        >
          {open ? <CloseIcon className="size-5" /> : <MenuIcon className="size-5" />}
        </button>
      </div>

      <div
        className={`overflow-hidden border-line bg-paper transition-[max-height,border] duration-500 xl:hidden ${
          open ? "max-h-[620px] border-t" : "max-h-0"
        }`}
        data-testid="mobile-menu"
      >
        <nav className="container-page flex flex-col py-6" aria-label="Mobilna nawigacja">
          {navItems.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between border-b border-line py-4 font-serif text-xl uppercase tracking-tight text-ink"
              data-testid={`mobile-nav-link-${item.href.replace(/\//g, "")}`}
            >
              <span>{item.label}</span>
              <span className="font-mono text-[.62rem] text-signal">0{index + 1}</span>
            </Link>
          ))}
          <Link
            href="/kontakt"
            onClick={() => setOpen(false)}
            className="btn-primary mt-6"
            data-testid="mobile-contact-cta"
          >
            Zacznijmy projekt
          </Link>
          <div className="mt-6 flex items-center justify-between border-t border-line pt-6 font-mono text-[.62rem] uppercase tracking-[.16em] text-muted">
            <span>Motyw</span>
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
