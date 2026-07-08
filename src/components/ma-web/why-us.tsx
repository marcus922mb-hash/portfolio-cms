"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";

const benefits = [
  { text: "Indywidualny projekt, żaden nie jest kopią" },
  { text: "Szybkie działanie — PageSpeed 90+" },
  { text: "SEO od pierwszej linii kodu" },
  { text: "W pełni responsywna na każdym urządzeniu" },
  { text: "Bez abonamentu — zapłacisz raz" },
  { text: "Wsparcie techniczne po wdrożeniu" },
];

export function WhyUs() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="bg-[#0D0D0D] px-6 py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2 lg:gap-24">
        {/* Left */}
        <div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-5 text-[.65rem] font-bold uppercase tracking-[.22em] text-[#D4AF37]"
          >
            Dlaczego my
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[clamp(2.2rem,4.5vw,3.6rem)] font-light leading-[1.1] text-white"
          >
            Pokaż swoją firmę
            <br />
            z najlepszej{" "}
            <span style={{
              background: "linear-gradient(90deg, #D4AF37, #f0d878)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              strony.
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-md text-sm leading-8 text-[#A0A0A0]"
          >
            Nie wciskamy Twojej marki w gotowy szablon. Każdy projekt powstaje
            od zera — z myślą o Twoich klientach i celach biznesowych.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mt-8"
          >
            <Link
              href="/wycena"
              className="group inline-flex items-center gap-2 border border-[#D4AF37] px-6 py-3.5 text-[.68rem] font-bold uppercase tracking-[.14em] text-[#D4AF37] transition-all hover:bg-[#D4AF37] hover:text-[#0A0A0A]"
            >
              Bezpłatna wycena
            </Link>
          </motion.div>
        </div>

        {/* Right — benefits */}
        <div className="space-y-3">
          {benefits.map((b, i) => (
            <motion.div
              key={b.text}
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.07, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              className="group flex items-start gap-4 border border-white/5 bg-white/2 px-5 py-4 transition-all hover:border-[#D4AF37]/20 hover:bg-[#D4AF37]/3"
            >
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/15">
                <Check size={11} className="text-[#D4AF37]" />
              </span>
              <span className="text-sm text-[#A0A0A0] transition-colors group-hover:text-white">
                {b.text}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
