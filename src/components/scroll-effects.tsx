"use client";

import { useEffect } from "react";

export function ScrollEffects() {
  useEffect(() => {
    const root = document.documentElement;
    const progress = document.querySelector<HTMLElement>("[data-scroll-progress]");
    const revealTargets = document.querySelectorAll<HTMLElement>("[data-reveal]");

    revealTargets.forEach((element) => {
      const siblings = Array.from(
        element.parentElement?.querySelectorAll(":scope > [data-reveal]") ?? []
      );
      const idx = siblings.indexOf(element);
      element.classList.add("scroll-reveal");
      element.style.setProperty("--reveal-delay", `${Math.min(idx, 5) * 80}ms`);
    });

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }),
      { rootMargin: "0px 0px -8%", threshold: 0.08 },
    );
    revealTargets.forEach((element) => observer.observe(element));

    const updateScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progress) progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
      root.style.setProperty("--scroll-y", `${y}px`);
    };
    const updatePointer = (event: PointerEvent) => {
      root.style.setProperty("--pointer-x", `${event.clientX}px`);
      root.style.setProperty("--pointer-y", `${event.clientY}px`);
    };
    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("pointermove", updatePointer, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("pointermove", updatePointer);
    };
  }, []);

  return null;
}
