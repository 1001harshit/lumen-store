"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { useEffect } from "react";
import type { NavLink } from "@/components/layout/Header";

const PANEL = {
  hidden: { clipPath: "inset(0% 0% 100% 0%)" },
  shown: {
    clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: 0.62, ease: [0.76, 0, 0.24, 1] as const },
  },
  exit: {
    clipPath: "inset(0% 0% 100% 0%)",
    transition: { duration: 0.44, ease: [0.76, 0, 0.24, 1] as const },
  },
};

const LIST = {
  shown: { transition: { staggerChildren: 0.06, delayChildren: 0.18 } },
  exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};

const ITEM = {
  hidden: { y: "110%" },
  shown: { y: "0%", transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
  exit: { y: "110%", transition: { duration: 0.3 } },
};

/**
 * Full-bleed mobile menu.
 *
 * The panel opens with a clip-path wipe rather than a slide, so the links
 * underneath are revealed in place instead of travelling with the container —
 * the two-speed effect is what makes it feel considered on a phone.
 */
export function MobileNav({
  links,
  open,
  onClose,
}: {
  links: NavLink[];
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          variants={PANEL}
          initial="hidden"
          animate="shown"
          exit="exit"
          className="fixed inset-0 z-[60] bg-surface md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          <div className="shell flex h-[4.5rem] items-center justify-between">
            <span className="font-display text-[1.6rem] leading-none tracking-[-0.03em]">
              Lumen<span className="text-accent">.</span>
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="grid h-9 w-9 place-items-center rounded-full hover:bg-content/8"
            >
              <X size={18} />
            </button>
          </div>

          <motion.nav
            variants={LIST}
            initial="hidden"
            animate="shown"
            exit="exit"
            className="shell mt-10 flex flex-col"
          >
            {links.map((link) => (
              <span key={link.href} className="overflow-hidden py-1">
                <motion.span variants={ITEM} className="block">
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className="block font-display text-[clamp(2.5rem,13vw,4rem)] leading-[1.08] tracking-[-0.035em]"
                  >
                    {link.label}
                  </Link>
                </motion.span>
              </span>
            ))}
          </motion.nav>

          <div className="shell absolute bottom-10 left-0 right-0">
            <p className="eyebrow">Free delivery over ₹1,500</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
