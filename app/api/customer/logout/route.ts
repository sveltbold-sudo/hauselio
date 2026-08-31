import { NextRequest, NextResponse } from "next/server";
import { revokeToken, clearCustomerCookie } from "@/lib/auth";
import { validateCsrfOrigin } from "@/lib/api-helpers";
import { cookies } from "next/headers";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
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
    logger.error("customer-logout", error);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}
