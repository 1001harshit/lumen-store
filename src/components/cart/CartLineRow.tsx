"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useTransition } from "react";
import { removeLine, updateLineQuantity } from "@/app/actions/cart";
import {
  recalculate,
  useCart,
  type ClientCartLine,
} from "@/components/providers/CartProvider";
import { ProductRender } from "@/components/product/ProductRender";
import { formatMoney } from "@/lib/utils";

/**
 * One cart line with an optimistic quantity stepper.
 *
 * The stepper writes the new totals into context immediately, then calls the
 * server action and re-reads the authoritative result. A stepper that waits for
 * a round trip feels broken even when it is working correctly — and if the
 * server clamps to available stock, the refresh corrects the number a moment
 * later rather than blocking the interaction.
 */
export function CartLineRow({ line }: { line: ClientCartLine }) {
  const [, startTransition] = useTransition();
  const { cart, applyOptimistic, refresh } = useCart();

  const mutate = (quantity: number) => {
    const next = cart.lines
      .map((candidate) =>
        candidate.productId === line.productId &&
        candidate.variantId === line.variantId
          ? {
              ...candidate,
              quantity,
              lineTotal: candidate.unitPrice * quantity,
            }
          : candidate,
      )
      .filter((candidate) => candidate.quantity > 0);

    applyOptimistic(recalculate(next));

    startTransition(async () => {
      if (quantity < 1) {
        await removeLine(line.productId, line.variantId);
      } else {
        await updateLineQuantity(line.productId, line.variantId, quantity);
      }
      await refresh();
    });
  };

  const optionLabel = Object.values(line.options).filter(Boolean).join(" · ");

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
      className="flex gap-4 border-b border-hairline pb-5"
    >
      <Link
        href={`/products/${line.slug}`}
        className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-surface-sunken"
      >
        <ProductRender art={line.art} id={`cart-${line.variantId}`} />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/products/${line.slug}`}
              className="block truncate text-sm font-medium hover:text-accent"
            >
              {line.name}
            </Link>
            <p className="mt-0.5 text-xs text-content-muted">{optionLabel}</p>
          </div>
          <button
            type="button"
            onClick={() => mutate(0)}
            aria-label={`Remove ${line.name}`}
            className="mt-0.5 shrink-0 text-content-subtle transition-colors hover:text-content"
          >
            <Trash2 size={15} />
          </button>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1 rounded-full border border-hairline-strong p-0.5">
            <button
              type="button"
              onClick={() => mutate(line.quantity - 1)}
              aria-label="Decrease quantity"
              className="grid h-7 w-7 place-items-center rounded-full transition-colors hover:bg-content/8"
            >
              <Minus size={13} />
            </button>
            <span className="w-6 text-center text-sm tabular-nums">
              {line.quantity}
            </span>
            <button
              type="button"
              onClick={() => mutate(line.quantity + 1)}
              disabled={line.quantity >= 10}
              aria-label="Increase quantity"
              className="grid h-7 w-7 place-items-center rounded-full transition-colors hover:bg-content/8 disabled:opacity-30"
            >
              <Plus size={13} />
            </button>
          </div>

          <span className="text-sm font-medium tabular-nums">
            {formatMoney(line.lineTotal)}
          </span>
        </div>
      </div>
    </motion.li>
  );
}
