import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { UnauthorizedError } from "./errors";
import { logger } from "./logger";

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const useUpstash = Boolean(UPSTASH_URL && UPSTASH_TOKEN);

async function redisSet(key: string, value: string, exSec: number): Promise<void> {
  if (!useUpstash || !UPSTASH_URL || !UPSTASH_TOKEN) return;
  try {
    await fetch(`${UPSTASH_URL}/set/${encodeURIComponent(key)}/${encodeURIComponent(value)}?EX=${exSec}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
    });
  } catch (err) {
    logger.warn("auth", "Failed to set Redis key for token blacklist", { error: err });
  }
}

const memoryBlacklist = new Map<string, number>();

async function redisExists(key: string): Promise<boolean> {
  if (!useUpstash || !UPSTASH_URL || !UPSTASH_TOKEN) {
    const expiry = memoryBlacklist.get(key);
    if (!expiry) return false;
    if (Date.now() > expiry) {
      memoryBlacklist.delete(key);
      return false;
    }
    return true;
  }
  try {
    const res = await fetch(`${UPSTASH_URL}/exists/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
    });
    const data = await res.json();
    return data.result === 1;
  } catch {
    return false;
  }
}

const DEV_SECRET_PREFIXES = [
  "HAUSAURA-super-secret",
  "test-secret",
  "dev-secret",
  "change-in-production",
  "your-secret",
  "super-secret",
];

function validateSecret(secret: string, name: string): void {
  if (secret.length < 32) {
    throw new Error(`${name} must be at least 32 characters long`);
  }
  if (process.env.NODE_ENV === "production") {
    const lower = secret.toLowerCase();
    for (const prefix of DEV_SECRET_PREFIXES) {
      if (lower.includes(prefix)) {
        throw new Error(
          `${name} appears to be a development value. Generate a secure secret with: openssl rand -base64 48`
        );
      }
    }
    const uniqueChars = new Set(secret).size;
    if (uniqueChars < 10) {
      throw new Error(
        `${name} has too little entropy. Generate a secure secret with: openssl rand -base64 48`
      );
    }
  }
}

function encodeSecret(secret: string): Uint8Array {
  return new TextEncoder().encode(secret);
}

export function getJWTSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET environment variable is required");
  validateSecret(secret, "JWT_SECRET");
  return encodeSecret(secret);
}

export function getAdminJWTSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET_ADMIN || process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET_ADMIN (or JWT_SECRET) environment variable is required");
  validateSecret(secret, "JWT_SECRET_ADMIN");
  return encodeSecret(secret);
}

export function getCustomerJWTSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET_CUSTOMER || process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET_CUSTOMER (or JWT_SECRET) environment variable is required");
  validateSecret(secret, "JWT_SECRET_CUSTOMER");
  return encodeSecret(secret);
}

export function getUnsubscribeJWTSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET_UNSUBSCRIBE || process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET_UNSUBSCRIBE (or JWT_SECRET) environment variable is required");
  validateSecret(secret, "JWT_SECRET_UNSUBSCRIBE");
  return encodeSecret(secret);
}

const COOKIE_NAME = "admin_token";
const TOKEN_EXPIRY = "24h";
const TOKEN_EXPIRY_SEC = 24 * 60 * 60;
// In production without Upstash, tokens cannot be reliably revoked across
// serverless instances. Use a short expiry as a safety net.
const EFFECTIVE_TOKEN_EXPIRY = (process.env.NODE_ENV === "production" && !useUpstash) ? "1h" : TOKEN_EXPIRY;
const EFFECTIVE_TOKEN_EXPIRY_SEC = (process.env.NODE_ENV === "production" && !useUpstash) ? 3600 : TOKEN_EXPIRY_SEC;
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export async function revokeToken(token: string): Promise<void> {
  const key = `HAUSAURA:blacklist:${token}`;
  await redisSet(key, "1", EFFECTIVE_TOKEN_EXPIRY_SEC);
  if (!useUpstash) {
    memoryBlacklist.set(key, Date.now() + EFFECTIVE_TOKEN_EXPIRY_SEC * 1000);
    if (process.env.NODE_ENV === "production") {
      logger.warn("auth", "Token revocation uses in-memory fallback — not shared across serverless instances. Configure UPSTASH_REDIS_REST_URL for production.");
    }
  }
}

