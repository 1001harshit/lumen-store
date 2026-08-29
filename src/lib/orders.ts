import "server-only";
import { cookies } from "next/headers";
import type { Cart } from "@/lib/types";

export const ORDER_COOKIE = "lumen_last_order";

export type PlacedOrder = {
  id: string;
  email: string;
  name: string;
  city: string;
  placedAt: string;
  itemCount: number;
  subtotal: number;
  shipping: number;
  total: number;
  lines: { name: string; option: string; quantity: number; total: number }[];
};

/**
 * Order persistence.
 *
 * This store has no database by design, so a placed order is written to a
 * cookie and read back once on the confirmation page. That is genuinely all
 * this demo needs — but it is worth being explicit that it is not how a real
 * store works: an order is a financial record, it has to outlive the browser
 * that created it, and it cannot live anywhere the customer can edit.
 *
 * Swapping this file for a table write is the single change that would make
 * the flow real; nothing else in the checkout path would need to move.
 */
export function buildOrder(
  cart: Cart,
  details: { email: string; name: string; city: string },
): PlacedOrder {
  return {
    id: generateOrderId(),
    email: details.email,
    name: details.name,
    city: details.city,
    placedAt: new Date().toISOString(),
    itemCount: cart.itemCount,
    subtotal: cart.subtotal,
    shipping: cart.shipping,
    total: cart.total,
    lines: cart.lines.map((line) => ({
      name: line.product.name,
      option: Object.values(line.variant.options).join(" · "),
      quantity: line.quantity,
      total: line.lineTotal,
    })),
  };
}

function generateOrderId() {
  const stamp = Date.now().toString(36).toUpperCase().slice(-5);
  const noise = Math.random().toString(36).toUpperCase().slice(2, 6);
  return `LM-${stamp}${noise}`;
}

export async function saveOrder(order: PlacedOrder) {
  const store = await cookies();
  store.set(ORDER_COOKIE, JSON.stringify(order), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
}

export async function readOrder(id: string): Promise<PlacedOrder | null> {
  const store = await cookies();
  const raw = store.get(ORDER_COOKIE)?.value;
  if (!raw) return null;

  try {
    const order = JSON.parse(raw) as PlacedOrder;
    // Only hand back the order that was actually asked for, so a stale cookie
    // cannot render someone else's confirmation under a guessed id.
    return order.id === id ? order : null;
  } catch {
    return null;
  }
}
