import { NextRequest, NextResponse } from "next/server";
import { LoginSchema } from "@/lib/validations";
import {
  authenticateAdmin,
  generateToken,
  setAuthCookie,
  checkLoginLockout,
  recordFailedLogin,
  resetFailedLogins,
} from "@/lib/auth";
import { validateContentType, validateCsrfOrigin } from "@/lib/api-helpers";

const ipAttempts = new Map<string, { count: number; resetAt: number }>();

function checkIpRateLimit(ip: string, max = 10, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = ipAttempts.get(ip);
  if (!entry || now > entry.resetAt) {
    ipAttempts.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= max) return false;
  entry.count++;
  return true;
}

async function withRetry<T>(fn: () => Promise<T>, retries = 2): Promise<T> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === retries) throw error;
      await new Promise((r) => setTimeout(r, 100 * (attempt + 1)));
    }
  }
  throw new Error("unreachable");
}

export async function POST(request: NextRequest) {
  try {
    if (!validateCsrfOrigin(request)) {
      return NextResponse.json(
        { error: "CSRF-Schutz: Ungültige Herkunft" },
        { status: 403 }
      );
    }

    const ctError = validateContentType(request, "application/json");
    if (ctError) return ctError;

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";
    if (!checkIpRateLimit(ip)) {
      return NextResponse.json(
        { error: "Zu viele Anmeldeversuche. Bitte warten Sie." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = LoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const lockout = await withRetry(() => checkLoginLockout(email));
    if (lockout.locked) {
      const retryAfterSec = Math.ceil(lockout.retryAfterMs / 1000);
      return NextResponse.json(
        {
          error: `Konto gesperrt. Versuchen Sie es in ${retryAfterSec} Sekunden erneut.`,
          retryAfterSec,
        },
        {
          status: 429,
          headers: { "Retry-After": String(retryAfterSec) },
        }
      );
    }

    const admin = await withRetry(() => authenticateAdmin(email, password));

    if (!admin) {
      await recordFailedLogin(email).catch(() => {});
      return NextResponse.json(
        { error: "Ungültige Anmeldedaten" },
        { status: 401 }
      );
    }

    await resetFailedLogins(email).catch(() => {});

    const token = await generateToken(admin);
    const cookieOptions = setAuthCookie(token, request);

    const response = NextResponse.json({
      success: true,
      admin: { email: admin.email, role: admin.role },
    });

    Object.entries(cookieOptions).forEach(([name, options]) => {
      response.cookies.set(name, options.value, {
        httpOnly: options.httpOnly,
        secure: options.secure,
        sameSite: options.sameSite,
        path: options.path,
        maxAge: options.maxAge,
      });
    });

    return response;
  } catch (error) {
    console.error("[HAUSELIO] Login error:", error);
    const isEnvError =
      error instanceof Error &&
      (error.message.includes("environment variable") ||
        error.message.includes("JWT_SECRET"));
    const message = isEnvError
      ? "Server-Konfigurationsfehler"
      : `Serverfehler: ${error instanceof Error ? error.message : "Unbekannt"}`;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
