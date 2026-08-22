import type { Product } from "@/lib/types";
import { priceRange } from "@/lib/variants";

export type SortValue = "featured" | "price-asc" | "price-desc" | "rating";

const VALID: SortValue[] = ["featured", "price-asc", "price-desc", "rating"];

/** Anything unrecognised falls back to `featured` rather than throwing. */
export function parseSort(value: string | undefined): SortValue {
  return VALID.includes(value as SortValue) ? (value as SortValue) : "featured";
}

export function sortProducts(products: Product[], sort: SortValue): Product[] {
  // Copy first — the catalog array is a module constant and sorting is in-place.
  const list = [...products];

  switch (sort) {
    case "price-asc":
      return list.sort((a, b) => priceRange(a).min - priceRange(b).min);
    case "price-desc":
      return list.sort((a, b) => priceRange(b).min - priceRange(a).min);
    case "rating":
      return list.sort(
        (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount,
      );
    case "featured":
    default:
      return list.sort(
        (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)),
      );
  }
}
