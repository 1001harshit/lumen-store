"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ProductRender } from "@/components/product/ProductRender";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";

/**
 * PDP gallery.
 *
 * Three views generated from one art config: the front render, the alternate
 * lighting, and a zoomed crop. The crop is the same SVG scaled inside a
 * clipping box rather than a fourth asset — vector art costs nothing to
 * magnify, which is the practical advantage over a photo set here.
 */
export function ProductGallery({ product }: { product: Product }) {
  const [index, setIndex] = useState(0);

  const views = [
    { key: "front", label: "Front", alternate: false, zoom: false },
    { key: "angle", label: "Angle", alternate: true, zoom: false },
    { key: "detail", label: "Detail", alternate: false, zoom: true },
  ] as const;

  const active = views[index];

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-4/5 overflow-hidden rounded-[var(--radius-card)] bg-surface-sunken">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={active.key}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <div
              className={cn(
                "h-full w-full transition-transform",
                active.zoom && "scale-[1.75] origin-center",
              )}
            >
              <ProductRender
                art={product.art}
                id={`pdp-${product.id}-${active.key}`}
                alternate={active.alternate}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex gap-3" role="tablist" aria-label="Product views">
        {views.map((view, i) => (
          <button
            key={view.key}
            role="tab"
            aria-selected={i === index}
            aria-label={view.label}
            onClick={() => setIndex(i)}
            className={cn(
              "relative aspect-square w-20 overflow-hidden rounded-xl bg-surface-sunken transition-opacity",
              i === index ? "opacity-100" : "opacity-55 hover:opacity-85",
            )}
          >
            <div className={cn("h-full w-full", view.zoom && "scale-[1.75]")}>
              <ProductRender
                art={product.art}
                id={`thumb-${product.id}-${view.key}`}
                alternate={view.alternate}
              />
            </div>
            {i === index && (
              <motion.span
                layoutId={`gallery-ring-${product.id}`}
                className="absolute inset-0 rounded-xl ring-2 ring-content ring-inset"
                transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
