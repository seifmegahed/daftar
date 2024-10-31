import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/jwt";

import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const locales = ["en", "ar"];

function getLocaleFromPath(pathname: string): string {
  const parts = pathname.split("/");
  if (!parts[1]) return "en";
  return locales.includes(parts[1]) ? parts[1] : "en";
}

const i18nMiddleware = createMiddleware(routing);

async function authMiddleware(request: NextRequest) {
  const locale = getLocaleFromPath(request.nextUrl.pathname);
  // const makeUrl = (url: string) => `/${locale}${url}`;

  const token = request.cookies.get("token");
  if (!token) return NextResponse.redirect(new URL("/login", request.url));

  const [decoded, error] = await verifyToken(token.value);
  if (error !== null)
    return NextResponse.redirect(new URL("/login", request.url));

  // Check for admin-only access
  if (request.nextUrl.pathname.startsWith(`/${locale}/admin`)) {
    const role = decoded.payload.role;
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

async function middleware(request: NextRequest) {
  const response = i18nMiddleware(request);

  // If the response is a redirect or an error, return it
  if (!response.ok) return response;

  if (request.url.includes("login")) return response;

  // Continue with authentication checks for page routes
  return authMiddleware(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
    // "/(ar|en)/:path*",
  ],
};

export { middleware };
