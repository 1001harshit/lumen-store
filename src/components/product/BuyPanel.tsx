"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, Loader2 } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { addToCart } from "@/app/actions/cart";
import { useCartUI } from "@/components/providers/CartUIProvider";
import {
  defaultSelection,
  findVariant,
  isOptionAvailable,
  optionValues,
} from "@/lib/variants";
import { cn, formatMoney } from "@/lib/utils";
import type { Product } from "@/lib/types";

type Status = "idle" | "adding" | "added";

/**
 * Variant selection plus add-to-cart.
 *
 * Selection is held as an option map rather than a variant id, which is what
 * makes a multi-axis product work: picking "50 ml" keeps the currently chosen
 * formula and re-resolves, instead of resetting to the first variant that
 * happens to be 50 ml.
 *
 * Unavailable combinations stay clickable and are struck through rather than
 * disabled. A disabled control gives no feedback and is skipped by keyboard
 * navigation — the shopper is left guessing which axis caused it. Selecting
 * one here shows exactly what is sold out.
 */
export function BuyPanel({ product }: { product: Product }) {
  const [selection, setSelection] = useState(() => defaultSelection(product));
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const { openCart } = useCartUI();

  const variant = useMemo(
    () => findVariant(product, selection),
    [product, selection],
  );

  const available = variant && variant.stock > 0;
  const lowStock = variant && variant.stock > 0 && variant.stock <= 10;

  const handleAdd = () => {
    if (!variant) return;
    setError(null);
    setStatus("adding");

    startTransition(async () => {
      const result = await addToCart(product.id, variant.id, 1);
      if (!result.ok) {
        setError(result.error);
        setStatus("idle");
        return;
      }
      setStatus("added");
      openCart();
      // Revert the confirmation state so a second purchase reads as a new
      // action rather than leaving a permanent tick on the button.
      setTimeout(() => setStatus("idle"), 2000);
    });
  };

  return (
    <div>
      <div className="flex items-baseline gap-3">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={variant?.id ?? "none"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-3xl tabular-nums tracking-[-0.03em]"
          >
            {variant ? formatMoney(variant.price) : "—"}
          </motion.span>
        </AnimatePresence>

        {variant?.compareAt && (
          <span className="text-sm tabular-nums text-content-subtle line-through">
            {formatMoney(variant.compareAt)}
          </span>
        )}
      </div>

      <div className="mt-8 flex flex-col gap-7">
        {product.optionOrder.map((optionName) => (
          <fieldset key={optionName}>
            <legend className="eyebrow mb-3">{optionName}</legend>
            <div className="flex flex-wrap gap-2">
              {optionValues(product, optionName).map((value) => {
                const selected = selection[optionName] === value;
                const canPick = isOptionAvailable(
                  product,
                  selection,
                  optionName,
                  value,
                );

                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() =>
                      setSelection((prev) => ({ ...prev, [optionName]: value }))
                    }
                    className={cn(
                      "relative rounded-full border px-4 py-2.5 text-sm transition-all duration-[var(--duration-fast)]",
                      selected
                        ? "border-content bg-content text-surface"
                        : "border-hairline-strong hover:border-content/45",
                      !canPick && !selected && "text-content-subtle",
                    )}
                  >
                    {value}
                    {!canPick && (
                      <span
                        aria-hidden
                        className="absolute left-2.5 right-2.5 top-1/2 h-px -rotate-6 bg-current opacity-45"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>

      <div className="mt-8">
        <button
          type="button"
          onClick={handleAdd}
          disabled={!available || status === "adding"}
          className={cn(
            "relative flex h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-full text-[0.9375rem] font-medium",
            "transition-[transform,background-color] duration-[var(--duration-fast)] active:scale-[0.99]",
            available
              ? "bg-content text-surface hover:bg-content/90"
              : "cursor-not-allowed bg-content/15 text-content-subtle",
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={status + String(available)}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-2"
            >
              {!available ? (
                "Sold out"
              ) : status === "adding" ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Adding
                </>
              ) : status === "added" ? (
                <>
                  <Check size={16} />
                  Added to cart
                </>
              ) : (
                <>Add to cart · {variant && formatMoney(variant.price)}</>
              )}
            </motion.span>
          </AnimatePresence>
        </button>

        <div className="mt-3 min-h-5 text-center text-xs">
          {error ? (
            <span role="alert" className="text-blush-400">
              {error}
            </span>
          ) : lowStock ? (
            <span className="text-content-muted">
              Only {variant.stock} left in this size
            </span>
          ) : available ? (
            <span className="text-content-subtle">
              Free delivery over ₹1,500 · Dispatched within 24 hours
            </span>
          ) : (
            <span className="text-content-subtle">
              Pick another size or formula
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
