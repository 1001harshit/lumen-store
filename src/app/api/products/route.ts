import { NextResponse } from "next/server";
import { getAllProducts } from "@/lib/catalog";
import { parseSort, sortProducts } from "@/lib/sorting";
import { priceRange } from "@/lib/variants";
import type { CollectionSlug } from "@/lib/types";

/**
 * GET /api/products?collection=treat&sort=price-asc&limit=4
 *
 * A read-only JSON view of the same catalog the pages render, sharing the exact
 * sort and filter helpers so the API can never disagree with the UI about
 * ordering. Public and cacheable — there is nothing per-user in a catalog.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const collection = searchParams.get("collection");
  const sort = parseSort(searchParams.get("sort") ?? undefined);
  const limitParam = Number(searchParams.get("limit"));
  const limit =
    Number.isFinite(limitParam) && limitParam > 0
      ? Math.min(limitParam, 50)
      : undefined;

  const all = await getAllProducts();
  const filtered =
    collection && collection !== "all"
      ? all.filter((p) => p.collection === (collection as CollectionSlug))
      : all;

  const sorted = sortProducts(filtered, sort);
  const page = limit ? sorted.slice(0, limit) : sorted;

  return NextResponse.json(
    {
      count: page.length,
      total: filtered.length,
      products: page.map((product) => ({
        id: product.id,
        slug: product.slug,
        name: product.name,
        tagline: product.tagline,
        collection: product.collection,
        rating: product.rating,
        reviewCount: product.reviewCount,
        priceFrom: priceRange(product).min,
        currency: "INR",
        inStock: product.variants.some((v) => v.stock > 0),
        url: `/products/${product.slug}`,
      })),
    },
    {
      headers: {
        "cache-control": "public, s-maxage=300, stale-while-revalidate=3600",
      },
    },
  );
}
