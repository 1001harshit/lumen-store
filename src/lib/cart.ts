import "server-only";
import { cookies } from "next/headers";
import { getProductById } from "@/lib/catalog";
import type { Cart, CartLine, CartLineRef } from "@/lib/types";

export const CART_COOKIE = "lumen_cart";

/** Free over ₹1,500; otherwise a flat ₹99. */
export const FREE_SHIPPING_THRESHOLD = 150000;
export const FLAT_SHIPPING = 9900;

const MAX_QTY_PER_LINE = 10;

/**
 * The cart cookie stores *references only* — product id, variant id, quantity.
 *
 * Prices are never written to the cookie and never read from the client. They
 * are resolved against the catalog on every request, server-side. A cookie is
 * user-editable, so anything trusted that lives in one is a pricing exploit
 * waiting to happen; this way the worst a tampered cookie can do is name a
 * product that does not exist, which `resolveCart` drops.
 */
export async function readCartRefs(): Promise<CartLineRef[]> {
  const store = await cookies();
  const raw = store.get(CART_COOKIE)?.value;
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(
        (line): line is CartLineRef =>
          typeof line?.productId === "string" &&
          typeof line?.variantId === "string" &&
          Number.isInteger(line?.quantity),
      )
      .map((line) => ({
        ...line,
        quantity: Math.min(Math.max(line.quantity, 1), MAX_QTY_PER_LINE),
      }));
  } catch {
    // A malformed cookie is a fresh cart, not a 500.
    return [];
  }
}

export async function writeCartRefs(refs: CartLineRef[]) {
  const store = await cookies();
  store.set(CART_COOKIE, JSON.stringify(refs), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

/**
 * Turn stored references into a priced cart.
 *
 * Lines whose product or variant has since disappeared from the catalog are
 * dropped silently rather than throwing — a stale cookie should not be able to
 * break the page for someone who has not visited in a month.
 */
export async function resolveCart(): Promise<Cart> {
  const refs = await readCartRefs();
  const lines: CartLine[] = [];

  for (const ref of refs) {
    const product = await getProductById(ref.productId);
    if (!product) continue;

    const variant = product.variants.find((v) => v.id === ref.variantId);
    if (!variant) continue;

    // Never let a stored quantity exceed what is actually in stock.
    const quantity = Math.min(ref.quantity, Math.max(variant.stock, 0));
    if (quantity < 1) continue;

    lines.push({
      product,
      variant,
      quantity,
      lineTotal: variant.price * quantity,
    });
  }

  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
  const shipping =
    subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;

  return { lines, subtotal, shipping, total: subtotal + shipping, itemCount };
}

export function shippingProgress(subtotal: number) {
  return {
    remaining: Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0),
    percent: Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100),
    qualified: subtotal >= FREE_SHIPPING_THRESHOLD,
  };
}
