"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Menu, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/providers/ThemeToggle";
import { useCart } from "@/components/providers/CartProvider";
import { MobileNav } from "@/components/layout/MobileNav";
import { cn } from "@/lib/utils";

export type NavLink = { href: string; label: string };

export function Header({ links }: { links: NavLink[] }) {
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const { openCart, cart } = useCart();
  const itemCount = cart.itemCount;

  const [hidden, setHidden] = useState(false);
  const [condensed, setCondensed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  /**
   * Directional auto-hide. Reading the previous value from the motion value
   * rather than from React state keeps this off the render path entirely — the
   * handler fires on every scroll frame, and a setState per frame would be a
   * guaranteed jank source.
   *
   * The 140px floor stops the bar from hiding during the small bounce at the
   * very top of the page.
   */
  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious() ?? 0;
    const delta = current - previous;

    setCondensed(current > 24);
    if (menuOpen) return;

    if (current < 140) setHidden(false);
    else if (delta > 6) setHidden(true);
    else if (delta < -6) setHidden(false);
  });

  return (
    <>
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: hidden ? "-110%" : "0%" }}
        transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={cn(
            "transition-all duration-[var(--duration-base)] ease-[var(--ease-out-expo)]",
            condensed
              ? "border-b border-hairline bg-surface/72 backdrop-blur-xl backdrop-saturate-150"
              : "border-b border-transparent bg-transparent",
          )}
        >
          <div className="shell flex h-[4.5rem] items-center justify-between gap-6">
            <Link
              href="/"
              className="font-display text-[1.6rem] leading-none tracking-[-0.03em]"
            >
              Lumen
              <span className="text-accent">.</span>
            </Link>

            <nav className="hidden items-center gap-1 md:flex">
              {links.map((link) => {
                const active =
                  pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="relative rounded-full px-4 py-2 text-sm text-content-muted transition-colors duration-[var(--duration-fast)] hover:text-content"
                  >
                    {active && (
                      /* One shared layoutId means the pill slides between
                         items instead of cross-fading in place. */
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-content/7"
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      />
                    )}
                    <span
                      className={cn("relative", active && "text-content")}
                    >
                      {link.label}
                    </span>
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-1">
              <ThemeToggle />

              <button
                type="button"
                onClick={openCart}
                aria-label={`Open cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`}
                className="relative grid h-9 w-9 place-items-center rounded-full transition-colors duration-[var(--duration-fast)] hover:bg-content/8"
              >
                <ShoppingBag size={18} />
                <AnimatePresence>
                  {itemCount > 0 && (
                    <motion.span
                      key={itemCount}
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.4, opacity: 0 }}
                      transition={{ duration: 0.34, ease: [0.34, 1.56, 0.64, 1] }}
                      className="absolute -right-0.5 -top-0.5 grid h-[1.15rem] min-w-[1.15rem] place-items-center rounded-full bg-accent px-1 text-[0.65rem] font-semibold tabular-nums text-accent-contrast"
                    >
                      {itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                className="grid h-9 w-9 place-items-center rounded-full transition-colors duration-[var(--duration-fast)] hover:bg-content/8 md:hidden"
              >
                <Menu size={18} />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <MobileNav
        links={links}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
    </>
  );
}
