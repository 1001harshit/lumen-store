"use client";

import type { Artwork } from "@/lib/types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ClientCartLine = {
  productId: string;
  slug: string;
  name: string;
  art: Artwork;
  variantId: string;
  sku: string;
  options: Record<string, string | undefined>;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

export type ClientCart = {
  itemCount: number;
  subtotal: number;
  shipping: number;
  total: number;
  freeShipping: { remaining: number; percent: number; qualified: boolean };
  lines: ClientCartLine[];
};

const EMPTY: ClientCart = {
  itemCount: 0,
  subtotal: 0,
  shipping: 0,
  total: 0,
  freeShipping: { remaining: 150000, percent: 0, qualified: false },
  lines: [],
};

type CartContextValue = {
  cart: ClientCart;
  loading: boolean;
  open: boolean;
  openCart: () => void;
  closeCart: () => void;
  refresh: () => Promise<void>;
  /** Reflect a mutation immediately, before the server confirms it. */
  applyOptimistic: (next: ClientCart) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

/**
 * Cart state, held on the client and fed by /api/cart.
 *
 * This is the "display cached, cart live" split. Reading the cart cookie in the
 * root layout would make *every* page dynamic, including product and collection
 * pages whose content does not vary by visitor — the whole catalog would lose
 * static rendering to power one number in the header.
 *
 * So the catalog renders statically and ships from the CDN, and the cart
 * hydrates over the top from a no-store endpoint. Mutations still go through
 * server actions (they own validation and pricing); this provider just re-reads
 * the result afterwards.
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<ClientCart>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/cart", { cache: "no-store" });
      if (!response.ok) throw new Error(`cart ${response.status}`);
      setCart((await response.json()) as ClientCart);
    } catch {
      // Offline or a failed request: keep whatever is on screen rather than
      // blanking a cart the shopper has already filled.
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial read. The fetch is inlined rather than calling refresh() so that
  // every setState happens inside a promise callback — an effect body that
  // synchronously kicks off state updates causes cascading renders. The
  // AbortController also stops a slow response from landing after unmount.
  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/cart", { cache: "no-store", signal: controller.signal })
      .then((response) =>
        response.ok
          ? (response.json() as Promise<ClientCart>)
          : Promise.reject(new Error(`cart ${response.status}`)),
      )
      .then((data) => setCart(data))
      .catch(() => {
        // Offline or aborted: keep whatever is on screen rather than blanking
        // a cart the shopper has already filled.
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  const openCart = useCallback(() => setOpen(true), []);
  const closeCart = useCallback(() => setOpen(false), []);
  const applyOptimistic = useCallback((next: ClientCart) => setCart(next), []);

  // Lock the page behind the drawer, compensating for the scrollbar width so
  // the layout does not jolt sideways as it disappears.
  useEffect(() => {
    if (!open) return;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    const { overflow, paddingRight } = document.body.style;
    document.body.style.overflow = "hidden";
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const value = useMemo(
    () => ({ cart, loading, open, openCart, closeCart, refresh, applyOptimistic }),
    [cart, loading, open, openCart, closeCart, refresh, applyOptimistic],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside <CartProvider>");
  return context;
}

/** Recompute totals locally so an optimistic update stays self-consistent. */
export function recalculate(lines: ClientCartLine[]): ClientCart {
  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
  const shipping = subtotal === 0 || subtotal >= 150000 ? 0 : 9900;

  return {
    lines,
    subtotal,
    itemCount,
    shipping,
    total: subtotal + shipping,
    freeShipping: {
      remaining: Math.max(150000 - subtotal, 0),
      percent: Math.min((subtotal / 150000) * 100, 100),
      qualified: subtotal >= 150000,
    },
  };
}
