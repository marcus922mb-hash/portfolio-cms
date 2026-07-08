"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const items = [
  { value: 50, suffix: "+", label: "Projektów" },
  { value: 99, suffix: "%", label: "Zadowolonych klientów" },
  { value: 24, suffix: "h", label: "Wsparcie techniczne" },
  { value: 100, suffix: "%", label: "SEO Ready" },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 1600;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * value));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}{suffix}
    </span>
  );
}

export function Stats() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="statystyki" ref={ref} className="border-y border-white/5 bg-[#0D0D0D]">
      <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-white/5 md:grid-cols-4">
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="flex flex-col items-center justify-center gap-2 px-6 py-10 md:py-12"
          >
            <span
              className="text-[2.8rem] font-light leading-none tracking-tight md:text-[3.5rem]"
              style={{
                background: "linear-gradient(135deg, #D4AF37 0%, #f0d878 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              <Counter value={item.value} suffix={item.suffix} />
            </span>
            <span className="text-center text-[.65rem] font-medium uppercase tracking-[.14em] text-[#A0A0A0]">
              {item.label}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