export async function isTokenRevoked(token: string): Promise<boolean> {
  return redisExists(`HAUSAURA:blacklist:${token}`);
}

export interface AdminPayload {
  id: string;
  email: string;
  role: "ADMIN" | "EDITOR";
  name?: string;
  lastLoginAt?: number;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hash);
  } catch {
    return false;
  }
}

export async function generateToken(payload: AdminPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("HAUSAURA-admin")
    .setAudience("HAUSAURA-admin")
    .setExpirationTime(EFFECTIVE_TOKEN_EXPIRY)
    .sign(getAdminJWTSecret());
}

export async function verifyToken(token: string): Promise<AdminPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getAdminJWTSecret(), {
      algorithms: ["HS256"],
      issuer: "HAUSAURA-admin",
      audience: "HAUSAURA-admin",
    });
    const p = payload as Record<string, unknown>;
    if (
      typeof p === "object" &&
      p !== null &&
      "id" in p &&
      "email" in p &&
      "role" in p
    ) {
      const result: AdminPayload = {
        id: p.id as string,
        email: p.email as string,
        role: p.role as "ADMIN" | "EDITOR",
        name: (p.name as string) || undefined,
        lastLoginAt: typeof p.lastLoginAt === "number" ? p.lastLoginAt : undefined,
      };
      return result;
    }
    return null;
  } catch {
    return null;
  }
}

export async function getAdminFromRequest(): Promise<AdminPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  if (await isTokenRevoked(token)) return null;
  const payload = await verifyToken(token);
  if (!payload) return null;

  // Token rotation: reject tokens issued before the last login
  if (payload.lastLoginAt) {
    const admin = await prisma.adminUser.findUnique({
      where: { id: payload.id },
      select: { lastLogin: true },
    });
    if (admin?.lastLogin) {
      const lastLoginSec = Math.floor(admin.lastLogin.getTime() / 1000);
      if (payload.lastLoginAt < lastLoginSec) {
        return null;
      }
    }
  }

  return payload;
}

export async function requireAdmin(): Promise<AdminPayload> {
  const admin = await getAdminFromRequest();
  if (!admin) {
    throw new UnauthorizedError();
  }
  return admin;
}

export async function requireRole(role: "ADMIN" | "EDITOR"): Promise<AdminPayload> {
  const admin = await requireAdmin();
  if (admin.role !== role) {
    throw new UnauthorizedError("Keine Berechtigung für diese Aktion");
  }
  return admin;
}

export async function createUnsubscribeToken(email: string): Promise<string> {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("HAUSAURA-newsletter")
    .setAudience("HAUSAURA-unsubscribe")
    .setExpirationTime("30d")
    .sign(getUnsubscribeJWTSecret());
}

export async function verifyUnsubscribeToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, getUnsubscribeJWTSecret(), {
      algorithms: ["HS256"],
      issuer: "HAUSAURA-newsletter",
      audience: "HAUSAURA-unsubscribe",
    });
    const p = payload as Record<string, unknown>;
    if (typeof p === "object" && p !== null && "email" in p && typeof p.email === "string") {
      return p.email;
    }
    return null;
  } catch {
    return null;
  }
}

function isSecureRequest(request: { headers: Headers }): boolean {
  if (process.env.NODE_ENV === "production") return true;
  const proto = request.headers.get("x-forwarded-proto");
  if (proto) return proto === "https";
  const host = request.headers.get("host");
  if (host) {
    if (host.startsWith("localhost")) return false;
    if (host.startsWith("127.")) return false;
    if (host.endsWith(".local")) return false;
  }
  return false;
}

