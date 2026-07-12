"use client";

import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { useCartUI } from "@/components/providers/CartUIProvider";

/**
 * A link that dismisses the drawer as it navigates. Without this the panel
 * stays mounted over the destination page, since a client-side navigation does
 * not unmount the layout that owns it.
 */
export function CloseCartLink(props: ComponentPropsWithoutRef<typeof Link>) {
  const { closeCart } = useCartUI();
  return <Link {...props} onClick={closeCart} />;
}
