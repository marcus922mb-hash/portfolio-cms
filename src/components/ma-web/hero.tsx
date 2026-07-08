"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";

function GoldLines() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="absolute left-[-10%] h-px w-[120%]"
          style={{
            top: `${12 + i * 19}%`,
            background:
              "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.15) 40%, rgba(212,175,55,0.30) 50%, rgba(212,175,55,0.15) 60%, transparent 100%)",
            transform: "rotate(-12deg)",
            animation: `shimmer ${4 + i * 0.6}s ${i * 0.5}s ease-in-out infinite`,
          }}
        />
      ))}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "70vw",
          height: "70vw",
          background: "radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute right-0 top-0 h-64 w-64 opacity-30"
        style={{ background: "radial-gradient(circle at top right, rgba(212,175,55,0.18), transparent 70%)" }}
      />
    </div>
  );
}

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0A0A0A] px-6 text-center"
    >
      <style>{`
        @keyframes shimmer {
          0%, 100% { opacity: 0.4; transform: rotate(-12deg) translateX(-5%); }
          50%       { opacity: 1;   transform: rotate(-12deg) translateX(5%); }
        }
      `}</style>

      <GoldLines />

      <div className="relative z-10 mx-auto max-w-5xl">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease }}
          className="mx-auto mb-8 inline-flex items-center gap-2 border border-[#D4AF37]/30 bg-[#D4AF37]/5 px-4 py-2"
        >
          <span className="size-1.5 rounded-full bg-[#D4AF37]" />
          <span className="text-[.62rem] font-bold uppercase tracking-[.18em] text-[#D4AF37]">
            Studio Web &amp; AI
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease }}
          className="text-[clamp(3rem,7.5vw,6.5rem)] font-light leading-[.95] tracking-tight text-white"
        >
          Tworzymy strony,
          <br />
          <span
            className="font-normal"
            style={{
              background: "linear-gradient(90deg, #D4AF37 0%, #f0d878 50%, #D4AF37 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            które zarabiają.
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease }}
          className="mx-auto mt-8 max-w-2xl text-base leading-8 text-[#A0A0A0] md:text-lg"
        >
          Nowoczesne strony internetowe, sklepy WooCommerce oraz automatyzacje AI
          stworzone z myślą o rozwoju Twojej firmy.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65, ease }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Link
            href="/wycena"
            className="group flex items-center gap-2 bg-[#D4AF37] px-8 py-4 text-[.72rem] font-bold uppercase tracking-[.14em] text-[#0A0A0A] transition-all hover:bg-[#f0d878]"
          >
            Darmowa wycena
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <button
            onClick={() => {
              document.querySelector("#portfolio")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="flex items-center gap-2 border border-white/20 px-8 py-4 text-[.72rem] font-bold uppercase tracking-[.14em] text-white/80 transition-all hover:border-white/50 hover:text-white"
          >
            Zobacz realizacje
          </button>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8, ease }}
          className="mt-12 flex items-center justify-center gap-6 text-[.62rem] uppercase tracking-widest text-white/30"
        >
          <span>+50 projektów</span>
          <span className="size-1 rounded-full bg-[#D4AF37]/40" />
          <span>99% zadowolonych</span>
          <span className="size-1 rounded-full bg-[#D4AF37]/40" />
          <span>SEO Ready</span>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        onClick={() => document.querySelector("#statystyki")?.scrollIntoView({ behavior: "smooth" })}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 transition hover:text-[#D4AF37]"
        aria-label="Przewiń w dół"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
        >
          <ChevronDown size={24} />
        </motion.div>
      </motion.button>
    </section>
  );
}
