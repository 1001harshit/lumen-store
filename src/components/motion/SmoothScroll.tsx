"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Lenis-backed inertial scrolling.
 *
 * Mounted once in the root layout. Three things matter here:
 *
 *  1. `prefers-reduced-motion` opts out entirely. Hijacking scroll is exactly
 *     the class of motion that triggers vestibular discomfort, so we return
 *     the browser's native scroll rather than a faster smoothed one.
 *  2. Anchor links are handled through `lenis.scrollTo`, otherwise a native
 *     jump fights the running animation loop and lands in the wrong place.
 *  3. The rAF loop is cancelled on unmount — a stray loop surviving a route
 *     change is a slow leak that only shows up after long sessions.
 */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    const onAnchorClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement)?.closest?.(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -96 });
    };

    document.addEventListener("click", onAnchorClick);

    return () => {
      document.removeEventListener("click", onAnchorClick);
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  // Route changes must reset scroll manually — Lenis owns the scroll position
  // and Next's own restoration no longer applies.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return null;
}
