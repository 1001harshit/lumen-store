"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ShoppingBag, X } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { CartLineRow } from "@/components/cart/CartLineRow";
import { ShippingMeter } from "@/components/cart/ShippingMeter";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatMoney } from "@/lib/utils";

/**
 * Slide-over cart.
 *
 * Movement is a spring rather than a duration: a drawer is a physical object
 * being pulled out, and a linear tween reads as a slide-show transition.
 *
 * Contents come from the client cart context, which is fed by /api/cart. That
 * is what lets the catalog pages stay statically rendered — see CartProvider.
 */
export function CartDrawer() {
  const { cart, loading, open, closeCart } = useCart();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32 }}
            onClick={closeCart}
            className="fixed inset-0 z-[70] bg-ink-900/45 backdrop-blur-[3px]"
            aria-hidden
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 36, mass: 0.9 }}
            className="fixed right-0 top-0 z-[71] flex h-dvh w-full max-w-[28rem] flex-col bg-surface shadow-[var(--shadow-float)]"
          >
            <header className="flex items-center justify-between border-b border-hairline px-6 py-5">
              <h2 className="font-display text-2xl tracking-[-0.02em]">Your cart</h2>
              <button
                type="button"
                onClick={closeCart}
                aria-label="Close cart"
                className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-content/8"
              >
                <X size={18} />
              </button>
            </header>

            {loading ? (
              <div className="flex flex-col gap-5 px-6 py-5">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="h-24 w-20 rounded-xl" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="mt-2 h-3 w-1/3" />
                      <Skeleton className="mt-6 h-8 w-24 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : cart.lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-surface-sunken">
                  <ShoppingBag size={22} className="text-content-subtle" />
                </div>
                <div>
                  <p className="font-display text-xl tracking-[-0.02em]">
                    Nothing here yet
                  </p>
                  <p className="mt-1.5 text-sm text-content-muted">
                    Build a routine one step at a time.
                  </p>
                </div>
                <Link
                  href="/products"
                  onClick={closeCart}
                  className="mt-1 rounded-full bg-content px-6 py-2.5 text-sm font-medium text-surface"
                >
                  Browse everything
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-5">
                  <ul className="flex flex-col gap-5">
                    <AnimatePresence initial={false} mode="popLayout">
                      {cart.lines.map((line) => (
                        <CartLineRow
                          key={`${line.productId}-${line.variantId}`}
                          line={line}
                        />
                      ))}
                    </AnimatePresence>
                  </ul>
                </div>

                <footer className="border-t border-hairline px-6 py-5">
                  <ShippingMeter {...cart.freeShipping} />

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

                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="mt-4 flex h-12 w-full items-center justify-center rounded-full bg-content text-sm font-medium text-surface transition-transform active:scale-[0.99]"
                  >
                    Checkout · {formatMoney(cart.total)}
                  </Link>

                  <p className="mt-3 text-center text-xs text-content-subtle">
                    Taxes included. Dispatched within 24 hours.
                  </p>
                </footer>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
