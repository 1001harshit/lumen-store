import { Hero } from "@/components/sections/Hero";
import { ProductGrid } from "@/components/product/ProductGrid";
import { getFeaturedProducts, getAllProducts } from "@/lib/catalog";

export default async function HomePage() {
  const [featured, all] = await Promise.all([
    getFeaturedProducts(),
    getAllProducts(),
  ]);

  return (
    <>
      <Hero products={featured} />
      <section id="featured" className="shell mt-28">
        <ProductGrid products={all} />
      </section>
    </>
  );
}
