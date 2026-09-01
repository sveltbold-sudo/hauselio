import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import { prisma } from "@/lib/prisma";
import { ForgotPasswordSchema } from "@/lib/validations";
import { getJWTSecret } from "@/lib/auth";
import { validateContentType, validateCsrfOrigin } from "@/lib/api-helpers";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { sendPasswordResetEmail } from "@/lib/emails";
import { logger } from "@/lib/logger";

const RESET_TOKEN_EXPIRY = "1h";

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
    if (!(await checkRateLimit(`customer-reset-password:${ip}`, 3, 60_000))) {
      return NextResponse.json(
        { error: "Zu viele Versuche. Bitte versuchen Sie es später erneut." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    const body = await request.json();
    const parsed = ForgotPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]!.message },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    const customer = await prisma.customer.findUnique({
      where: { email },
      select: { id: true, email: true, name: true },
    });

    if (customer) {
      const token = await new SignJWT({
        id: customer.id,
        email: customer.email,
        purpose: "password-reset",
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setIssuer("HAUSAURA-customer-reset")
        .setAudience("HAUSAURA-customer-reset")
        .setExpirationTime(RESET_TOKEN_EXPIRY)
        .sign(getJWTSecret());

      await sendPasswordResetEmail(customer.email, customer.name, token).catch(
        (err) => logger.error("send-reset-email", err)
      );
    }

    return NextResponse.json({
      success: true,
      message: "Falls ein Konto mit dieser E-Mail-Adresse existiert, haben wir Ihnen einen Link zum Zurücksetzen des Passworts gesendet.",
    });
  } catch (error) {
    logger.error("customer-reset-password", error);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}
