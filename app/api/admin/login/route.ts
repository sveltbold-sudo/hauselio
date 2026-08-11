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
import { checkRateLimit, getRemainingAttempts } from "@/lib/rate-limit";
import { validateContentType } from "@/lib/api-helpers";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const rateLimitKey = `login:${ip}`;

    if (!await checkRateLimit(rateLimitKey, MAX_ATTEMPTS, WINDOW_MS)) {
      const { remaining, retryAfterMs } = await getRemainingAttempts(rateLimitKey, MAX_ATTEMPTS, WINDOW_MS);
      const retryAfterSec = Math.ceil(retryAfterMs / 1000);

      return NextResponse.json(
        {
          error: `Zu viele Versuche. Versuchen Sie es in ${retryAfterSec} Sekunden erneut.`,
          remaining,
          retryAfterSec,
        },
        {
          status: 429,
          headers: { "Retry-After": String(retryAfterSec) },
        }
      );
    }

    const ctError = validateContentType(request, "application/json");
    if (ctError) return ctError;

    const body = await request.json();
    const parsed = LoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const lockout = await checkLoginLockout(email);
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

    const admin = await authenticateAdmin(email, password);

    if (!admin) {
      await recordFailedLogin(email);
      return NextResponse.json(
        { error: "Ungültige Anmeldedaten" },
        { status: 401 }
      );
    }

    await resetFailedLogins(email);

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
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}