export function setAuthCookie(token: string, request?: { headers: Headers }) {
  const secure = request ? isSecureRequest(request) : process.env.NODE_ENV === "production";
  return {
    [COOKIE_NAME]: {
      value: token,
      httpOnly: true,
      secure,
      sameSite: "lax" as const,
      path: "/",
      maxAge: EFFECTIVE_TOKEN_EXPIRY_SEC,
    },
  };
}

export function clearAuthCookie(request?: { headers: Headers }) {
  const secure = request ? isSecureRequest(request) : process.env.NODE_ENV === "production";
  return {
    [COOKIE_NAME]: {
      value: "",
      httpOnly: true,
      secure,
      sameSite: "lax" as const,
      path: "/",
      maxAge: 0,
    },
  };
}

export async function checkLoginLockout(email: string): Promise<{ locked: boolean; retryAfterMs: number }> {
  const admin = await prisma.adminUser.findUnique({
    where: { email },
    select: { lockedUntil: true },
  });

  if (!admin || !admin.lockedUntil) {
    return { locked: false, retryAfterMs: 0 };
  }

  const now = new Date();
  if (now < admin.lockedUntil) {
    return {
      locked: true,
      retryAfterMs: admin.lockedUntil.getTime() - now.getTime(),
    };
  }

  await prisma.adminUser.update({
    where: { email },
    data: { failedAttempts: 0, lockedUntil: null },
  });

  return { locked: false, retryAfterMs: 0 };
}

export async function recordFailedLogin(email: string): Promise<void> {
  const admin = await prisma.adminUser.findUnique({
    where: { email },
    select: { id: true },
  });

  if (!admin) return;

  // Atomic: increment and check in one operation to prevent lockout bypass under concurrency
  const result = await prisma.adminUser.update({
    where: { id: admin.id },
    data: {
      failedAttempts: { increment: 1 },
    },
    select: { failedAttempts: true, lockedUntil: true },
  });

  // Only lock if not already locked AND threshold reached
  if (!result.lockedUntil && result.failedAttempts >= MAX_FAILED_ATTEMPTS) {
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { lockedUntil: new Date(Date.now() + LOCKOUT_DURATION_MS) },
    });
  }
}

export async function resetFailedLogins(email: string): Promise<void> {
  try {
    await prisma.adminUser.update({
      where: { email },
      data: { failedAttempts: 0, lockedUntil: null },
    });
  } catch {
    // Admin might not exist — ignore silently
  }
}

// Real bcrypt hash of a random 64-char string — used for timing-attack prevention
// when the admin account doesn't exist. Cost 12 matches our hashPassword cost.
const DUMMY_HASH = "$2b$12$LJ3m4ys4GvL5jXw8qF5e4OQH9kZ3vY8nR1mT6wP2sA7dBcEfGhIjK";

export async function authenticateAdmin(
  email: string,
  password: string
): Promise<AdminPayload | null> {
  const admin = await prisma.adminUser.findUnique({
    where: { email },
    select: { id: true, email: true, role: true, name: true, password: true },
  });

  const hashToCheck = admin?.password || DUMMY_HASH;
  const valid = await verifyPassword(password, hashToCheck);
  if (!valid) return null;

  if (!admin) return null;

  const loginTime = new Date();
  await prisma.adminUser.update({
    where: { id: admin.id },
    data: { lastLogin: loginTime },
  });

  return {
    id: admin.id,
    email: admin.email,
    role: admin.role as "ADMIN" | "EDITOR",
    name: admin.name || undefined,
    lastLoginAt: Math.floor(loginTime.getTime() / 1000),
  };
}

// ═══════════════════════════════════════════
// CUSTOMER AUTH
// ═══════════════════════════════════════════

const CUSTOMER_COOKIE = "customer_token";
const CUSTOMER_TOKEN_EXPIRY = "7d";
const CUSTOMER_TOKEN_EXPIRY_SEC = 7 * 24 * 60 * 60;
const CUSTOMER_MAX_FAILED = 5;
const CUSTOMER_LOCKOUT_MS = 15 * 60 * 1000;

export interface CustomerPayload {
  id: string;
  email: string;
  name: string;
}

