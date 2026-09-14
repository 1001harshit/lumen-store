import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { CartProvider } from "@/components/providers/CartProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Header, type NavLink } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { SITE_URL } from "@/lib/site";
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
  metadataBase: new URL(SITE_URL),
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
    description: "Actives at concentrations that have actually been trialled.",
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

/**
 * Root layout reads no cookies on purpose.
 *
 * The moment it does, every page under it becomes dynamic — including product
 * and collection pages whose markup is identical for every visitor. The cart
 * hydrates client-side instead, so the catalog keeps static rendering.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
      </head>
      <body className={`${fraunces.variable} ${inter.variable} antialiased`}>
        <CartProvider>
          <SmoothScroll />

          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-content focus:px-5 focus:py-2.5 focus:text-sm focus:text-surface"
          >
            Skip to content
          </a>

          <Header links={NAV} />

          <main id="main">{children}</main>

          <Footer />

          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
