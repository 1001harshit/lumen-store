"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useOptimistic, useTransition } from "react";
import { removeLine, updateLineQuantity } from "@/app/actions/cart";
import { ProductRender } from "@/components/product/ProductRender";
import { formatMoney } from "@/lib/utils";
import type { CartLine } from "@/lib/types";

/**
 * One cart line, with an optimistic quantity stepper.
 *
 * The displayed quantity comes from useOptimistic, so a tap updates the number
 * and the line total on the same frame while the server action is still in
 * flight. If the action fails or clamps to stock, React reconciles back to the
 * server value when the transition settles — worth it, because a stepper that
 * waits for a round trip feels broken even when it is working.
 */
export function CartLineRow({ line }: { line: CartLine }) {
  const [, startTransition] = useTransition();
  const [quantity, setQuantity] = useOptimistic(line.quantity);

  const change = (next: number) => {
    startTransition(async () => {
      setQuantity(next);
      await updateLineQuantity(line.product.id, line.variant.id, next);
    });
  };

  const drop = () => {
    startTransition(async () => {
      setQuantity(0);
      await removeLine(line.product.id, line.variant.id);
    });
  };

  const optionLabel = Object.values(line.variant.options).join(" · ");
  const atStockCeiling = quantity >= Math.min(line.variant.stock, 10);

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
      className="flex gap-4 border-b border-hairline pb-5"
    >
      <Link
        href={`/products/${line.product.slug}`}
        className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-surface-sunken"
      >
        <ProductRender art={line.product.art} id={`cart-${line.variant.id}`} />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/products/${line.product.slug}`}
              className="block truncate text-sm font-medium hover:text-accent"
            >
              {line.product.name}
            </Link>
            <p className="mt-0.5 text-xs text-content-muted">{optionLabel}</p>
          </div>
          <button
            type="button"
            onClick={drop}
            aria-label={`Remove ${line.product.name}`}
            className="mt-0.5 shrink-0 text-content-subtle transition-colors hover:text-content"
          >
            <Trash2 size={15} />
          </button>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1 rounded-full border border-hairline-strong p-0.5">
            <button
              type="button"
              onClick={() => change(quantity - 1)}
              aria-label="Decrease quantity"
              className="grid h-7 w-7 place-items-center rounded-full transition-colors hover:bg-content/8"
            >
              <Minus size={13} />
            </button>
            <span className="w-6 text-center text-sm tabular-nums">{quantity}</span>
            <button
              type="button"
              onClick={() => change(quantity + 1)}
              disabled={atStockCeiling}
              aria-label="Increase quantity"
              className="grid h-7 w-7 place-items-center rounded-full transition-colors hover:bg-content/8 disabled:opacity-30"
            >
              <Plus size={13} />
            </button>
          </div>

          <span className="text-sm font-medium tabular-nums">
            {formatMoney(line.variant.price * quantity)}
          </span>
        </div>
      </div>
    </motion.li>
  );
}
