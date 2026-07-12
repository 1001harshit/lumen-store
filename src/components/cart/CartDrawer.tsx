"use client";

import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { useCartUI } from "@/components/providers/CartUIProvider";

/**
 * Slide-over cart.
 *
 * The panel is a client component but its *contents* arrive as children from a
 * server component, so every render of the lines is freshly priced against the
 * catalog. Opening the drawer shows server truth, not a client mirror that has
 * been drifting since page load.
 *
 * Movement is a spring rather than a duration: a drawer is a physical object
 * being pulled out, and a linear tween reads as a slide-show transition.
 */
export function CartDrawer({ children }: { children: ReactNode }) {
  const { open, closeCart } = useCartUI();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32 }}
            onClick={closeCart}
            className="fixed inset-0 z-[70] bg-ink-900/45 backdrop-blur-[3px]"
            aria-hidden
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 36, mass: 0.9 }}
            className="fixed right-0 top-0 z-[71] flex h-dvh w-full max-w-[28rem] flex-col bg-surface shadow-[var(--shadow-float)]"
          >
            <header className="flex items-center justify-between border-b border-hairline px-6 py-5">
              <h2 className="font-display text-2xl tracking-[-0.02em]">Your cart</h2>
              <button
                type="button"
                onClick={closeCart}
                aria-label="Close cart"
                className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-content/8"
              >
                <X size={18} />
              </button>
            </header>

            {children}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
