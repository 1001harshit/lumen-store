import { NextResponse } from "next/server";
import { getCollections, getProductsInCollection } from "@/lib/catalog";

/** GET /api/collections — every collection with its product count. */
export async function GET() {
  const collections = await getCollections();

  const payload = await Promise.all(
    collections.map(async (collection) => ({
      slug: collection.slug,
      name: collection.name,
      eyebrow: collection.eyebrow,
      description: collection.description,
      productCount: (await getProductsInCollection(collection.slug)).length,
      url: `/collections/${collection.slug}`,
    })),
  );

  return NextResponse.json(
    { collections: payload },
    {
      headers: {
        "cache-control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    },
  );
}
