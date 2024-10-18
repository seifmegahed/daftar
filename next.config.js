/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");
import path from "path";

/** @type {import("next").NextConfig} */

const config = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  transpilePackages: ["@t3-oss/env-nextjs", "@t3-oss/env-core"],
  cacheHandler:
    process.env.CACHE_REDIS === "true"
      ? path.resolve("./cache-handler.mjs")
      : undefined,
};

export default config;
