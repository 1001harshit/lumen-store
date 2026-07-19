import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { CartUIProvider } from "@/components/providers/CartUIProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartContents } from "@/components/cart/CartContents";
import { Header, type NavLink } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { resolveCart } from "@/lib/cart";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lumen-store.vercel.app"),
  title: {
    default: "Lumen — Skincare formulated in the open",
    template: "%s · Lumen",
  },
  description:
    "Actives at concentrations that have actually been trialled. Cleansers, serums and barrier care formulated in Bengaluru.",
  openGraph: {
    type: "website",
    siteName: "Lumen",
    title: "Lumen — Skincare formulated in the open",
    description:
      "Actives at concentrations that have actually been trialled.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fdfcf9" },
    { media: "(prefers-color-scheme: dark)", color: "#1b1917" },
  ],
};

const NAV: NavLink[] = [
  { href: "/products", label: "Shop all" },
  { href: "/collections/treat", label: "Treat" },
  { href: "/collections/hydrate", label: "Hydrate" },
  { href: "/collections/protect", label: "Protect" },
];

/**
 * Applied before first paint so a saved dark preference never flashes light.
 * It only *stamps* the attribute — the stylesheet still owns both palettes.
 */
const THEME_BOOT = `
(function(){try{var t=localStorage.getItem('lumen-theme');if(t){document.documentElement.dataset.theme=t;}}catch(e){}})();
`;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cart = await resolveCart();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
      </head>
      <body className={`${fraunces.variable} ${inter.variable} antialiased`}>
        <CartUIProvider>
          <SmoothScroll />

          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-content focus:px-5 focus:py-2.5 focus:text-sm focus:text-surface"
          >
            Skip to content
          </a>

          <Header links={NAV} itemCount={cart.itemCount} />

          <main id="main">{children}</main>

          <Footer />

          <CartDrawer>
            <CartContents />
          </CartDrawer>
        </CartUIProvider>
      </body>
    </html>
  );
}
