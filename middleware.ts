import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { getAdminJWTSecret, getCustomerJWTSecret, isTokenRevoked } from "@/lib/auth";
import { validateCsrfOrigin } from "@/lib/api-helpers";

const SAFE_METHODS = ["GET", "HEAD", "OPTIONS"];

function generateNonce(): string {
  const array = new Uint8Array(16);
  globalThis.crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
}

function buildCsp(nonce: string): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' https://va.vercel-scripts.com https://vercel.live https://www.googletagmanager.com https://www.google-analytics.com`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' https://res.cloudinary.com https://www.google-analytics.com blob: data:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://va.vercel-scripts.com https://*.sentry.io https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join("; ");
}

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
      const { payload } = await jwtVerify(token, getAdminJWTSecret(), {
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
      if (await isTokenRevoked(customerToken)) {
        return NextResponse.json(
          { error: "Token widerrufen" },
          { status: 401 }
        );
      }
      const { payload } = await jwtVerify(customerToken, getCustomerJWTSecret(), {
        algorithms: ["HS256"],
        issuer: "HAUSAURA-customer",
      });
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        return NextResponse.json(
          { error: "Sitzung abgelaufen" },
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

  // Generate nonce and set CSP header
  const nonce = generateNonce();
  const csp = buildCsp(nonce);

  const response = NextResponse.next();
  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("x-nonce", nonce);

  if (isAdminApiRoute && request.method === "GET") {
    response.headers.set("Cache-Control", "private, no-store, no-cache, must-revalidate");
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
