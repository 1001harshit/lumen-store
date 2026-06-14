import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional class names, letting later Tailwind utilities win. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Prices are held as integer paise everywhere so no float rounding can creep
 * into a subtotal. Formatting is the only place they become rupees.
 */
export function formatMoney(paise: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(paise / 100);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Clamp a number into a range — used by the pointer-tracking primitives. */
export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
