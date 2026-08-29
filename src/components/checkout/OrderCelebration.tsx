"use client";

import { motion, useReducedMotion } from "motion/react";
import { Check } from "lucide-react";

/**
 * Confirmation mark.
 *
 * The ring draws itself with pathLength and the tick follows, so the moment
 * reads as something completing rather than an icon appearing. Under reduced
 * motion both simply fade in — the confirmation is information, and it has to
 * land either way.
 */
export function OrderCelebration() {
  const reduced = useReducedMotion();

  return (
    <div className="mb-12 flex justify-center">
      <div className="relative grid h-20 w-20 place-items-center">
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
          <motion.circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="3"
            strokeLinecap="round"
            initial={reduced ? { opacity: 0 } : { pathLength: 0, rotate: -90 }}
            animate={reduced ? { opacity: 1 } : { pathLength: 1, rotate: -90 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{ originX: "50%", originY: "50%" }}
          />
        </svg>

        <motion.span
          initial={{ scale: reduced ? 1 : 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.5,
            delay: reduced ? 0 : 0.45,
            ease: [0.34, 1.56, 0.64, 1],
          }}
          className="text-accent"
        >
          <Check size={30} strokeWidth={2.5} />
        </motion.span>
      </div>
    </div>
  );
}
