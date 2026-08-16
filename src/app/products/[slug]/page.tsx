import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import {
  getAllProducts,
  getCollection,
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/catalog";
import { priceRange } from "@/lib/variants";
import { ProductGallery } from "@/components/product/ProductGallery";
import { BuyPanel } from "@/components/product/BuyPanel";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { formatMoney } from "@/lib/utils";

type Params = { params: Promise<{ slug: string }> };

/** Pre-render every PDP — the catalog is twelve items and fully known at build. */
export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Not found" };

  return {
    title: product.name,
    description: product.tagline,
    openGraph: {
      title: `${product.name} · Lumen`,
      description: product.tagline,
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [collection, related] = await Promise.all([
    getCollection(product.collection),
    getRelatedProducts(product),
  ]);

  const { min } = priceRange(product);

  /**
   * Product JSON-LD. `offers` reports the lowest variant price so a rich
   * result cannot advertise a figure that no purchasable variant matches.
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: { "@type": "Brand", name: "Lumen" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      lowPrice: (min / 100).toFixed(2),
      offerCount: product.variants.length,
      availability: product.variants.some((v) => v.stock > 0)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="shell pt-32">
        <nav aria-label="Breadcrumb" className="mb-8 flex gap-2 text-xs text-content-muted">
          <Link href="/" className="hover:text-content">Home</Link>
          <span aria-hidden>/</span>
          <Link href="/products" className="hover:text-content">Shop</Link>
          {collection && (
            <>
              <span aria-hidden>/</span>
              <Link
                href={`/collections/${collection.slug}`}
                className="hover:text-content"
              >
                {collection.name}
              </Link>
            </>
          )}
        </nav>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal direction="none">
            <div className="lg:sticky lg:top-28">
              <ProductGallery product={product} />
            </div>
          </Reveal>

          <div className="lg:py-4">
            <Reveal delay={0.06}>
              <p className="eyebrow">{collection?.name}</p>
              <h1 className="mt-3 font-display text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.02] tracking-[-0.04em]">
                {product.name}
              </h1>
              <p className="mt-3 text-[0.9375rem] text-content-muted">
                {product.tagline}
              </p>

              <div className="mt-5 flex items-center gap-2.5">
                <div className="flex gap-0.5" aria-hidden>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={13}
                      className={
                        i < Math.round(product.rating)
                          ? "fill-accent text-accent"
                          : "text-content-subtle/40"
                      }
                    />
                  ))}
                </div>
                <span className="text-xs text-content-muted">
                  {product.rating} · {product.reviewCount.toLocaleString("en-IN")} reviews
                </span>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {product.badges.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full border border-hairline-strong px-3 py-1 text-[0.7rem] font-medium text-content-muted"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="mt-9 border-t border-hairline pt-9">
                <BuyPanel product={product} />
              </div>
            </Reveal>

            <Reveal delay={0.16}>
              <div className="mt-10 border-t border-hairline pt-9">
                <h2 className="eyebrow">About</h2>
                <p className="mt-4 text-[0.9375rem] leading-relaxed text-content-muted">
                  {product.description}
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-10 border-t border-hairline pt-9">
                <h2 className="eyebrow">Key ingredients</h2>
                <dl className="mt-5 flex flex-col divide-y divide-[var(--hairline)]">
                  {product.ingredients.map((ingredient) => (
                    <div key={ingredient.name} className="py-4 first:pt-0">
                      <div className="flex items-baseline justify-between gap-4">
                        <dt className="text-[0.9375rem] font-medium">
                          {ingredient.name}
                        </dt>
                        <span className="shrink-0 rounded-full bg-accent-soft px-2.5 py-0.5 text-[0.7rem] font-medium">
                          {ingredient.detail}
                        </span>
                      </div>
                      <dd className="mt-1.5 text-sm leading-relaxed text-content-muted">
                        {ingredient.blurb}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>

            <Reveal delay={0.24}>
              <p className="mt-8 text-xs text-content-subtle">
                From {formatMoney(min)} · {product.variants.length} option
                {product.variants.length === 1 ? "" : "s"}
              </p>
            </Reveal>
          </div>
        </div>
      </div>

      <section className="shell mt-32">
        <SectionHeader
          eyebrow="Pairs with"
          title="Works alongside this."
          href="/products"
        />
        <ProductGrid products={related} className="mt-12" />
      </section>
    </>
  );
}
