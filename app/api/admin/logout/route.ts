import { NextRequest, NextResponse } from "next/server";
import { clearAuthCookie, revokeToken, requireAdmin } from "@/lib/auth";
import { handleApiError, validateCsrfOrigin } from "@/lib/api-helpers";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    if (!validateCsrfOrigin(request)) {
      return NextResponse.json(
        { error: "CSRF-Schutz: Ungültige Herkunft" },
        { status: 403 }
      );
    }

    const ip = getClientIp(request);
    if (!await checkRateLimit(`admin-logout:${ip}`, 20, 60_000)) {
      return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429, headers: { "Retry-After": "60" } });
    }

    await requireAdmin();

    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (token) {
      await revokeToken(token);
    }

    const response = NextResponse.json({ success: true });
    const cookieOptions = clearAuthCookie();

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
    return handleApiError(error);
  }
}
