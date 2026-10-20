import { describe, expect, it } from "vitest";
import { PRODUCTS } from "@/data/products";
import { parseSort, sortProducts } from "@/lib/sorting";
import { priceRange } from "@/lib/variants";

describe("parseSort", () => {
  it("falls back to featured for unknown values", () => {
    expect(parseSort(undefined)).toBe("featured");
    expect(parseSort("cheapest")).toBe("featured");
    expect(parseSort("price-desc")).toBe("price-desc");
  });
});

describe("sortProducts", () => {
  it("does not mutate the catalog", () => {
    const before = PRODUCTS.map((p) => p.id);
    sortProducts(PRODUCTS, "price-desc");
    expect(PRODUCTS.map((p) => p.id)).toEqual(before);
  });

  it("orders by lowest variant price", () => {
    const mins = sortProducts(PRODUCTS, "price-asc").map((p) => priceRange(p).min);
    expect(mins).toEqual([...mins].sort((a, b) => a - b));
  });

  it("puts featured products first", () => {
    const flags = sortProducts(PRODUCTS, "featured").map((p) => Boolean(p.featured));
    expect(flags).toEqual([...flags].sort((a, b) => Number(b) - Number(a)));
  });
});
