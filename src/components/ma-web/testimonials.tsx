"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Katarzyna W.",
    role: "Właścicielka salonu urody",
    text: "Moja nowa strona to strzał w dziesiątkę. Klientki mówią, że wypieka się profesjonalnie i elegancko — dokładnie to chciałam osiągnąć. Rezerwacje przez stronę wzrosły o 40% w pierwszym miesiącu!",
    rating: 5,
  },
  {
    name: "Tomasz M.",
    role: "Właściciel sklepu detailingowego",
    text: "Sklep działa super sprawnie, zamówienia spływają automatycznie, a klienci chwalą czytelność i szybkość strony. Szczerze polecam — cena adekwatna do jakości.",
    rating: 5,
  },
  {
    name: "Anna K.",
    role: "Coach biznesowy",
    text: "Zamówiłam landing page pod swój kurs online. Efekt przeszedł moje oczekiwania — konwersja jest dużo lepsza niż na poprzedniej stronie. Współpraca była bezproblemowa.",
    rating: 5,
  },
  {
    name: "Michał P.",
    role: "Fotograf",
    text: "Potrzebowałem portfolio, które zrobi wrażenie. Dostałem właśnie to. Strona ładuje się błyskawicznie, wygląda obłędnie na telefonie i w końcu pojawiłem się w Google.",
    rating: 5,
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="text-[#D4AF37]" style={{ fontSize: "0.75rem" }}>★</span>
      ))}
    </div>
  );
}

export function Testimonials() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setDir(1);
      setActive((a) => (a + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  function go(next: number) {
    setDir(next > active ? 1 : -1);
    setActive((next + testimonials.length) % testimonials.length);
  }

  const t = testimonials[active];

  return (
    <section id="opinie" ref={ref} className="bg-[#0A0A0A] px-6 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-14 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-4 text-[.65rem] font-bold uppercase tracking-[.22em] text-[#D4AF37]"
          >
            Opinie klientów
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[clamp(2rem,4vw,3.2rem)] font-light text-white"
          >
            Co mówią{" "}
            <span style={{
              background: "linear-gradient(90deg, #D4AF37, #f0d878)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              nasi klienci.
            </span>
          </motion.h2>
        </div>

        {/* Slider */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative overflow-hidden border border-white/8 bg-[#0D0D0D] p-8 md:p-12"
        >
          {/* Gold quote icon */}
          <div className="mb-6 text-[#D4AF37]/20">
            <Quote size={48} />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: dir * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -dir * 40 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            >
              <p className="mb-8 text-lg font-light leading-9 text-white/85 md:text-xl">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-white">{t.name}</p>
                  <p className="text-sm text-[#A0A0A0]">{t.role}</p>
                </div>
                <Stars count={t.rating} />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between">
            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => go(i)}
                  aria-label={`Opinia ${i + 1}`}
                  className="h-px transition-all duration-300"
                  style={{
                    width: i === active ? "2rem" : "1rem",
                    background: i === active ? "#D4AF37" : "rgba(255,255,255,0.2)",
                  }}
                />
              ))}
            </div>

            {/* Arrows */}
            <div className="flex gap-2">
              <button
                onClick={() => go(active - 1)}
                aria-label="Poprzednia"
                className="grid size-9 place-items-center border border-white/10 text-white/40 transition hover:border-[#D4AF37]/40 hover:text-[#D4AF37]"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => go(active + 1)}
                aria-label="Następna"
                className="grid size-9 place-items-center border border-white/10 text-white/40 transition hover:border-[#D4AF37]/40 hover:text-[#D4AF37]"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
