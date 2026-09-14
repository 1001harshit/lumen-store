import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Cart-bearing and per-order pages carry state, not content.
      disallow: ["/checkout", "/order/", "/api/"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
