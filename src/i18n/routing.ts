import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const locales = ["en", "ar", "es", "nl", "fr", "de"];

export const routing = defineRouting({
  // A list of all locales that are supported
  localePrefix: "always",
  locales,
  // Used when no locale matches
  defaultLocale: "en",
  localeCookie: {
    name: "LOCALE",
    maxAge: 60 * 60 * 24 * 30 * 12, // 12 months
  },
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
