import { NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/catalog";

/** GET /api/products/:slug — full product including variants and stock. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return NextResponse.json(
      { error: "not_found", message: `No product with slug "${slug}".` },
      { status: 404 },
    );
  }

  return NextResponse.json(
    { product },
    {
      headers: {
        "cache-control": "public, s-maxage=300, stale-while-revalidate=3600",
      },
    },
  );
}
