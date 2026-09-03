import { NextRequest, NextResponse } from "next/server";
import { revokeToken, clearCustomerCookie } from "@/lib/auth";
import { validateCsrfOrigin, applyCookiesToResponse } from "@/lib/api-helpers";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { cookies } from "next/headers";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const allowed = await checkRateLimit(`customer-logout:${ip}`, 20, 60_000);
    if (!allowed) {
      return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429 });
    }

    if (!validateCsrfOrigin(request)) {
      return NextResponse.json(
        { error: "CSRF-Schutz: Ungültige Herkunft" },
        { status: 403 }
      );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("customer_token")?.value;

    if (token) {
      await revokeToken(token).catch((e) =>
        logger.error("customer-logout-revoke", e)
      );
    }

    const response = NextResponse.json({ success: true });
    const cookieOptions = clearCustomerCookie(request);

    applyCookiesToResponse(response, cookieOptions);

    return response;
  } catch (error) {
    logger.error("customer-logout", error);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}
