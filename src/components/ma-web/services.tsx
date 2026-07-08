"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Globe,
  Rocket,
  ShoppingCart,
  Bot,
  Search,
  Headphones,
} from "lucide-react";

const services = [
  {
    icon: Globe,
    title: "Strony Internetowe",
    desc: "Indywidualnie zaprojektowane witryny firmowe, które budują zaufanie i generują zapytania.",
    tag: "Most popular",
  },
  {
    icon: Rocket,
    title: "Landing Page",
    desc: "Zoptymalizowane pod konwersję strony lądowania dla kampanii reklamowych i produktów.",
    tag: null,
  },
  {
    icon: ShoppingCart,
    title: "Sklepy WooCommerce",
    desc: "Pełnofunkcjonalne sklepy online z płatnościami, magazynem i integracjami kurierów.",
    tag: null,
  },
  {
    icon: Bot,
    title: "Automatyzacje AI",
    desc: "Chatboty, automatyczne odpowiedzi i przepływy pracy zasilane przez AI dla Twojego biznesu.",
    tag: "Nowość",
  },
  {
    icon: Search,
    title: "Pozycjonowanie SEO",
    desc: "Techniczna i treściowa optymalizacja, która winduje Twoją stronę na szczyty Google.",
    tag: null,
  },
  {
    icon: Headphones,
    title: "Opieka Techniczna",
    desc: "Stały monitoring, aktualizacje i wsparcie techniczne, abyś mógł skupić się na biznesie.",
    tag: null,
  },
];

export function Services() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="oferta" ref={ref} className="bg-[#0A0A0A] px-6 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 max-w-xl">
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-4 text-[.65rem] font-bold uppercase tracking-[.22em] text-[#D4AF37]"
          >
            Oferta
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[clamp(2rem,4vw,3.2rem)] font-light leading-tight text-white"
          >
            Wszystko czego
            <br />
            <span style={{
              background: "linear-gradient(90deg, #D4AF37, #f0d878)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              potrzebujesz online.
            </span>
          </motion.h2>
        </div>

        {/* Grid */}
        <div className="grid gap-px bg-white/5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <motion.article
                key={svc.title}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                className="group relative overflow-hidden bg-[#0A0A0A] p-8 transition-all duration-500 hover:bg-[#111]"
              >
                {/* Glow on hover */}
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: "radial-gradient(circle at 30% 30%, rgba(212,175,55,0.06), transparent 70%)" }}
                />

                {/* Tag */}
                {svc.tag && (
                  <span className="mb-4 inline-block border border-[#D4AF37]/30 bg-[#D4AF37]/8 px-3 py-1 text-[.55rem] font-bold uppercase tracking-widest text-[#D4AF37]">
                    {svc.tag}
                  </span>
                )}

                {/* Icon */}
                <div className="mb-5 inline-flex size-12 items-center justify-center border border-white/8 bg-white/3 transition-all duration-300 group-hover:border-[#D4AF37]/30 group-hover:bg-[#D4AF37]/8">
                  <Icon size={20} className="text-[#A0A0A0] transition-colors group-hover:text-[#D4AF37]" />
                </div>

                {/* Text */}
                <h3 className="mb-3 font-light text-xl text-white">{svc.title}</h3>
                <p className="text-sm leading-7 text-[#A0A0A0]">{svc.desc}</p>

                {/* Bottom border accent */}
                <div className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-[#D4AF37] to-transparent transition-all duration-500 group-hover:w-full" />
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
