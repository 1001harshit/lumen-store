"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { resolveCart, writeCartRefs } from "@/lib/cart";
import { buildOrder, saveOrder } from "@/lib/orders";

export type CheckoutDetails = {
  email: string;
  phone: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

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
  details: CheckoutDetails,
): Promise<CheckoutResult> {
  const required: (keyof CheckoutDetails)[] = [
    "email",
    "name",
    "address",
    "city",
    "state",
    "pincode",
  ];

  for (const field of required) {
    if (!details[field]?.trim()) {
      return { ok: false, error: "Some delivery details are still missing." };
    }
  }

  if (!/^\S+@\S+\.\S+$/.test(details.email)) {
    return { ok: false, error: "That email address does not look right." };
  }

  if (!/^\d{6}$/.test(details.pincode)) {
    return { ok: false, error: "Enter a six-digit PIN code." };
  }

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
