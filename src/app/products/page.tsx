import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllProducts, getCollections } from "@/lib/catalog";
import { parseSort, sortProducts } from "@/lib/sorting";
import { CatalogControls } from "@/components/product/CatalogControls";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SectionHeader } from "@/components/sections/SectionHeader";
import type { CollectionSlug } from "@/lib/types";

export const metadata: Metadata = {
  title: "Shop all",
  description:
    "Twelve products. Cleansers, serums, barrier care and sun protection, with every active concentration printed on the front.",
};

type SearchParams = Promise<{ collection?: string; sort?: string }>;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const [all, collections] = await Promise.all([
    getAllProducts(),
    getCollections(),
  ]);

  const activeFilter = params.collection ?? "all";
  const activeSort = parseSort(params.sort);

  const filtered =
    activeFilter === "all"
      ? all
      : all.filter((p) => p.collection === (activeFilter as CollectionSlug));

  const products = sortProducts(filtered, activeSort);

  const filters = [
    { value: "all", label: "Everything" },
    ...collections.map((c) => ({ value: c.slug, label: c.name })),
  ];

  return (
    <div className="shell pt-32">
      <SectionHeader
        eyebrow="The full range"
        title="Twelve products, no filler."
        blurb="Every formula here has to justify its place against the one it would replace. When one stops doing that, it is discontinued rather than reformulated into something vaguer."
      />

      <div className="mt-12">
        {/* useSearchParams needs a Suspense boundary so the shell above can
            still be statically rendered. */}
        <Suspense fallback={<div className="h-[4.5rem] border-y border-hairline" />}>
          <CatalogControls
            filters={filters}
            activeFilter={activeFilter}
            activeSort={activeSort}
            resultCount={products.length}
          />
        </Suspense>
      </div>

      {products.length > 0 ? (
        <ProductGrid
          /* Keying on the query re-runs the stagger when the result set
             changes, so a filter switch animates in rather than snapping. */
          key={`${activeFilter}-${activeSort}`}
          products={products}
          className="mt-14"
        />
      ) : (
        <p className="mt-20 text-center text-sm text-content-muted">
          Nothing matches that combination yet.
        </p>
      )}
    </div>
  );
}
