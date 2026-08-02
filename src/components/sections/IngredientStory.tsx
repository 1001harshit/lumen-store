"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { ProductRender } from "@/components/product/ProductRender";
import { TextReveal } from "@/components/motion/TextReveal";
import type { Product } from "@/lib/types";

/**
 * Scroll-linked ingredient breakdown.
 *
 * The render is pinned on the left while the ingredient panels scroll past on
 * the right, and the pinned artwork swaps to match whichever panel is centred.
 * Pinning is plain CSS `position: sticky` rather than a scroll-driven
 * transform — it survives resize, zoom and reduced-motion without a single
 * recalculation, where a JS pin would need all three handled by hand.
 *
 * Below `md` the sticky column collapses and each panel carries its own
 * render; a pinned element in a single-column layout just eats the viewport.
 */
export function IngredientStory({ product }: { product: Product }) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Stable identity — the panels take this as an effect dependency, so a new
  // closure on every parent render would re-fire the effect in a loop.
  const activate = useCallback((index: number) => setActiveIndex(index), []);

  return (
    <section id="ingredients" className="shell mt-32 scroll-mt-28">
      <div className="grid gap-12 md:grid-cols-2 md:gap-16">
        <div className="hidden md:block">
          <div className="sticky top-28">
            <div className="relative aspect-square overflow-hidden rounded-[var(--radius-card)] bg-surface-sunken">
              <ProductRender art={product.art} id="story-render" />

              {/* Hue shifts with the active ingredient so the pinned artwork
                  registers the change without a second render. */}
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0 mix-blend-soft-light"
                animate={{
                  background: `radial-gradient(circle at 50% 45%, oklch(0.85 0.1 ${product.art.hueFrom + activeIndex * 34} / 0.6), transparent 68%)`,
                }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>

            <div className="mt-6 flex items-center gap-2">
              {product.ingredients.map((ingredient, i) => (
                <span
                  key={ingredient.name}
                  className="h-0.5 flex-1 overflow-hidden rounded-full bg-content/12"
                >
                  <motion.span
                    className="block h-full rounded-full bg-accent"
                    initial={false}
                    animate={{ scaleX: i <= activeIndex ? 1 : 0 }}
                    style={{ originX: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  />
                </span>
              ))}
            </div>

            <p className="mt-5 text-sm text-content-muted">
              Inside{" "}
              <span className="text-content">{product.name}</span>
            </p>
          </div>
        </div>

        <div>
          <p className="eyebrow">What is in it</p>
          <TextReveal
            text="Three things that do the work."
            className="mt-3 font-display text-display leading-[0.98] tracking-[-0.04em]"
          />

          <div className="mt-14 flex flex-col gap-24 md:gap-32">
            {product.ingredients.map((ingredient, index) => (
              <IngredientPanel
                key={ingredient.name}
                index={index}
                total={product.ingredients.length}
                name={ingredient.name}
                detail={ingredient.detail}
                blurb={ingredient.blurb}
                onActive={activate}
                art={product.art}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function IngredientPanel({
  index,
  total,
  name,
  detail,
  blurb,
  onActive,
  art,
}: {
  index: number;
  total: number;
  name: string;
  detail: string;
  blurb: string;
  onActive: (index: number) => void;
  art: Product["art"];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // A tight band around the viewport middle, so exactly one panel is ever the
  // active one no matter how fast the page is scrolled.
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });

  // Must be an effect, not a render-time call: notifying the parent while this
  // component is rendering is a setState-during-render of a *different*
  // component, which React rejects outright.
  useEffect(() => {
    if (inView) onActive(index);
  }, [inView, onActive, index]);

  return (
    <motion.div
      ref={ref}
      animate={{ opacity: reduced ? 1 : inView ? 1 : 0.35 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-5 aspect-4/3 overflow-hidden rounded-[var(--radius-card)] bg-surface-sunken md:hidden">
        <ProductRender art={art} id={`story-m-${index}`} alternate={index % 2 === 1} />
      </div>

      <div className="flex items-center gap-3">
        <span className="font-display text-sm tabular-nums text-content-subtle">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <span className="h-px flex-1 bg-hairline" />
        <span className="rounded-full bg-accent-soft px-3 py-1 text-[0.7rem] font-medium text-content">
          {detail}
        </span>
      </div>

      <h3 className="mt-5 font-display text-title leading-[1.06] tracking-[-0.03em]">
        {name}
      </h3>
      <p className="mt-4 max-w-md text-[0.9375rem] leading-relaxed text-content-muted">
        {blurb}
      </p>
    </motion.div>
  );
}
