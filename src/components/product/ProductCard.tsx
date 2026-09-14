"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Star } from "lucide-react";
import { useState } from "react";
import { ProductRender } from "@/components/product/ProductRender";
import { formatMoney, cn } from "@/lib/utils";
import type { Product } from "@/lib/types";

/**
 * Catalog card.
 *
 * Hover cross-fades to the alternate render and lifts the vessel slightly —
 * the second "photograph" is what gives a card the feel of a real product
 * shoot. Both renders are mounted from the start and swapped by opacity, so
 * there is no pop-in on first hover the way a lazily swapped <img> would give.
 *
 * The whole tile is one link with a single accessible name; the visual pieces
 * inside are decorative so screen readers announce one target rather than
 * three nested ones.
 */
export function ProductCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false);

  const prices = product.variants.map((v) => v.price);
  const from = Math.min(...prices);
  const onOffer = product.variants.some((v) => v.compareAt);
  const soldOut = product.variants.every((v) => v.stock < 1);

  return (
    <Link
      href={`/products/${product.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className="group flex flex-col"
      aria-label={`${product.name} — ${product.tagline}, from ${formatMoney(from)}`}
    >
      <div className="relative aspect-4/5 overflow-hidden rounded-[var(--radius-card)] bg-surface-sunken ring-1 ring-hairline">
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: hovered ? 0 : 1 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <ProductRender art={product.art} id={`${product.id}-a`} />
        </motion.div>

        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <ProductRender art={product.art} id={`${product.id}-b`} alternate />
        </motion.div>

        {/* Lift is applied to a wrapper rather than the SVG so the contact
            shadow inside the render stays anchored to the shelf. */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          animate={{ y: hovered ? -10 : 0, scale: hovered ? 1.03 : 1 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        />

        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {onOffer && !soldOut && (
            <span className="rounded-full bg-accent px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-accent-contrast">
              Offer
            </span>
          )}
          {soldOut && (
            <span className="rounded-full bg-content px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-surface">
              Sold out
            </span>
          )}
        </div>

        <motion.div
          className="absolute inset-x-3 bottom-3 rounded-full bg-surface/85 py-2.5 text-center text-xs font-medium backdrop-blur-md"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden
        >
          View product
        </motion.div>
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-3">
        <h3 className="text-[0.9375rem] font-medium tracking-[-0.01em]">
          {product.name}
        </h3>
        <span
          className={cn(
            "shrink-0 text-[0.9375rem] tabular-nums",
            soldOut && "text-content-subtle line-through",
          )}
        >
          {formatMoney(from)}
        </span>
      </div>

      <p className="mt-1 text-[0.8125rem] leading-snug text-content-muted">
        {product.tagline}
      </p>

      <div className="mt-2.5 flex items-center gap-2" aria-hidden>
        <span className="flex gap-px">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={11}
              className={
                i < Math.round(product.rating)
                  ? "fill-accent text-accent"
                  : "text-content-subtle/35"
              }
            />
          ))}
        </span>
        <span className="text-[0.7rem] tabular-nums text-content-subtle">
          {product.rating} ({product.reviewCount.toLocaleString("en-IN")})
        </span>
      </div>

      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {product.badges.slice(0, 2).map((badge) => (
          <span
            key={badge}
            className="rounded-full border border-hairline px-2 py-0.5 text-[0.65rem] text-content-muted"
          >
            {badge}
          </span>
        ))}
      </div>
    </Link>
  );
}
