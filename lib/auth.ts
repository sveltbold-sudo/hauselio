import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { UnauthorizedError } from "./errors";

const DEV_SECRET_PREFIXES = [
  "hauselio-super-secret",
  "test-secret",
  "dev-secret",
  "change-in-production",
  "your-secret",
  "super-secret",
];

export function getJWTSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is required");
  }
  if (secret.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters long");
  }
  if (process.env.NODE_ENV === "production") {
    const lower = secret.toLowerCase();
    for (const prefix of DEV_SECRET_PREFIXES) {
      if (lower.includes(prefix)) {
        throw new Error(
          "JWT_SECRET appears to be a development value. Generate a secure secret with: openssl rand -base64 48"
        );
      }
    }
    const uniqueChars = new Set(secret).size;
    if (uniqueChars < 10) {
      throw new Error(
        "JWT_SECRET has too little entropy. Generate a secure secret with: openssl rand -base64 48"
      );
    }
  }
  return new TextEncoder().encode(secret);
}

const COOKIE_NAME = "admin_token";
const TOKEN_EXPIRY = "24h";
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export interface AdminPayload {
  id: string;
  email: string;
  role: "ADMIN" | "EDITOR";
  name?: string;
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
    .setIssuer("hauselio-admin")
    .setAudience("hauselio-admin")
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(getJWTSecret());
}

export async function verifyToken(token: string): Promise<AdminPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJWTSecret(), {
      algorithms: ["HS256"],
      issuer: "hauselio-admin",
      audience: "hauselio-admin",
    });
    const p = payload as Record<string, unknown>;
    if (
      typeof p === "object" &&
      p !== null &&
      "id" in p &&
      "email" in p &&
      "role" in p
    ) {
      return {
        id: p.id as string,
        email: p.email as string,
        role: p.role as "ADMIN" | "EDITOR",
        name: (p.name as string) || undefined,
      };
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
  return verifyToken(token);
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
    .setIssuer("hauselio-newsletter")
    .setAudience("hauselio-unsubscribe")
    .setExpirationTime("30d")
    .sign(getJWTSecret());
}

export async function verifyUnsubscribeToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, getJWTSecret(), {
      algorithms: ["HS256"],
      issuer: "hauselio-newsletter",
      audience: "hauselio-unsubscribe",
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
      maxAge: 24 * 60 * 60,
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

  const result = await prisma.adminUser.update({
    where: { id: admin.id },
    data: {
      failedAttempts: { increment: 1 },
    },
    select: { failedAttempts: true },
  });

  if (result.failedAttempts >= MAX_FAILED_ATTEMPTS) {
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { lockedUntil: new Date(Date.now() + LOCKOUT_DURATION_MS) },
    });
  }
}

export async function resetFailedLogins(email: string): Promise<void> {
  await prisma.adminUser.update({
    where: { email },
    data: { failedAttempts: 0, lockedUntil: null },
  });
}

const DUMMY_HASH = "$2b$12$dummyhashfortimingattackprevention000000000000000";

export async function authenticateAdmin(
  email: string,
  password: string
): Promise<AdminPayload | null> {
  const admin = await prisma.adminUser.findUnique({
    where: { email },
  });

  const hashToCheck = admin?.password || DUMMY_HASH;
  const valid = await verifyPassword(password, hashToCheck);
  if (!valid) return null;

  if (!admin) return null;

  await prisma.adminUser.update({
    where: { id: admin.id },
    data: { lastLogin: new Date() },
  });

  return {
    id: admin.id,
    email: admin.email,
    role: admin.role as "ADMIN" | "EDITOR",
    name: admin.name || undefined,
  };
}
