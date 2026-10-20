"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { resolveCart, writeCartRefs } from "@/lib/cart";
import { buildOrder, saveOrder } from "@/lib/orders";
import {
  validateCheckout,
  type CheckoutDetails,
} from "@/lib/checkout-validation";

export type { CheckoutDetails };

export type CheckoutResult = { ok: false; error: string };

/**
 * Place the order.
 *
 * Takes a plain object rather than FormData because the flow is multi-step and
 * the fields for earlier steps are not mounted when the last one submits.
 *
 * Totals are recomputed from the catalog here and never read from the payload.
 * The form is a rendering of the cart, not an authority on it — anything
 * arriving from a client is a suggestion until the server has priced it.
 */
export async function placeOrder(
  input: CheckoutDetails,
): Promise<CheckoutResult> {
  const checked = validateCheckout(input);
  if (!checked.ok) return checked;
  const { details } = checked;

  const cart = await resolveCart();
  if (cart.lines.length === 0) {
    return { ok: false, error: "Your cart is empty." };
  }

  const order = buildOrder(cart, {
    email: details.email,
    name: details.name,
    city: details.city,
  });

  await saveOrder(order);

  // The cart is only emptied once the order is safely written.
  await writeCartRefs([]);
  revalidatePath("/", "layout");

  redirect(`/order/${order.id}`);
}
