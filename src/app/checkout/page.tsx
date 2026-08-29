import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { resolveCart } from "@/lib/cart";
import { CheckoutFlow } from "@/components/checkout/CheckoutFlow";
import { ProductRender } from "@/components/product/ProductRender";
import { formatMoney } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Checkout",
  // A checkout URL carries cart state and should never reach an index.
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  const cart = await resolveCart();

  if (cart.lines.length === 0) {
    return (
      <div className="shell flex min-h-[70svh] flex-col items-center justify-center pt-32 text-center">
        <h1 className="font-display text-display tracking-[-0.04em]">
          Your cart is empty
        </h1>
        <p className="mt-4 max-w-sm text-[0.9375rem] text-content-muted">
          Add something first and the checkout will be waiting.
        </p>
        <Link
          href="/products"
          className="mt-8 rounded-full bg-content px-7 py-3 text-sm font-medium text-surface"
        >
          Shop everything
        </Link>
      </div>
    );
  }

  return (
    <div className="shell pt-32">
      <h1 className="font-display text-display leading-[0.98] tracking-[-0.04em]">
        Checkout
      </h1>

      <div className="mt-12 grid gap-14 lg:grid-cols-[1fr_22rem] lg:gap-20">
        <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-surface-sunken" />}>
          <CheckoutFlow total={cart.total} />
        </Suspense>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-[var(--radius-card)] border border-hairline bg-surface-raised p-6">
            <h2 className="eyebrow">Order summary</h2>

            <ul className="mt-5 flex flex-col gap-4">
              {cart.lines.map((line) => (
                <li
                  key={`${line.product.id}-${line.variant.id}`}
                  className="flex gap-3"
                >
                  <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-surface-sunken">
                    <ProductRender
                      art={line.product.art}
                      id={`co-${line.variant.id}`}
                    />
                    <span className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-content px-1 text-[0.6rem] font-semibold tabular-nums text-surface">
                      {line.quantity}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[0.8125rem] font-medium">
                      {line.product.name}
                    </p>
                    <p className="mt-0.5 text-xs text-content-muted">
                      {Object.values(line.variant.options).join(" · ")}
                    </p>
                  </div>
                  <span className="shrink-0 text-[0.8125rem] tabular-nums">
                    {formatMoney(line.lineTotal)}
                  </span>
                </li>
              ))}
            </ul>

            <dl className="mt-6 flex flex-col gap-2 border-t border-hairline pt-5 text-sm">
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
          </div>
        </aside>
      </div>
    </div>
  );
}
