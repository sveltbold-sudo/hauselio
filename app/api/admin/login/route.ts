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
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

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

    const ip = getClientIp(request);
    if (!await checkRateLimit(`admin-login:${ip}`, 10, 15 * 60_000)) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." },
        { status: 429, headers: { "Retry-After": "900" } }
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
      await recordFailedLogin(email).catch((e) => logger.error("record-failed-login", e));
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
    logger.error("login", error);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}
