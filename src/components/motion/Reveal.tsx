"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ElementType, ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";

const TRAVEL: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 28 },
  down: { y: -28 },
  left: { x: 28 },
  right: { x: -28 },
  none: {},
};

type RevealProps = {
  children: ReactNode;
  /** Direction the content travels *from*. */
  direction?: Direction;
  delay?: number;
  duration?: number;
  /** Fraction of the element that must be visible before it fires. */
  amount?: number;
  className?: string;
  as?: ElementType;
};

/**
 * Scroll-triggered entrance. Fires once and stays put — re-animating on every
 * scroll-by reads as a glitch rather than a flourish.
 *
 * Under `prefers-reduced-motion` the element still fades in, but with zero
 * travel: the information that "something new arrived" survives, the movement
 * that causes discomfort does not.
 */
export function Reveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.78,
  amount = 0.25,
  className,
  as = "div",
}: RevealProps) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;
  const offset = reduced ? {} : TRAVEL[direction];

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{
        duration: reduced ? 0.2 : duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </MotionTag>
  );
}

const GROUP: Variants = {
  hidden: {},
  shown: (stagger: number) => ({
    transition: { staggerChildren: stagger, delayChildren: 0.08 },
  }),
};

const ITEM: Variants = {
  hidden: { opacity: 0, y: 24 },
  shown: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.68, ease: [0.16, 1, 0.3, 1] },
  },
};

/**
 * Parent half of a staggered group. Children must be <RevealItem>, which reads
 * the variants by name — that is what lets one parent drive an arbitrary number
 * of cards without threading an index prop through every one.
 */
export function RevealGroup({
  children,
  stagger = 0.075,
  amount = 0.15,
  className,
}: {
  children: ReactNode;
  stagger?: number;
  amount?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={GROUP}
      custom={stagger}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={reduced ? { hidden: { opacity: 0 }, shown: { opacity: 1 } } : ITEM}
    >
      {children}
    </motion.div>
  );
}
