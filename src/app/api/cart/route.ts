import { NextResponse } from "next/server";
import { resolveCart, shippingProgress } from "@/lib/cart";

/**
 * GET /api/cart — the current cart for this browser's cookie.
 *
 * Explicitly no-store: the response is per-visitor, and a shared cache that
 * held it would serve one shopper's cart to the next. Writes deliberately do
 * not live here — mutations go through server actions so they revalidate the
 * rendered tree, which a fetch to a route handler would not.
 */
export async function GET() {
  const cart = await resolveCart();

  return NextResponse.json(
    {
      itemCount: cart.itemCount,
      subtotal: cart.subtotal,
      shipping: cart.shipping,
      total: cart.total,
      currency: "INR",
      freeShipping: shippingProgress(cart.subtotal),
      lines: cart.lines.map((line) => ({
        productId: line.product.id,
        slug: line.product.slug,
        name: line.product.name,
        // Ships with the line so the drawer can draw the thumbnail without
        // pulling the whole catalog into the client bundle.
        art: line.product.art,
        variantId: line.variant.id,
        sku: line.variant.sku,
        options: line.variant.options,
        unitPrice: line.variant.price,
        quantity: line.quantity,
        lineTotal: line.lineTotal,
      })),
    },
    { headers: { "cache-control": "no-store" } },
  );
}
