"use client";

import Lenis from "lenis";
import { useCallback, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Scroll behaviour for the whole site: Lenis inertia, anchor handling, and
 * scroll restoration across navigations.
 *
 * The click handler is attached unconditionally while Lenis itself is only
 * constructed when motion is allowed. Those are separate concerns —
 * `prefers-reduced-motion` should turn off the *inertia*, not the routing
 * behaviour that puts you at the top of a page you just asked for.
 */
export function SmoothScroll() {
  const pathname = usePathname();
  const lenis = useRef<Lenis | null>(null);
  const reduced = useRef(false);

  const scrollToTop = useCallback((smooth: boolean) => {
    if (lenis.current) {
      lenis.current.scrollTo(0, { immediate: !smooth });
      return;
    }
    window.scrollTo({
      top: 0,
      behavior: smooth && !reduced.current ? "smooth" : "auto",
    });
  }, []);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let frame = 0;
    if (!reduced.current) {
      const instance = new Lenis({
        duration: 1.05,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.6,
      });
      lenis.current = instance;

      const raf = (time: number) => {
        instance.raf(time);
        frame = requestAnimationFrame(raf);
      };
      frame = requestAnimationFrame(raf);
    }

    const onClick = (event: MouseEvent) => {
      // Leave anything the browser should handle natively alone: modified
      // clicks, middle-click and new tabs.
      //
      // `defaultPrevented` is deliberately *not* checked. Next's <Link> always
      // prevents default on an internal navigation, so testing it here would
      // skip every link in the app — including the same-URL case below, which
      // is the one that most needs handling.
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const anchor = (event.target as HTMLElement)?.closest?.("a");
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // In-page anchors go through Lenis, otherwise a native jump fights the
      // running animation loop and lands in the wrong place.
      if (href.startsWith("#")) {
        if (href === "#") return;
        const target = document.querySelector(href);
        if (!target) return;
        event.preventDefault();
        if (lenis.current) {
          lenis.current.scrollTo(target as HTMLElement, { offset: -96 });
        } else {
          (target as HTMLElement).scrollIntoView({
            behavior: reduced.current ? "auto" : "smooth",
            block: "start",
          });
        }
        return;
      }

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;

      /**
       * A link to the URL you are already on. The router treats this as a
       * no-op — the pathname never changes, so the restoration effect below
       * never fires and you are left wherever you had scrolled to. Pressing
       * "Shop all" while on /products, or the wordmark while on the home page,
       * appeared to do nothing at all.
       *
       * Take it as a request to return to the top, and animate it, so the
       * movement reads as a response to the press.
       */
      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search
      ) {
        event.preventDefault();
        scrollToTop(true);
      }
    };

    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      if (frame) cancelAnimationFrame(frame);
      lenis.current?.destroy();
      lenis.current = null;
    };
  }, [scrollToTop]);

  /**
   * Genuine navigations land at the top, instantly — animating a scroll
   * through a page the reader has not seen yet is disorienting, and Lenis owns
   * the scroll position, so Next's own restoration no longer applies.
   *
   * Keyed on the path alone, deliberately. Filter, sort and checkout-step
   * changes only touch the query string and are pushed with `scroll: false`
   * precisely so they update in place — re-sorting a grid should not throw the
   * reader back to the top of it.
   */
  useEffect(() => {
    scrollToTop(false);
  }, [pathname, scrollToTop]);

  return null;
}
