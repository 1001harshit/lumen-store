import Link from "next/link";
import { COLLECTIONS } from "@/data/collections";
import { Reveal } from "@/components/motion/Reveal";

const SUPPORT = [
  { href: "/products", label: "All products" },
  { href: "/checkout", label: "Checkout" },
  { href: "#ingredients", label: "Formulation" },
  { href: "#reviews", label: "Reviews" },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-hairline bg-surface-sunken">
      <div className="shell py-20">
        <div className="grid gap-14 md:grid-cols-[1.4fr_1fr_1fr]">
          <Reveal>
            <p className="eyebrow">Lumen Skin Labs</p>
            <p className="mt-4 max-w-sm font-display text-[clamp(1.5rem,2.6vw,2.25rem)] leading-[1.18] tracking-[-0.03em]">
              Actives at concentrations that have actually been trialled.
            </p>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-content-muted">
              Formulated in Bengaluru. Every percentage on the front of the
              bottle is the percentage in the bottle.
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <h3 className="eyebrow">Shop</h3>
            <ul className="mt-5 flex flex-col gap-3">
              {COLLECTIONS.map((collection) => (
                <li key={collection.slug}>
                  <Link
                    href={`/collections/${collection.slug}`}
                    className="text-sm text-content-muted transition-colors hover:text-content"
                  >
                    {collection.name}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.14}>
            <h3 className="eyebrow">More</h3>
            <ul className="mt-5 flex flex-col gap-3">
              {SUPPORT.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-content-muted transition-colors hover:text-content"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Oversized wordmark — the page's full stop. Clipped so it reads as a
            printed edge rather than floating text. */}
        <div
          className="mt-20 overflow-hidden"
          aria-hidden
        >
          <p className="select-none font-display text-[clamp(4rem,19vw,17rem)] leading-[0.82] tracking-[-0.05em] text-content/8">
            Lumen
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-hairline pt-7 text-xs text-content-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Lumen Skin Labs. A portfolio build.</p>
          <p>
            Demo storefront — no real orders are placed and no payments are
            taken.
          </p>
        </div>
      </div>
    </footer>
  );
}
