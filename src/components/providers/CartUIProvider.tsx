"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type CartUIContextValue = {
  open: boolean;
  openCart: () => void;
  closeCart: () => void;
};

const CartUIContext = createContext<CartUIContextValue | null>(null);

/**
 * Owns only the *visibility* of the cart drawer — never its contents.
 *
 * The lines themselves are rendered by a server component passed in as
 * children, so after a server action calls revalidatePath the drawer's markup
 * is refreshed by the framework. Mirroring cart state into client context as
 * well would give us two sources of truth that drift the moment stock changes.
 */
export function CartUIProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const openCart = useCallback(() => setOpen(true), []);
  const closeCart = useCallback(() => setOpen(false), []);

  // Lock the page behind the drawer. Compensating for the scrollbar width
  // stops the layout from jolting sideways as it disappears.
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
    () => ({ open, openCart, closeCart }),
    [open, openCart, closeCart],
  );

  return <CartUIContext.Provider value={value}>{children}</CartUIContext.Provider>;
}

export function useCartUI() {
  const context = useContext(CartUIContext);
  if (!context) throw new Error("useCartUI must be used inside <CartUIProvider>");
  return context;
}
