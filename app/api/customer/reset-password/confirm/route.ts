import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";
import { ResetPasswordSchema } from "@/lib/validations";
import { getCustomerJWTSecret, hashPassword } from "@/lib/auth";
import { validateContentType, validateCsrfOrigin } from "@/lib/api-helpers";
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
    if (!(await checkRateLimit(`customer-reset-confirm:${ip}`, 5, 15 * 60_000))) {
      return NextResponse.json(
        { error: "Zu viele Versuche. Bitte versuchen Sie es später erneut." },
        { status: 429, headers: { "Retry-After": "900" } }
      );
    }

    const body = await request.json();
    const parsed = ResetPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]!.message },
        { status: 400 }
      );
    }

    const { token, password } = parsed.data;

    let payload;
    try {
      const result = await jwtVerify(token, getCustomerJWTSecret(), {
        algorithms: ["HS256"],
        issuer: "HAUSAURA-customer-reset",
        audience: "HAUSAURA-customer-reset",
      });
      payload = result.payload as Record<string, unknown>;
    } catch {
      return NextResponse.json(
        { error: "Der Link ist ungültig oder abgelaufen. Bitte fordern Sie einen neuen an." },
        { status: 400 }
      );
    }

    if (
      typeof payload !== "object" ||
      payload === null ||
      typeof payload.id !== "string" ||
      typeof payload.purpose !== "string" ||
      payload.purpose !== "password-reset"
    ) {
      return NextResponse.json(
        { error: "Der Link ist ungültig oder abgelaufen." },
        { status: 400 }
      );
    }

    const customerId = payload.id;

    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      select: { id: true },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Konto nicht gefunden." },
        { status: 404 }
      );
    }

    const hashedPassword = await hashPassword(password);

    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        password: hashedPassword,
        failedAttempts: 0,
        lockedUntil: null,
        lastLogin: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Ihr Passwort wurde erfolgreich zurückgesetzt. Sie können sich jetzt anmelden.",
    });
  } catch (error) {
    logger.error("customer-reset-confirm", error);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}
