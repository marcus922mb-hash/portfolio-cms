"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Maximize2 } from "lucide-react";

interface Project {
  id: number;
  title: string;
  category: string;
  tag: string;
  color: string;
  desc: string;
  stack: string[];
  link?: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "Salon Urody Luxe",
    category: "Strona wizytówka",
    tag: "Beauty",
    color: "#1a1207",
    desc: "Elegancka witryna dla salonu urody z systemem rezerwacji online, galerią prac i integracją z Facebookiem.",
    stack: ["Next.js", "Tailwind CSS", "Calendly"],
  },
  {
    id: 2,
    title: "FitMeal Catering",
    category: "Landing Page",
    tag: "Food",
    color: "#071a0a",
    desc: "Konwertująca strona lądowania dla firmy cateringowej z kalkulatorem kalorycznym i formularzem zamówień.",
    stack: ["Next.js", "Framer Motion", "Resend"],
  },
  {
    id: 3,
    title: "AutoDetail Pro",
    category: "Sklep WooCommerce",
    tag: "Automotive",
    color: "#07101a",
    desc: "Sklep z chemią samochodową i akcesoriami detailingowymi. Ponad 200 produktów, system rabatowy.",
    stack: ["WordPress", "WooCommerce", "Stripe"],
  },
  {
    id: 4,
    title: "Kancelaria Nowak",
    category: "Strona firmowa",
    tag: "Legal",
    color: "#160714",
    desc: "Profesjonalna strona kancelarii prawnej z formularzem kontaktowym, chatbotem AI i SEO lokalnym.",
    stack: ["Next.js", "TypeScript", "AI Chat"],
  },
  {
    id: 5,
    title: "Studio Fotografia",
    category: "Portfolio + sklep",
    tag: "Photo",
    color: "#12140a",
    desc: "Galeria portfolio z możliwością zakupu prac i rezerwacji sesji zdjęciowych.",
    stack: ["Next.js", "Cloudinary", "Stripe"],
  },
  {
    id: 6,
    title: "Restauracja Smaki",
    category: "Strona + rezerwacje",
    tag: "HoReCa",
    color: "#140a0a",
    desc: "Strona restauracji z menu, systemem rezerwacji stolików i integracją z Google Maps.",
    stack: ["Next.js", "Tailwind", "OpenTable"],
  },
];

function ProjectCard({ project, onOpen, index, inView }: {
  project: Project;
  onOpen: (p: Project) => void;
  index: number;
  inView: boolean;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      onClick={() => onOpen(project)}
      className="group relative cursor-pointer overflow-hidden border border-white/5 bg-[#111] transition-all duration-500 hover:border-[#D4AF37]/30"
    >
      {/* Thumbnail placeholder */}
      <div
        className="relative h-48 overflow-hidden sm:h-56"
        style={{ background: project.color }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <span
              className="text-[.55rem] font-bold uppercase tracking-[.25em]"
              style={{ color: "#D4AF37" }}
            >
              {project.tag}
            </span>
            <span className="text-3xl font-light text-white/20">{project.title[0]}</span>
          </div>
        </div>
        {/* Overlay on hover */}
        <div className="absolute inset-0 flex items-center justify-center bg-[#0A0A0A]/70 opacity-0 transition-all duration-300 group-hover:opacity-100">
          <span className="flex items-center gap-2 text-[.65rem] font-bold uppercase tracking-widest text-[#D4AF37]">
            <Maximize2 size={14} />
            Zobacz więcej
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <p className="mb-1 text-[.58rem] font-medium uppercase tracking-widest text-[#D4AF37]/70">
          {project.category}
        </p>
        <h3 className="font-light text-lg text-white">{project.title}</h3>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.stack.map((s) => (
            <span key={s} className="border border-white/10 px-2 py-0.5 text-[.56rem] font-medium uppercase tracking-wider text-white/40">
              {s}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

function Modal({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-[#0A0A0A]/85 backdrop-blur-md" />
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl border border-white/10 bg-[#111] p-8 shadow-2xl"
        >
          <button
            onClick={onClose}
            className="absolute right-5 top-5 grid size-8 place-items-center text-white/40 transition hover:text-white"
          >
            <X size={18} />
          </button>

          <p className="mb-2 text-[.62rem] font-bold uppercase tracking-widest text-[#D4AF37]">
            {project.category}
          </p>
          <h2 className="mb-5 text-3xl font-light text-white">{project.title}</h2>

          {/* Preview block */}
          <div
            className="mb-6 flex h-36 items-center justify-center"
            style={{ background: project.color }}
          >
            <span className="text-6xl font-light text-white/10">{project.title[0]}</span>
          </div>

          <p className="mb-6 text-sm leading-8 text-[#A0A0A0]">{project.desc}</p>

          <div className="mb-8 flex flex-wrap gap-2">
            {project.stack.map((s) => (
              <span key={s} className="border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-3 py-1 text-[.6rem] font-medium uppercase tracking-wider text-[#D4AF37]">
                {s}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="border border-white/10 px-5 py-2.5 text-[.65rem] font-bold uppercase tracking-widest text-white/50 transition hover:text-white"
            >
              Zamknij
            </button>
            <a
              href="https://wa.me/48730195530"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#D4AF37] px-5 py-2.5 text-[.65rem] font-bold uppercase tracking-widest text-[#0A0A0A] transition hover:bg-[#f0d878]"
            >
              Chcę podobną
              <ExternalLink size={12} />
            </a>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function Portfolio() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <section id="portfolio" ref={ref} className="bg-[#0D0D0D] px-6 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-4 text-[.65rem] font-bold uppercase tracking-[.22em] text-[#D4AF37]"
          >
            Realizacje
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[clamp(2rem,4vw,3.2rem)] font-light text-white"
          >
            Projekty, które{" "}
            <span style={{
              background: "linear-gradient(90deg, #D4AF37, #f0d878)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              mówią same za siebie.
            </span>
          </motion.h2>
        </div>

        <div className="grid gap-px bg-white/5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <ProjectCard
              key={p.id}
              project={p}
              onOpen={setSelected}
              index={i}
              inView={inView}
            />
          ))}
        </div>
      </div>

      {selected && <Modal project={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
