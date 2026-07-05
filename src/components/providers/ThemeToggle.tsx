"use client";

import { motion, AnimatePresence } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type Theme = "light" | "dark";

/**
 * Explicit theme switch layered over the system preference.
 *
 * The stylesheet already handles system dark via prefers-color-scheme; this
 * only ever stamps data-theme on <html> to override it. `theme` starts as null
 * so the first paint matches whatever the inline boot script decided, rather
 * than flashing the wrong icon for a frame.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const stamped = document.documentElement.dataset.theme as Theme | undefined;
    if (stamped) return setTheme(stamped);
    setTheme(
      window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
    );
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("lumen-theme", next);
    } catch {
      // Private browsing — the choice just will not persist across visits.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      className={`relative grid h-9 w-9 place-items-center rounded-full transition-colors duration-[var(--duration-fast)] hover:bg-content/8 ${className ?? ""}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme ?? "pending"}
          initial={{ opacity: 0, rotate: -75, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 75, scale: 0.6 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="absolute grid place-items-center"
        >
          {theme === "dark" ? <Moon size={17} /> : <Sun size={17} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
