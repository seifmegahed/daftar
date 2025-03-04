import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    POSTGRES_URL: z.string(),
    CACHE_REDIS: z.boolean(),
    SSL: z.boolean(),
    NODE_MAILER_USERNAME: z.string().optional(),
    NODE_MAILER_PASSWORD: z.string().optional(),
    NODE_MAILER_SERVICE: z.string().optional(),
    LOGIN_REWRITE: z.boolean(),
    PERFORMANCE_DEBUG: z.boolean(),
    LOGIN_ATTEMPTS: z.number(),
    LOCK_TIME_HR: z.number(),
    JWT_SECRET: z.string().min(32).max(256),
    JWT_VALIDITY_IN_DAYS: z.number(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_VERCEL: z.boolean(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_MAILER_USERNAME: process.env.NODE_MAILER_USERNAME,
    NODE_MAILER_PASSWORD: process.env.NODE_MAILER_PASSWORD,
    NODE_MAILER_SERVICE: process.env.NODE_MAILER_SERVICE,

    LOGIN_REWRITE: process.env.LOGIN_REWRITE === "true",
    JWT_VALIDITY_IN_DAYS: process.env.JWT_VALIDITY_IN_DAYS
      ? isNaN(parseInt(process.env.JWT_VALIDITY_IN_DAYS))
        ? 1
        : parseInt(process.env.JWT_VALIDITY_IN_DAYS)
      : 1,
    LOGIN_ATTEMPTS: process.env.LOGIN_ATTEMPTS
      ? isNaN(parseInt(process.env.LOGIN_ATTEMPTS))
        ? 3
        : parseInt(process.env.LOGIN_ATTEMPTS)
      : 3,
    LOCK_TIME_HR: process.env.LOCK_TIME_HR
      ? isNaN(parseInt(process.env.LOCK_TIME_HR))
        ? 1
        : parseInt(process.env.LOCK_TIME_HR)
      : 1,
    CACHE_REDIS: process.env.CACHE_REDIS === "true",
    SSL: process.env.SSL === "true",
    PERFORMANCE_DEBUG: process.env.PERFORMANCE_DEBUG === "true",
    POSTGRES_URL:
      process.env.NEXT_PUBLIC_VERCEL !== "true"
        ? `postgresql://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`
        : process.env.POSTGRES_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_VERCEL: process.env.NEXT_PUBLIC_VERCEL === "true" ? true : false,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
