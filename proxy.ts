import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

// This is Next.js 16's "Proxy" (renamed from Middleware) — an optimistic,
// cookie-only check per Next's own auth guidance (no DB calls here, since
// this runs on every request including prefetches). The authoritative check
// still happens server-side via lib/auth/session.ts in pages/actions/routes.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  if (!token) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
