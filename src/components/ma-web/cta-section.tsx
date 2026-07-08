"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

export function CtaSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="kontakt" ref={ref} className="relative overflow-hidden bg-[#0A0A0A] px-6 py-28 md:py-36">
      {/* Gold glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "60vw",
          height: "60vw",
          background: "radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 70%)",
        }}
      />
      {/* Top border accent */}
      <div className="absolute left-[20%] right-[20%] top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />

      <div className="relative mx-auto max-w-4xl text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-5 text-[.65rem] font-bold uppercase tracking-[.22em] text-[#D4AF37]"
        >
          Zacznijmy współpracę
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-[clamp(2.5rem,5.5vw,5rem)] font-light leading-[1.05] text-white"
        >
          Gotowy na stronę,
          <br />
          <span
            style={{
              background: "linear-gradient(90deg, #D4AF37 0%, #f0d878 50%, #D4AF37 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            która przynosi efekty?
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mx-auto mt-7 max-w-xl text-base leading-8 text-[#A0A0A0]"
        >
          Napisz do nas lub sprawdź bezpłatną wycenę online. Pierwsza osoba
          otrzymuje realizację za darmo — płacisz tylko za domenę i hosting.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Link
            href="/wycena"
            className="group flex items-center gap-2 bg-[#D4AF37] px-8 py-4 text-[.72rem] font-bold uppercase tracking-[.14em] text-[#0A0A0A] transition-all hover:bg-[#f0d878]"
          >
            Darmowa wycena
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href="https://wa.me/48730195530"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 border border-white/20 px-8 py-4 text-[.72rem] font-bold uppercase tracking-[.14em] text-white/80 transition-all hover:border-[#D4AF37]/50 hover:text-white"
          >
            <MessageCircle size={15} />
            WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  );
}
