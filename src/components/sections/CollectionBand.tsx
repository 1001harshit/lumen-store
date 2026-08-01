"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useState } from "react";
import type { Collection } from "@/lib/types";

/**
 * The routine, as an ordered list of steps.
 *
 * Rows rather than cards: the sequence *is* the information, and a grid of
 * equal tiles would throw away the ordering that makes a routine legible. The
 * hovered row expands its colour field while the rest recede — one focus at a
 * time, which is how the list is actually read.
 */
export function CollectionBand({ collections }: { collections: Collection[] }) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <ul className="border-t border-hairline">
      {collections.map((collection, index) => {
        const isActive = active === collection.slug;
        const dimmed = active !== null && !isActive;

        return (
          <li key={collection.slug} className="border-b border-hairline">
            <Link
              href={`/collections/${collection.slug}`}
              onMouseEnter={() => setActive(collection.slug)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(collection.slug)}
              onBlur={() => setActive(null)}
              className="group relative block overflow-hidden px-1 py-8 md:py-10"
            >
              {/* Colour wipe, keyed to the collection's own hue pair. */}
              <motion.span
                aria-hidden
                className="absolute inset-0 -z-10"
                initial={false}
                animate={{ scaleY: isActive ? 1 : 0 }}
                transition={{ duration: 0.52, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  originY: 1,
                  background: `linear-gradient(100deg, oklch(0.9 0.055 ${collection.hueFrom} / 0.55), oklch(0.9 0.05 ${collection.hueTo} / 0.3))`,
                }}
              />

              <motion.div
                className="flex items-baseline gap-5 md:gap-10"
                animate={{ opacity: dimmed ? 0.38 : 1, x: isActive ? 12 : 0 }}
                transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="w-8 shrink-0 font-display text-sm tabular-nums text-content-subtle">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-[clamp(1.75rem,4.5vw,3.25rem)] leading-[1.02] tracking-[-0.035em]">
                    {collection.name}
                  </h3>
                  <p className="mt-2 max-w-xl text-[0.875rem] leading-relaxed text-content-muted">
                    {collection.description}
                  </p>
                </div>

                <span className="eyebrow hidden shrink-0 md:block">
                  {collection.eyebrow}
                </span>
              </motion.div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
