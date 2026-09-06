import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Cart-bearing and per-order pages carry state, not content.
      disallow: ["/checkout", "/order/", "/api/"],
    },
    sitemap: "https://lumen-store.vercel.app/sitemap.xml",
  };
}
