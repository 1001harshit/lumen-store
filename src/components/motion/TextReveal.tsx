"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";

type TextRevealProps = {
  text: string;
  className?: string;
  delay?: number;
  /** Seconds between each word lifting into place. */
  stagger?: number;
  as?: "h1" | "h2" | "h3" | "p";
};

const LINE: Variants = {
  hidden: {},
  shown: (custom: { delay: number; stagger: number }) => ({
    transition: {
      staggerChildren: custom.stagger,
      delayChildren: custom.delay,
    },
  }),
};

const WORD: Variants = {
  hidden: { y: "110%", rotate: 4 },
  shown: { y: "0%", rotate: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
};

/**
 * Display-type entrance that lifts words out from behind a mask.
 *
 * Each word gets its own overflow-hidden wrapper so the letters appear to rise
 * from an edge rather than simply fading — the mask is what sells it. Words,
 * not characters: per-character staggering on a hero headline reads as a
 * loading bar, and it fragments the line for screen readers.
 *
 * The scroll trigger sits on the *unclipped* container and drives the words
 * through named variants. It cannot sit on the words themselves: an
 * IntersectionObserver clips its ratio by ancestor overflow, so a word hidden
 * inside its own mask reports 0% visible, never crosses the threshold, and
 * never animates out of hiding — a deadlock that leaves the headline blank at
 * every scroll position.
 *
 * The full string is exposed once via sr-only and the animated copy is hidden
 * from the a11y tree, so assistive tech reads one clean sentence.
 */
export function TextReveal({
  text,
  className,
  delay = 0,
  stagger = 0.055,
  as: Tag = "h2",
}: TextRevealProps) {
  const reduced = useReducedMotion();
  const words = text.split(" ");

  if (reduced) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag className={cn("relative", className)}>
      <span className="sr-only">{text}</span>

      <motion.span
        aria-hidden
        className="inline"
        variants={LINE}
        custom={{ delay, stagger }}
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, amount: 0.2 }}
      >
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="inline-block overflow-hidden align-bottom pb-[0.14em]"
          >
            <motion.span variants={WORD} className="inline-block">
              {word}
            </motion.span>
            {i < words.length - 1 && <span className="inline-block">&nbsp;</span>}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
