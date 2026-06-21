"use client";

import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { useRef, type ReactNode } from "react";
import { clamp } from "@/lib/utils";

type MagneticProps = {
  children: ReactNode;
  /** How far the element is allowed to travel toward the cursor, in px. */
  strength?: number;
  className?: string;
};

/**
 * Pulls its child toward the pointer while hovered, then springs home.
 *
 * Deliberately capped: the element tracks a *fraction* of the pointer delta and
 * is clamped to `strength`, so a fast cursor sweep can't fling a button halfway
 * across the section. Pointer-fine only — on touch there is no hover state to
 * enter, and on coarse pointers the offset just makes the tap target lie about
 * where it is.
 */
export function Magnetic({
  children,
  strength = 14,
  className,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const config = { stiffness: 260, damping: 18, mass: 0.6 };
  const springX = useSpring(x, config);
  const springY = useSpring(y, config);

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const node = ref.current;
    if (!node) return;

    const rect = node.getBoundingClientRect();
    const offsetX = event.clientX - (rect.left + rect.width / 2);
    const offsetY = event.clientY - (rect.top + rect.height / 2);

    x.set(clamp(offsetX * 0.35, -strength, strength));
    y.set(clamp(offsetY * 0.35, -strength, strength));
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: springX, y: springY }}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      onPointerCancel={reset}
    >
      {children}
    </motion.div>
  );
}