export async function generateCustomerToken(payload: CustomerPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("HAUSAURA-customer")
    .setAudience("HAUSAURA-customer")
    .setExpirationTime(CUSTOMER_TOKEN_EXPIRY)
    .sign(getCustomerJWTSecret());
}

export async function verifyCustomerToken(token: string): Promise<CustomerPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getCustomerJWTSecret(), {
      algorithms: ["HS256"],
      issuer: "HAUSAURA-customer",
      audience: "HAUSAURA-customer",
    });
    const p = payload as Record<string, unknown>;
    if (typeof p === "object" && p !== null && "id" in p && "email" in p && "name" in p) {
      return {
        id: p.id as string,
        email: p.email as string,
        name: p.name as string,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export async function getCustomerFromRequest(): Promise<CustomerPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(CUSTOMER_COOKIE)?.value;
  if (!token) return null;
  if (await isTokenRevoked(token)) return null;
  return verifyCustomerToken(token);
}

export async function requireCustomer(): Promise<CustomerPayload> {
  const customer = await getCustomerFromRequest();
  if (!customer) {
    throw new UnauthorizedError();
  }
  return customer;
}

export function setCustomerCookie(token: string, request?: { headers: Headers }) {
  const secure = request ? isSecureRequest(request) : process.env.NODE_ENV === "production";
  return {
    [CUSTOMER_COOKIE]: {
      value: token,
      httpOnly: true,
      secure,
      sameSite: "lax" as const,
      path: "/",
      maxAge: CUSTOMER_TOKEN_EXPIRY_SEC,
    },
  };
}

export function clearCustomerCookie(request?: { headers: Headers }) {
  const secure = request ? isSecureRequest(request) : process.env.NODE_ENV === "production";
  return {
    [CUSTOMER_COOKIE]: {
      value: "",
      httpOnly: true,
      secure,
      sameSite: "lax" as const,
      path: "/",
      maxAge: 0,
    },
  };
}

export async function checkCustomerLockout(email: string): Promise<{ locked: boolean; retryAfterMs: number }> {
  const customer = await prisma.customer.findUnique({
    where: { email },
    select: { lockedUntil: true },
  });
  if (!customer || !customer.lockedUntil) return { locked: false, retryAfterMs: 0 };
  const now = new Date();
  if (now < customer.lockedUntil) {
    return { locked: true, retryAfterMs: customer.lockedUntil.getTime() - now.getTime() };
  }
  await prisma.customer.update({
    where: { email },
    data: { failedAttempts: 0, lockedUntil: null },
  });
  return { locked: false, retryAfterMs: 0 };
}

export async function recordCustomerFailedLogin(email: string): Promise<void> {
  const customer = await prisma.customer.findUnique({
    where: { email },
    select: { id: true },
  });
  if (!customer) return;
  const result = await prisma.customer.update({
    where: { id: customer.id },
    data: { failedAttempts: { increment: 1 } },
    select: { failedAttempts: true, lockedUntil: true },
  });
  if (!result.lockedUntil && result.failedAttempts >= CUSTOMER_MAX_FAILED) {
    await prisma.customer.update({
      where: { id: customer.id },
      data: { lockedUntil: new Date(Date.now() + CUSTOMER_LOCKOUT_MS) },
    });
  }
}

export async function resetCustomerFailedLogins(email: string): Promise<void> {
  try {
    await prisma.customer.update({
      where: { email },
      data: { failedAttempts: 0, lockedUntil: null },
    });
  } catch {
    // ignore
  }
}

export async function authenticateCustomer(
  email: string,
  password: string
): Promise<CustomerPayload | null> {
  const customer = await prisma.customer.findUnique({
    where: { email },
    select: { id: true, email: true, name: true, password: true },
  });
  const hashToCheck = customer?.password || DUMMY_HASH;
  const valid = await verifyPassword(password, hashToCheck);
  if (!valid || !customer) return null;
  await prisma.customer.update({
    where: { id: customer.id },
    data: { lastLogin: new Date() },
  });
  return { id: customer.id, email: customer.email, name: customer.name };
}
