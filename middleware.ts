import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { getJWTSecret, isTokenRevoked } from "@/lib/auth";
import { validateCsrfOrigin } from "@/lib/api-helpers";

const SAFE_METHODS = ["GET", "HEAD", "OPTIONS"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin") && !pathname.startsWith("/admin/login");
  const isAdminApiRoute = pathname.startsWith("/api/admin") && !pathname.startsWith("/api/admin/login");
  const isApiRoute = pathname.startsWith("/api/");

  // CSRF on ALL non-safe API routes (not just admin)
  if (isApiRoute && !SAFE_METHODS.includes(request.method)) {
    if (!validateCsrfOrigin(request)) {
      return NextResponse.json(
        { error: "CSRF-Schutz: Ungültige Herkunft" },
        { status: 403 }
      );
    }
  }

  if (isAdminRoute || isAdminApiRoute) {
    const token = request.cookies.get("admin_token")?.value;

    if (!token) {
      if (isAdminRoute) {
        const loginUrl = new URL("/admin/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }
      return NextResponse.json(
        { error: "Nicht autorisiert" },
        { status: 401 }
      );
    }

    try {
      const { payload } = await jwtVerify(token, getJWTSecret(), {
        algorithms: ["HS256"],
        issuer: "HAUSAURA-admin",
      });

      if (await isTokenRevoked(token)) {
        if (isAdminRoute) {
          return NextResponse.redirect(new URL("/admin/login", request.url));
        }
        return NextResponse.json(
          { error: "Token widerrufen" },
          { status: 401 }
        );
      }

      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        if (isAdminRoute) {
          return NextResponse.redirect(new URL("/admin/login", request.url));
        }
        return NextResponse.json(
          { error: "Sitzung abgelaufen" },
          { status: 401 }
        );
      }
    } catch {
      if (isAdminRoute) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
      return NextResponse.json(
        { error: "Ungültiges Token" },
        { status: 401 }
      );
    }
  }

  const response = NextResponse.next();

  if (isAdminApiRoute && request.method === "GET") {
    response.headers.set("Cache-Control", "private, no-store, no-cache, must-revalidate");
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/:path*",
  ],
};
