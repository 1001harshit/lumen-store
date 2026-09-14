# Lumen

A skincare storefront built as one Next.js app — full front end, light back end,
no database to provision.

> Not deployed yet. Run it locally with the steps below.

![Next.js](https://img.shields.io/badge/Next.js-16-000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-087ea4?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-06b6d4?logo=tailwindcss&logoColor=white)

---

## What this is

A complete commerce front end — catalog, product pages with multi-attribute
variants, a cart, and a three-step checkout — running on a backend that is
nothing more than Next.js route handlers and server actions over an in-repo
catalog.

That constraint is the point. A headless storefront usually means standing up a
separate commerce API (Postgres, Redis, a worker queue) before a single pixel
renders. Everything here deploys as one app to one platform with no
infrastructure behind it, while keeping the parts that actually matter for
correctness: server-side pricing, stock validation, and a cart the client
cannot forge.

## Architecture

```
Browser                     Next.js (single deploy)
───────                     ───────────────────────

  Catalog pages   ◀─────    Statically prerendered at build
  (home, PDPs)              12 PDPs via generateStaticParams

  Cart drawer     ◀────▶    GET /api/cart          (no-store, per-visitor)
                            server actions          (validate → write cookie)

  Checkout        ◀────▶    Server-resolved cart, recomputed totals
```

**Display cached, cart live.** The root layout deliberately reads no cookies.
The moment it does, every page beneath it turns dynamic — including product
pages whose markup is identical for every visitor. So the catalog prerenders and
ships from the CDN, and the cart hydrates over the top from a `no-store`
endpoint.

**The cart cookie holds references only** — product id, variant id, quantity.
Prices are resolved against the catalog server-side on every request and are
never written to or read from the client. A cookie is user-editable; anything
trusted that lives in one is a pricing exploit waiting to happen. The worst a
tampered cookie can do here is name a product that does not exist, which the
resolver drops.

**Money is integer paise end to end.** `formatMoney` is the only place it
becomes rupees, so no subtotal can pick up float drift.

## Motion

Six primitives under `src/components/motion/`, all composed from one shared
vocabulary of easings and durations in `globals.css`:

| Primitive | What it does |
|---|---|
| `Reveal` / `RevealGroup` | Scroll-triggered entrances, fires once, named variants for staggered grids |
| `TextReveal` | Display type lifting out from behind a per-word mask |
| `SmoothScroll` | Lenis inertial scrolling, with anchor handling routed through it |
| `Magnetic` | Pointer-follow, clamped and gated to fine pointers |
| `Parallax` / `ScrollScale` | Per-element scroll progress, spring-smoothed |
| `Marquee` | Seamless ticker — duplicated track translated exactly -50% |

**Reduced motion is handled per primitive, not globally.** Each one degrades to
something that still communicates: `Reveal` fades without travel, `Marquee`
becomes a static scrollable row, `SmoothScroll` returns the browser's native
scroll rather than a faster smoothed one. The content never disappears because
someone asked for less movement.

## Product imagery

Every product shot is generated SVG, drawn from two OKLCH hue angles and a
vessel silhouette in `ProductRender`. No photography, no image pipeline, no
CDN — a few hundred inline bytes that scale to any viewport, re-tint per
product, and inherit the theme, so a dark-mode product shot is genuinely dark
rather than a white JPEG punched into a dark page.

## Running it

```bash
npm install
npm run dev          # http://localhost:3000
```

```bash
npm run build && npm start
```

No environment variables are required to run it. Node 20+.

One optional variable matters for deployment:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical origin used by `metadataBase`, `sitemap.xml` and `robots.txt`. Set it to your custom domain. |

Left unset, the site URL is derived from Vercel's `VERCEL_PROJECT_PRODUCTION_URL`
at build time, falling back to `http://localhost:3000`. No domain is hardcoded
anywhere in the source — see `src/lib/site.ts`.

## API

Read-only, sharing the same sort and filter helpers the pages use, so the API
cannot disagree with the UI about ordering.

```
GET /api/products?collection=treat&sort=price-asc&limit=4
GET /api/products/:slug
GET /api/collections
GET /api/cart
```

Writes are deliberately absent. Mutations go through server actions so they
revalidate the rendered tree, which a fetch to a route handler would not.

## Layout

```
src/
├── app/
│   ├── actions/              server actions — the write half of the backend
│   ├── api/                  read-only JSON endpoints
│   ├── products/[slug]/      PDP, prerendered per product
│   ├── collections/[slug]/   collection listings
│   ├── checkout/             three-step, step held in ?step=
│   └── order/[id]/           confirmation
├── components/
│   ├── motion/               the six primitives above
│   ├── product/              renders, cards, gallery, buy panel
│   ├── cart/                 drawer, lines, shipping meter
│   ├── sections/             home page composition
│   └── ui/                   button, skeletons
├── data/                     the catalog — swap this for a CMS
└── lib/                      catalog reads, cart, variants, sorting, orders
```

`lib/catalog.ts` is the only module that reads `data/`, so pointing this at a
real commerce API is a one-file change.

## Known limits

This is a portfolio build, and a few things are demo-grade on purpose:

- **Orders are stored in a cookie**, not a database. An order is a financial
  record — it has to outlive the browser that created it and cannot live
  anywhere the customer can edit. `lib/orders.ts` is the one file that would
  need to become a table write.
- **No payment gateway.** Checkout confirms an order and charges nothing.
- **No auth**, so no accounts or order history.
- **Stock is static** and never decrements.

## Licence

MIT.
