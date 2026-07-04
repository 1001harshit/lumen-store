"use server";

import { revalidatePath } from "next/cache";
import { getProductById } from "@/lib/catalog";
import { readCartRefs, writeCartRefs } from "@/lib/cart";

/**
 * Cart mutations.
 *
 * These are the entire write half of the backend. Each one validates against
 * the catalog before it writes, so the cookie can only ever hold references
 * that resolve — quantity is capped at real stock here rather than being
 * trusted from the form that submitted it.
 */

export type CartActionResult = { ok: true } | { ok: false; error: string };

export async function addToCart(
  productId: string,
  variantId: string,
  quantity = 1,
): Promise<CartActionResult> {
  const product = await getProductById(productId);
  if (!product) return { ok: false, error: "That product is no longer available." };

  const variant = product.variants.find((v) => v.id === variantId);
  if (!variant) return { ok: false, error: "Choose an available option first." };
  if (variant.stock < 1) return { ok: false, error: "That option is sold out." };

  const refs = await readCartRefs();
  const existing = refs.find(
    (line) => line.productId === productId && line.variantId === variantId,
  );

  const requested = (existing?.quantity ?? 0) + quantity;
  const allowed = Math.min(requested, variant.stock, 10);

  if (existing) {
    existing.quantity = allowed;
  } else {
    refs.push({ productId, variantId, quantity: allowed });
  }

  await writeCartRefs(refs);
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function updateLineQuantity(
  productId: string,
  variantId: string,
  quantity: number,
): Promise<CartActionResult> {
  const refs = await readCartRefs();

  if (quantity < 1) {
    await writeCartRefs(
      refs.filter(
        (line) => !(line.productId === productId && line.variantId === variantId),
      ),
    );
    revalidatePath("/", "layout");
    return { ok: true };
  }

  const product = await getProductById(productId);
  const variant = product?.variants.find((v) => v.id === variantId);
  if (!product || !variant) {
    return { ok: false, error: "That product is no longer available." };
  }

  const line = refs.find(
    (l) => l.productId === productId && l.variantId === variantId,
  );
  if (line) line.quantity = Math.min(quantity, variant.stock, 10);

  await writeCartRefs(refs);
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function removeLine(
  productId: string,
  variantId: string,
): Promise<CartActionResult> {
  const refs = await readCartRefs();
  await writeCartRefs(
    refs.filter(
      (line) => !(line.productId === productId && line.variantId === variantId),
    ),
  );
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function clearCart(): Promise<CartActionResult> {
  await writeCartRefs([]);
  revalidatePath("/", "layout");
  return { ok: true };
}
