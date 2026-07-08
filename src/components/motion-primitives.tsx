"use client";

import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
  type Variants,
} from "framer-motion";
import type { ReactNode } from "react";

/**
 * Motion helpers for Braided Digital
 * Kept minimal — only shared micro-interaction wrappers.
 */

const easing = [0.22, 0.61, 0.36, 1] as const;

export const containerStagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

export const revealItem: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easing } },
};

export const revealBlock: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easing } },
};

type StaggerAs = "div" | "section" | "ul" | "dl";
type StaggerColumnProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
  className?: string;
  as?: StaggerAs;
};
export function StaggerColumn({
  children,
  className,
  as = "div",
  ...rest
}: StaggerColumnProps) {
  const prefersReduced = useReducedMotion();
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      className={className}
      variants={prefersReduced ? undefined : containerStagger}
      initial={prefersReduced ? undefined : "hidden"}
      whileInView={prefersReduced ? undefined : "visible"}
      viewport={{ once: true, margin: "-80px" }}
      {...rest}
    >
      {children}
    </Comp>
  );
}

type RevealAs = "div" | "article" | "p" | "h1" | "h2" | "span" | "li";
type RevealItemProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
  className?: string;
  as?: RevealAs;
};
export function RevealItem({
  children,
  className,
  as = "div",
  ...rest
}: RevealItemProps) {
  const prefersReduced = useReducedMotion();
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      className={className}
      variants={prefersReduced ? undefined : revealItem}
      {...rest}
    >
      {children}
    </Comp>
  );
}

type RevealBlockAs = "div" | "section" | "article";
type RevealBlockProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
  className?: string;
  as?: RevealBlockAs;
};
export function RevealBlock({
  children,
  className,
  as = "div",
  ...rest
}: RevealBlockProps) {
  const prefersReduced = useReducedMotion();
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      className={className}
      variants={prefersReduced ? undefined : revealBlock}
      initial={prefersReduced ? undefined : "hidden"}
      whileInView={prefersReduced ? undefined : "visible"}
      viewport={{ once: true, margin: "-60px" }}
      {...rest}
    >
      {children}
    </Comp>
  );
}

/**
 * Interactive service row with subtle hover lift.
 * Keeps existing .service-row class semantics but adds motion.
 */
type MotionServiceRowProps = HTMLMotionProps<"a"> & {
  children: ReactNode;
  className?: string;
  href?: string;
};
export function MotionServiceRow({
  children,
  className,
  href,
  ...rest
}: MotionServiceRowProps) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.a
      href={href}
      className={className}
      variants={prefersReduced ? undefined : revealItem}
      whileHover={
        prefersReduced
          ? undefined
          : { x: 6, transition: { duration: 0.4, ease: easing } }
      }
      {...rest}
    >
      {children}
    </motion.a>
  );
}
