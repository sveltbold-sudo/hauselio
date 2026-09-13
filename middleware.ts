import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import {
  getEdgeAdminJWTSecret,
  getEdgeCustomerJWTSecret,
  isEdgeTokenRevoked,
  validateEdgeCsrfOrigin,
} from "@/lib/edge-auth";

const SAFE_METHODS = ["GET", "HEAD", "OPTIONS"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin") && !pathname.startsWith("/admin/login");
  const isAdminApiRoute = pathname.startsWith("/api/admin") && !pathname.startsWith("/api/admin/login");
  const isApiRoute = pathname.startsWith("/api/");

  // CSRF on ALL non-safe API routes (not just admin)
  if (isApiRoute && !SAFE_METHODS.includes(request.method)) {
    if (!validateEdgeCsrfOrigin(request)) {
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
        const safePathname = pathname.startsWith("/") && !pathname.includes("://") ? pathname : "/";
        const loginUrl = new URL("/admin/login", request.url);
        loginUrl.searchParams.set("redirect", safePathname);
        return NextResponse.redirect(loginUrl);
      }
      return NextResponse.json(
        { error: "Nicht autorisiert" },
        { status: 401 }
      );
    }

    try {
      const { payload } = await jwtVerify(token, getEdgeAdminJWTSecret(), {
        algorithms: ["HS256"],
        issuer: "HAUSAURA-admin",
        audience: "HAUSAURA-admin",
      });

      if (await isEdgeTokenRevoked(token, "admin")) {
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

  // Customer token revocation check on protected routes
  const isProtectedCustomerRoute =
    pathname.startsWith("/api/customer/me") ||
    pathname.startsWith("/api/customer/orders") ||
    pathname.startsWith("/api/customer/logout");

  if (isProtectedCustomerRoute) {
    const customerToken = request.cookies.get("customer_token")?.value;
    if (!customerToken) {
      return NextResponse.json(
        { error: "Nicht autorisiert" },
        { status: 401 }
      );
    }
    try {
      const { payload } = await jwtVerify(customerToken, getEdgeCustomerJWTSecret(), {
        algorithms: ["HS256"],
        issuer: "HAUSAURA-customer",
        audience: "HAUSAURA-customer",
      });
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        return NextResponse.json(
          { error: "Sitzung abgelaufen" },
          { status: 401 }
        );
      }
      if (await isEdgeTokenRevoked(customerToken, "customer")) {
        return NextResponse.json(
          { error: "Token widerrufen" },
          { status: 401 }
        );
      }
    } catch {
      return NextResponse.json(
        { error: "Ungültiges Token" },
        { status: 401 }
      );
    }
  }

  const response = NextResponse.next();

  if (isAdminApiRoute) {
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
