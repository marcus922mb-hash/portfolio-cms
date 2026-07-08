"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const links = [
  { label: "Strona główna", href: "#hero" },
  { label: "Oferta", href: "#oferta" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Opinie", href: "#opinie" },
  { label: "Kontakt", href: "#kontakt" },
];

export function MaNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollTo(href: string) {
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/5 bg-[#0A0A0A]/90 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6 lg:px-12">
        {/* Logo */}
        <button
          onClick={() => scrollTo("#hero")}
          className="flex flex-col items-start leading-none"
        >
          <span className="text-base font-light tracking-[.35em] text-white">MA ATELIER</span>
          <span className="text-[.52rem] tracking-[.4em] text-[#D4AF37]">WEB STUDIO</span>
        </button>

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <button
                onClick={() => scrollTo(l.href)}
                className="text-[.68rem] font-medium uppercase tracking-[.12em] text-white/60 transition-colors hover:text-[#D4AF37]"
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="hidden items-center gap-4 lg:flex">
          <Link
            href="/wycena"
            className="border border-[#D4AF37] px-5 py-2.5 text-[.65rem] font-bold uppercase tracking-[.14em] text-[#D4AF37] transition-all hover:bg-[#D4AF37] hover:text-[#0A0A0A]"
          >
            Darmowa wycena
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="grid size-10 place-items-center text-white lg:hidden"
          aria-label="Menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-white/5 bg-[#0A0A0A]/95 backdrop-blur-xl lg:hidden"
          >
            <ul className="flex flex-col px-6 py-5 gap-1">
              {links.map((l) => (
                <li key={l.href}>
                  <button
                    onClick={() => scrollTo(l.href)}
                    className="block w-full py-3 text-left text-sm font-medium tracking-widest text-white/70 transition hover:text-[#D4AF37]"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
              <li className="mt-4">
                <Link
                  href="/wycena"
                  onClick={() => setOpen(false)}
                  className="block border border-[#D4AF37] px-5 py-3 text-center text-xs font-bold uppercase tracking-widest text-[#D4AF37]"
                >
                  Darmowa wycena
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
