import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { ProductCard } from "@/components/product/ProductCard";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";

export function ProductGrid({
  products,
  className,
}: {
  products: Product[];
  className?: string;
}) {
  return (
    <RevealGroup
      stagger={0.06}
      className={cn(
        "grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-3 xl:grid-cols-4",
        className,
      )}
    >
      {products.map((product) => (
        <RevealItem key={product.id}>
          <ProductCard product={product} />
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
