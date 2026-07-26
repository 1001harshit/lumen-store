import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Pin the Turbopack root to this project.
   *
   * Without it, Turbopack walks up looking for a lockfile, finds an unrelated
   * one in the home directory and warns that it sits outside the repo. Pinning
   * the root keeps module resolution inside the project regardless of what
   * else happens to live above it.
   */
  turbopack: {
    root: __dirname,
  },

  experimental: {
    // Pull only the icons that are actually imported instead of the whole set.
    optimizePackageImports: ["lucide-react", "motion"],
  },
};

export default nextConfig;
