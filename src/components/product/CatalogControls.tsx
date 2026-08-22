"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { useTransition } from "react";
import { cn } from "@/lib/utils";

export const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Best rated" },
] as const;

export type SortValue = (typeof SORTS)[number]["value"];

type Filter = { value: string; label: string };

/**
 * Catalog filter and sort, driven entirely through the URL.
 *
 * State lives in searchParams rather than component state so a filtered view
 * is linkable, survives a refresh, and works with browser back — the three
 * things a client-state filter quietly breaks. The server component reads the
 * same params, so there is one source of truth for what is on screen.
 */
export function CatalogControls({
  filters,
  activeFilter,
  activeSort,
  resultCount,
}: {
  filters: Filter[];
  activeFilter: string;
  activeSort: SortValue;
  resultCount: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams.toString());
    if (value === null || value === "all" || value === "featured") {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    const query = next.toString();
    startTransition(() => {
      // scroll:false — re-sorting in place should not throw the reader back to
      // the top of the page.
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    });
  };

  return (
    <div className="flex flex-col gap-5 border-y border-hairline py-5 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        {filters.map((filter) => {
          const active = filter.value === activeFilter;
          return (
            <button
              key={filter.value}
              type="button"
              onClick={() => setParam("collection", filter.value)}
              className={cn(
                "relative rounded-full px-3.5 py-1.5 text-[0.8125rem] transition-colors",
                active ? "text-surface" : "text-content-muted hover:text-content",
              )}
            >
              {active && (
                <motion.span
                  layoutId="filter-pill"
                  className="absolute inset-0 rounded-full bg-content"
                  transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                />
              )}
              <span className="relative">{filter.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-4">
        <motion.span
          key={resultCount}
          initial={{ opacity: 0.4 }}
          animate={{ opacity: pending ? 0.4 : 1 }}
          className="text-xs tabular-nums text-content-muted"
        >
          {resultCount} product{resultCount === 1 ? "" : "s"}
        </motion.span>

        <label className="flex items-center gap-2 text-xs text-content-muted">
          <span className="sr-only">Sort by</span>
          <select
            value={activeSort}
            onChange={(event) => setParam("sort", event.target.value)}
            className="cursor-pointer rounded-full border border-hairline-strong bg-transparent py-1.5 pl-3 pr-7 text-[0.8125rem] text-content outline-none transition-colors hover:border-content/45"
          >
            {SORTS.map((sort) => (
              <option key={sort.value} value={sort.value}>
                {sort.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
