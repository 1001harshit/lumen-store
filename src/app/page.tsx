import { Hero } from "@/components/sections/Hero";
import { Ticker } from "@/components/sections/Ticker";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { CollectionBand } from "@/components/sections/CollectionBand";
import { IngredientStory } from "@/components/sections/IngredientStory";
import { ReviewMarquee } from "@/components/sections/ReviewMarquee";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Reveal } from "@/components/motion/Reveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { ButtonLink } from "@/components/ui/Button";
import {
  getAllProducts,
  getCollections,
  getFeaturedProducts,
  getProductBySlug,
} from "@/lib/catalog";

export default async function HomePage() {
  const [featured, all, collections, storyProduct] = await Promise.all([
    getFeaturedProducts(),
    getAllProducts(),
    getCollections(),
    getProductBySlug("retinal-night-serum"),
  ]);

  return (
    <>
      <Hero products={featured} />

      <Ticker />

      <section id="featured" className="shell mt-20 scroll-mt-28 md:mt-24">
        <SectionHeader
          eyebrow="Best sellers"
          title="The four people keep reordering."
          blurb="Nothing here is new. These are the formulas that have survived four years of repeat purchases and the occasional angry email."
          href="/products"
        />
        <ProductGrid products={featured} className="mt-12" />
      </section>

      <section className="shell mt-24 md:mt-28">
        <SectionHeader
          eyebrow="The routine"
          title="Four steps, in this order."
          blurb="Skincare fails far more often from sequence and consistency than from ingredient choice. Start here and stay there."
        />
        <div className="mt-12">
          <CollectionBand collections={collections} />
        </div>
      </section>

      {storyProduct && <IngredientStory product={storyProduct} />}

      <section className="shell mt-24 md:mt-28">
        <SectionHeader
          eyebrow="Everything"
          title="Twelve products. That is the whole range."
          blurb="No seasonal drops, no limited editions, no variant of a variant. If a formula stops earning its place, it goes."
        />
        <ProductGrid products={all} className="mt-12" />
      </section>

      <ReviewMarquee />

      {/* Closing call to action — full-bleed inverse band so the page ends on
          a hard stop rather than trailing off into the footer. */}
      <section className="mt-24 bg-surface-inverse md:mt-28 py-24 text-content-inverse md:py-32">
        <div className="shell text-center">
          <Reveal>
            <p className="eyebrow text-content-inverse/60">Start simple</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mx-auto mt-4 max-w-[18ch] font-display text-display leading-[0.98] tracking-[-0.04em]">
              A cleanser, a serum, a sunscreen.
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mx-auto mt-6 max-w-[48ch] text-[0.9375rem] leading-relaxed opacity-70">
              That is a complete routine. Everything past those three is
              optimisation, and optimisation is only worth anything once the
              basics are happening every day.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-10 flex justify-center">
              <Magnetic>
                <ButtonLink href="/products" variant="inverse" size="lg">
                  Build your routine
                </ButtonLink>
              </Magnetic>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
