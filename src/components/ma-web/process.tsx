"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Konsultacja",
    desc: "Bezpłatna rozmowa o Twojej marce, celach i oczekiwaniach. Razem ustalamy zakres projektu.",
  },
  {
    num: "02",
    title: "Projekt",
    desc: "Tworzę wstępne makiety i propozycję wizualną. Omawiamy szczegóły, aż wszystko będzie idealne.",
  },
  {
    num: "03",
    title: "Kodowanie",
    desc: "Zamieniam projekt w działający kod. Szybki, bezpieczny i gotowy na każde urządzenie.",
  },
  {
    num: "04",
    title: "Testy",
    desc: "Sprawdzam każdy element: wydajność, SEO, formularze, poprawność na wszystkich przeglądarkach.",
  },
  {
    num: "05",
    title: "Publikacja",
    desc: "Wdrożenie na serwer, konfiguracja domeny i przekazanie gotowej strony. Jesteś online.",
  },
];

export function Process() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="bg-[#0A0A0A] px-6 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-4 text-[.65rem] font-bold uppercase tracking-[.22em] text-[#D4AF37]"
          >
            Proces współpracy
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[clamp(2rem,4vw,3.2rem)] font-light text-white"
          >
            Spokojnie.{" "}
            <span style={{
              background: "linear-gradient(90deg, #D4AF37, #f0d878)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Krok po kroku.
            </span>
          </motion.h2>
        </div>

        {/* Steps — horizontal on desktop */}
        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="absolute left-[10%] right-[10%] top-[2.2rem] hidden h-px bg-white/5 lg:block" />
          <motion.div
            className="absolute left-[10%] top-[2.2rem] hidden h-px origin-left bg-gradient-to-r from-[#D4AF37]/60 to-transparent lg:block"
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            style={{ right: "10%" }}
          />

          <div className="grid gap-8 lg:grid-cols-5 lg:gap-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                className="relative flex flex-col items-center text-center lg:px-2"
              >
                {/* Circle number */}
                <div className="relative z-10 mb-5 flex size-[4.5rem] items-center justify-center rounded-full border border-[#D4AF37]/30 bg-[#0A0A0A] transition-all duration-300 hover:border-[#D4AF37] hover:shadow-[0_0_20px_rgba(212,175,55,0.15)]">
                  <span
                    className="text-xl font-light"
                    style={{
                      background: "linear-gradient(135deg, #D4AF37, #f0d878)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {step.num}
                  </span>
                </div>

                <h3 className="mb-3 text-lg font-light text-white">{step.title}</h3>
                <p className="text-[.78rem] leading-6 text-[#A0A0A0]">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
