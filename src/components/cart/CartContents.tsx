import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { resolveCart, shippingProgress } from "@/lib/cart";
import { CartLineRow } from "@/components/cart/CartLineRow";
import { ShippingMeter } from "@/components/cart/ShippingMeter";
import { CloseCartLink } from "@/components/cart/CloseCartLink";
import { formatMoney } from "@/lib/utils";

/**
 * Server-rendered cart body. Rendered as children of the client drawer, which
 * is what keeps pricing entirely on the server side of the boundary.
 */
export async function CartContents() {
  const cart = await resolveCart();
  const progress = shippingProgress(cart.subtotal);

  if (cart.lines.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-surface-sunken">
          <ShoppingBag size={22} className="text-content-subtle" />
        </div>
        <div>
          <p className="font-display text-xl tracking-[-0.02em]">Nothing here yet</p>
          <p className="mt-1.5 text-sm text-content-muted">
            Build a routine one step at a time.
          </p>
        </div>
        <CloseCartLink
          href="/products"
          className="mt-1 rounded-full bg-content px-6 py-2.5 text-sm font-medium text-surface"
        >
          Browse everything
        </CloseCartLink>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <ul className="flex flex-col gap-5">
          {cart.lines.map((line) => (
            <CartLineRow key={`${line.product.id}-${line.variant.id}`} line={line} />
          ))}
        </ul>
      </div>

      <footer className="border-t border-hairline px-6 py-5">
        <ShippingMeter {...progress} />

        <dl className="mt-4 flex flex-col gap-1.5 text-sm">
          <div className="flex justify-between">
            <dt className="text-content-muted">Subtotal</dt>
            <dd className="tabular-nums">{formatMoney(cart.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-content-muted">Delivery</dt>
            <dd className="tabular-nums">
              {cart.shipping === 0 ? "Free" : formatMoney(cart.shipping)}
            </dd>
          </div>
          <div className="mt-2 flex justify-between border-t border-hairline pt-3 text-base font-medium">
            <dt>Total</dt>
            <dd className="tabular-nums">{formatMoney(cart.total)}</dd>
          </div>
        </dl>

        <CloseCartLink
          href="/checkout"
          className="mt-4 flex h-12 w-full items-center justify-center rounded-full bg-content text-sm font-medium text-surface transition-transform active:scale-[0.99]"
        >
          Checkout · {formatMoney(cart.total)}
        </CloseCartLink>

        <p className="mt-3 text-center text-xs text-content-subtle">
          Taxes included. Dispatched within 24 hours.
        </p>
      </footer>
    </>
  );
}
