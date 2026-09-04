import { NextRequest, NextResponse } from "next/server";
import { CustomerLoginSchema } from "@/lib/validations";
import {
  authenticateCustomer,
  authenticateAdmin,
  generateCustomerToken,
  setCustomerCookie,
  checkCustomerLockout,
  recordCustomerFailedLogin,
  resetCustomerFailedLogins,
} from "@/lib/auth";
import { validateContentType, validateCsrfOrigin, applyCookiesToResponse } from "@/lib/api-helpers";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

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
    if (!(await checkRateLimit(`customer-login:${ip}`, 10, 15 * 60_000))) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." },
        { status: 429, headers: { "Retry-After": "900" } }
      );
    }

    const body = await request.json();
    const parsed = CustomerLoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]!.message },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const lockout = await checkCustomerLockout(email);
    if (lockout.locked) {
      const retryAfterSec = Math.ceil(lockout.retryAfterMs / 1000);
      return NextResponse.json(
        {
          error: "Zu viele Versuche. Bitte versuchen Sie es später erneut.",
          retryAfterSec,
        },
        {
          status: 429,
          headers: { "Retry-After": String(retryAfterSec) },
        }
      );
    }

    const customer = await authenticateCustomer(email, password);

    if (!customer) {
      const admin = await authenticateAdmin(email, password);
      if (admin) {
        await resetCustomerFailedLogins(email).catch(() => {});
        const payload = { id: admin.id, email: admin.email, name: admin.name || admin.email };
        const token = await generateCustomerToken(payload);
        const cookieOptions = setCustomerCookie(token, request);
        const response = NextResponse.json({
          success: true,
          customer: { id: admin.id, email: admin.email, name: admin.name || admin.email },
        });
        applyCookiesToResponse(response, cookieOptions);
        return response;
      }
      await recordCustomerFailedLogin(email).catch((e) =>
        logger.error("record-customer-failed-login", e)
      );
      return NextResponse.json(
        { error: "Ungültige Anmeldedaten" },
        { status: 401 }
      );
    }

    await resetCustomerFailedLogins(email).catch(() => {});

    const token = await generateCustomerToken(customer);
    const cookieOptions = setCustomerCookie(token, request);

    const response = NextResponse.json({
      success: true,
      customer: { id: customer.id, email: customer.email, name: customer.name },
    });

    applyCookiesToResponse(response, cookieOptions);

    return response;
  } catch (error) {
    logger.error("customer-login", error);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}
