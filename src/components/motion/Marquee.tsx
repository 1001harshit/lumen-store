"use client";

import { motion, useReducedMotion } from "motion/react";
import { Children, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type MarqueeProps = {
  children: ReactNode;
  /** Seconds for one full pass. Larger is slower. */
  duration?: number;
  reverse?: boolean;
  /** Pause on hover so a reader can actually finish a quote. */
  pauseOnHover?: boolean;
  className?: string;
};

/**
 * Seamless horizontal ticker.
 *
 * The track is rendered twice and translated by exactly -50%, which is what
 * makes the loop seamless: at the moment the animation resets, copy two sits
 * precisely where copy one began. Any other distance produces a visible jump.
 *
 * The duplicate is aria-hidden so screen readers get the content once, and the
 * whole strip is skipped entirely under reduced motion in favour of a static,
 * scrollable row — an endlessly moving band is unreadable for many people.
 */
export function Marquee({
  children,
  duration = 32,
  reverse = false,
  pauseOnHover = true,
  className,
}: MarqueeProps) {
  const reduced = useReducedMotion();
  const items = Children.toArray(children);

  if (reduced) {
    return (
      <div
        className={cn(
          "flex gap-10 overflow-x-auto pb-2 [scrollbar-width:none]",
          className,
        )}
      >
        {items}
      </div>
    );
  }

  return (
    <div
      className={cn("group relative flex overflow-hidden", className)}
      // Edge fade keeps items from colliding with the viewport border.
      style={{
        maskImage:
          "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
        WebkitMaskImage:
          "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
      }}
    >
      {[0, 1].map((copy) => (
        <motion.div
          key={copy}
          aria-hidden={copy === 1}
          className={cn(
            "flex shrink-0 items-center gap-10 pr-10",
            pauseOnHover && "group-hover:[animation-play-state:paused]",
          )}
          initial={{ x: reverse ? "-100%" : "0%" }}
          animate={{ x: reverse ? "0%" : "-100%" }}
          transition={{
            duration,
            repeat: Infinity,
            ease: "linear",
            repeatType: "loop",
          }}
        >
          {items}
        </motion.div>
      ))}
    </div>
  );
}
