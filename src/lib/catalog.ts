import "server-only";
import { cache } from "react";
import { PRODUCTS } from "@/data/products";
import { COLLECTIONS, COLLECTION_BY_SLUG } from "@/data/collections";
import type { CollectionSlug, Product, Variant } from "@/lib/types";

/**
 * Read layer over the catalog.
 *
 * Every accessor is wrapped in React's `cache()` so a page that asks for the
 * same product from three different components resolves it once per request.
 * That matters less against an in-memory array than it would against a network
 * call — the point is that when this is swapped for a real API, the call sites
 * do not change and the de-duplication is already in place.
 *
 * `server-only` is imported at the top so that importing this module from a
 * client component is a build error rather than a silent bundle bloat.
 */

export const getAllProducts = cache(async (): Promise<Product[]> => {
  return PRODUCTS;
});

export const getProductBySlug = cache(
  async (slug: string): Promise<Product | undefined> => {
    return PRODUCTS.find((p) => p.slug === slug);
  },
);

export const getProductById = cache(
  async (id: string): Promise<Product | undefined> => {
    return PRODUCTS.find((p) => p.id === id);
  },
);

export const getCollections = cache(async () => COLLECTIONS);

export const getCollection = cache(async (slug: string) =>
  COLLECTION_BY_SLUG.get(slug as CollectionSlug),
);

export const getProductsInCollection = cache(
  async (slug: CollectionSlug): Promise<Product[]> =>
    PRODUCTS.filter((p) => p.collection === slug),
);

export const getFeaturedProducts = cache(async (): Promise<Product[]> =>
  PRODUCTS.filter((p) => p.featured),
);

/** Same collection first, then anything else, capped. */
export const getRelatedProducts = cache(
  async (product: Product, limit = 4): Promise<Product[]> => {
    const sameCollection = PRODUCTS.filter(
      (p) => p.collection === product.collection && p.id !== product.id,
    );
    const rest = PRODUCTS.filter(
      (p) => p.collection !== product.collection && p.id !== product.id,
    );
    return [...sameCollection, ...rest].slice(0, limit);
  },
);
