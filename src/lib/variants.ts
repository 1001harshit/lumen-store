import type { Product, Variant } from "@/lib/types";

/**
 * Pure variant logic.
 *
 * Split out of `catalog.ts` deliberately: that module is `server-only`, and
 * these functions are needed by the PDP's selector, which runs on the client.
 * Keeping them here means the buy panel and the cart resolver agree on what
 * "the current variant" means without dragging the catalog into the bundle.
 */

export function findVariant(
  product: Product,
  selection: Record<string, string>,
): Variant | undefined {
  return product.variants.find((variant) =>
    product.optionOrder.every((name) => variant.options[name] === selection[name]),
  );
}

export function defaultSelection(product: Product): Record<string, string> {
  const first = product.variants.find((v) => v.stock > 0) ?? product.variants[0];
  return { ...first.options } as Record<string, string>;
}

/** Distinct values for one option, in first-seen order. */
export function optionValues(product: Product, name: string): string[] {
  const seen = new Set<string>();
  for (const variant of product.variants) {
    const value = variant.options[name as keyof typeof variant.options];
    if (value) seen.add(value);
  }
  return [...seen];
}

/**
 * Whether a given option value can still resolve to a purchasable variant,
 * holding the rest of the current selection fixed. This is what lets the PDP
 * grey out "50 ml / Lightly scented" when only that exact pair is sold out,
 * instead of greying out the whole size.
 */
export function isOptionAvailable(
  product: Product,
  selection: Record<string, string>,
  name: string,
  value: string,
): boolean {
  const candidate = { ...selection, [name]: value };
  return product.variants.some(
    (variant) =>
      variant.stock > 0 &&
      product.optionOrder.every((key) =>
        key === name
          ? variant.options[key] === value
          : variant.options[key] === candidate[key],
      ),
  );
}

export function priceRange(product: Product) {
  const prices = product.variants.map((v) => v.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}
