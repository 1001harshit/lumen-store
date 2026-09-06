import type { MetadataRoute } from "next";
import { getAllProducts, getCollections } from "@/lib/catalog";

const BASE = "https://lumen-store.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, collections] = await Promise.all([
    getAllProducts(),
    getCollections(),
  ]);

  return [
    { url: BASE, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/products`, changeFrequency: "weekly", priority: 0.9 },
    ...collections.map((collection) => ({
      url: `${BASE}/collections/${collection.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...products.map((product) => ({
      url: `${BASE}/products/${product.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
