import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/jwt";

async function middleware(request: NextRequest) {
  // Temporary for testing
  if (request.nextUrl.pathname === "/change-password") return NextResponse.next();

  const token = request.cookies.get("token");

  if (!token) return NextResponse.redirect(new URL("/login", request.url));

  const decoded = await verifyToken(token.value)?.catch((error) => {
    console.error("Error verifying token:", error);
    return null;
  });

  if (!decoded) return NextResponse.redirect(new URL("/login", request.url));

  return NextResponse.next();
}

export const config = {
  matcher: [
    /**
     *  Match all request paths except for the ones starting with:
     *    - /login
     *    - _next/static (static files)
     *    - _next/image (image optimization files)
     *    - favicon.ico (favicon file)
     */
    "/((?!login|_next/static|_next/image|favicon.ico).*)",
  ],
};

export { middleware };
