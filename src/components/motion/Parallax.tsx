"use client";

import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { useRef, type ReactNode } from "react";

type ParallaxProps = {
  children: ReactNode;
  /**
   * Positive drifts slower than the page (recedes), negative drifts faster
   * (advances). Expressed as a fraction of the element's own height.
   */
  speed?: number;
  className?: string;
};

/**
 * Depth by differential scroll speed.
 *
 * Progress is measured per-element rather than from document scroll, so a
 * section behaves the same wherever it sits on the page — a hero and a
 * mid-page band share one implementation.
 *
 * The offset is spring-smoothed because raw scroll deltas are quantised on
 * trackpads and land as visible stepping on slow-moving layers.
 */
export function Parallax({ children, speed = 0.2, className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const smoothed = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  const y = useTransform(
    smoothed,
    [0, 1],
    [`${speed * 50}%`, `${speed * -50}%`],
  );

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div ref={ref} className={className} style={{ y }}>
      {children}
    </motion.div>
  );
}

/**
 * Scales its child down as the section scrolls away, so stacked full-bleed
 * panels appear to settle into the page rather than simply sliding off.
 */
export function ScrollScale({
  children,
  className,
  from = 1,
  to = 0.92,
}: {
  children: ReactNode;
  className?: string;
  from?: number;
  to?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [from, to]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.4]);

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div ref={ref} className={className} style={{ scale, opacity }}>
      {children}
    </motion.div>
  );
}
