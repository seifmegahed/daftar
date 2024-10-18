/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  transpilePackages: ["@t3-oss/env-nextjs", "@t3-oss/env-core"],
};

if (process.env.CACHE_REDIS === "true") {
  console.log("cache enabled")
  config.cacheHandler = require.resolve("./cache-handler.mjs");
  config.cacheMaxMemorySize = 0;
}

export default config;
