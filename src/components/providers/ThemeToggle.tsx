"use client";

import { motion, AnimatePresence } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

/**
 * Explicit theme switch layered over the system preference.
 *
 * The theme is not React state — it lives on `<html data-theme>`, which the
 * boot script stamps before first paint and the stylesheet reads. That makes
 * the DOM the external store, so this subscribes to it with
 * useSyncExternalStore rather than mirroring it into local state from an
 * effect. Two practical consequences: the icon can never drift out of sync
 * with the palette actually on screen, and it still updates correctly if the
 * OS preference changes while the page is open.
 */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });

  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", onChange);

  return () => {
    observer.disconnect();
    media.removeEventListener("change", onChange);
  };
}

function getSnapshot(): Theme {
  const stamped = document.documentElement.dataset.theme as Theme | undefined;
  if (stamped) return stamped;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/** The server cannot know the preference; light matches the default palette. */
function getServerSnapshot(): Theme {
  return "light";
}

export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    // Writing the attribute is the state update — the subscription above picks
    // it up and re-renders this button.
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
          key={theme}
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
