/**
 * Edge-safe auth helpers for middleware.
 *
 * Must stay dependency-free (jose only): importing `@/lib/auth` pulls
 * bcryptjs + @prisma/client + next/headers, which crash the Edge runtime
 * and bloat the middleware bundle. Keep this file free of Node-only imports.
 * (`./constants` is import-free, so it is Edge-safe.)
 */

import { SITE_URL } from "./constants";

const DEV_SECRET_PREFIXES = [
  "HAUSAURA-super-secret",
  "test-secret",
  "dev-secret",
  "change-in-production",
  "your-secret",
  "super-secret",
];

function validateSecretLength(secret: string, name: string): void {
  if (secret.length < 32) {
    throw new Error(`${name} must be at least 32 characters long`);
  }
  if (process.env.NODE_ENV === "production") {
    const lower = secret.toLowerCase();
    for (const prefix of DEV_SECRET_PREFIXES) {
      if (lower.includes(prefix)) {
        throw new Error(`${name} appears to be a development value.`);
      }
    }
    if (new Set(secret).size < 10) {
      throw new Error(`${name} has too little entropy.`);
    }
  }
}

function encodeSecret(secret: string): Uint8Array {
  return new TextEncoder().encode(secret);
}

export function getEdgeAdminJWTSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET_ADMIN;
  if (!secret) throw new Error("JWT_SECRET_ADMIN environment variable is required");
  validateSecretLength(secret, "JWT_SECRET_ADMIN");
  return encodeSecret(secret);
}

export function getEdgeCustomerJWTSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET_CUSTOMER;
  if (!secret) throw new Error("JWT_SECRET_CUSTOMER environment variable is required");
  validateSecretLength(secret, "JWT_SECRET_CUSTOMER");
  return encodeSecret(secret);
}

/**
 * Revocation check via Upstash REST only. Without Upstash configured there is
 * no shared store in Edge (memory is per-request), so fail open — same
 * effective behavior as the in-memory fallback in `@/lib/auth`.
 */
export async function isEdgeTokenRevoked(
  token: string,
  type: "admin" | "customer" | "reset" = "admin"
): Promise<boolean> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const restToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !restToken) return false;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(`${url}/exists/${encodeURIComponent(`HAUSAURA:blacklist:${type}:${token}`)}`, {
      headers: { Authorization: `Bearer ${restToken}` },
      signal: controller.signal,
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { result?: number };
    return data.result === 1;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

function getExpectedOrigin(request: Request): string {
  try {
    return new URL(SITE_URL).origin;
  } catch {
    return "https://www.hausaura.de";
  }
}

/** Same-origin check for non-safe API methods. Mirrors `validateCsrfOrigin`. */
export function validateEdgeCsrfOrigin(request: Request): boolean {
  const method = request.method.toUpperCase();
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") return true;

  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const source = origin || referer;
  if (!source) return false;

  try {
    const sourceUrl = new URL(source);
    const expectedUrl = new URL(getExpectedOrigin(request));
    const normalize = (host: string) => host.toLowerCase().replace(/^www\./, "");
    return (
      normalize(sourceUrl.hostname) === normalize(expectedUrl.hostname) &&
      sourceUrl.protocol === expectedUrl.protocol
    );
  } catch {
    return false;
  }
}
