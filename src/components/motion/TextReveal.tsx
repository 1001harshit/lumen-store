"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type TextRevealProps = {
  text: string;
  className?: string;
  delay?: number;
  /** Seconds between each word lifting into place. */
  stagger?: number;
  as?: "h1" | "h2" | "h3" | "p";
};

/**
 * Display-type entrance that lifts words out from behind a mask.
 *
 * Each word gets its own overflow-hidden wrapper so the letters appear to rise
 * from an edge rather than simply fading — the mask is what sells it. Words,
 * not characters: per-character staggering on a hero headline reads as a
 * loading bar, and it fragments the line for screen readers.
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
      <span aria-hidden className="inline">
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="inline-block overflow-hidden align-bottom pb-[0.12em]"
          >
            <motion.span
              className="inline-block"
              initial={{ y: "110%", rotate: 4 }}
              whileInView={{ y: "0%", rotate: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{
                duration: 0.9,
                delay: delay + i * stagger,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {word}
            </motion.span>
            {i < words.length - 1 && <span className="inline-block">&nbsp;</span>}
          </span>
        ))}
      </span>
    </Tag>
  );
}
