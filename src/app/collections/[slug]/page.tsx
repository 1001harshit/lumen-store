import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getCollection,
  getCollections,
  getProductsInCollection,
} from "@/lib/catalog";
import { parseSort, sortProducts } from "@/lib/sorting";
import { ProductGrid } from "@/components/product/ProductGrid";
import { TextReveal } from "@/components/motion/TextReveal";
import { Reveal } from "@/components/motion/Reveal";
import type { CollectionSlug } from "@/lib/types";

type Params = { params: Promise<{ slug: string }> };
type Props = Params & { searchParams: Promise<{ sort?: string }> };

export async function generateStaticParams() {
  const collections = await getCollections();
  return collections.map((collection) => ({ slug: collection.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollection(slug);
  if (!collection) return { title: "Not found" };

  return {
    title: collection.name,
    description: collection.description,
  };
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);

  const collection = await getCollection(slug);
  if (!collection) notFound();

  const products = sortProducts(
    await getProductsInCollection(slug as CollectionSlug),
    parseSort(query.sort),
  );

  return (
    <>
      {/* Collection hero, tinted from the collection's own hue pair. */}
      <header className="relative overflow-hidden pb-16 pt-36">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-70"
          style={{
            background: `radial-gradient(60% 80% at 22% 12%, oklch(0.88 0.06 ${collection.hueFrom} / 0.6), transparent 70%),
                         radial-gradient(52% 72% at 82% 8%, oklch(0.88 0.055 ${collection.hueTo} / 0.5), transparent 70%)`,
          }}
        />
        <div className="shell">
          <Reveal>
            <p className="eyebrow">{collection.eyebrow}</p>
          </Reveal>
          <TextReveal
            as="h1"
            text={collection.name}
            className="mt-3 font-display text-hero leading-[0.88] tracking-[-0.045em]"
          />
          <Reveal delay={0.14}>
            <p className="mt-6 max-w-xl text-[0.9375rem] leading-relaxed text-content-muted">
              {collection.description}
            </p>
          </Reveal>
        </div>
      </header>

      <div className="shell">
        <ProductGrid products={products} />
      </div>
    </>
  );
}
