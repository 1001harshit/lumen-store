/**
 * Canonical site URL.
 *
 * Resolved at runtime rather than hardcoded. A literal domain in the source is
 * a liability: until the project is actually deployed it points at whatever
 * third party happens to own that subdomain, and Vercel's *.vercel.app names
 * are globally first-come-first-served. Getting that wrong puts someone else's
 * domain into your sitemap, robots.txt and canonical metadata.
 *
 * Precedence:
 *   1. NEXT_PUBLIC_SITE_URL        — explicit override, and what a custom
 *                                    domain should be set to.
 *   2. VERCEL_PROJECT_PRODUCTION_URL — the stable production domain, so
 *                                    preview builds still emit production
 *                                    canonicals instead of their own URL.
 *   3. VERCEL_URL                  — per-deployment host; last resort.
 *   4. localhost                   — local development.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (production) return `https://${production}`;

  const deployment = process.env.VERCEL_URL;
  if (deployment) return `https://${deployment}`;

  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl();

/** Absolute URL for a site-relative path. */
export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}
