import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { RegisterSchema } from "@/lib/validations";
import { handleApiError } from "@/lib/api-helpers";
import {
  hashPassword,
  generateCustomerToken,
  setCustomerCookie,
} from "@/lib/auth";
import { validateContentType, validateCsrfOrigin, applyCookiesToResponse } from "@/lib/api-helpers";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import { sendEmailVerification } from "@/lib/emails";
import crypto from "crypto";
import { SITE_URL } from "@/lib/constants";

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
    if (!(await checkRateLimit(`customer-register:${ip}`, 5, 15 * 60_000))) {
      return NextResponse.json(
        { error: "Zu viele Versuche. Bitte versuchen Sie es später erneut." },
        { status: 429, headers: { "Retry-After": "900" } }
      );
    }

    const body = await request.json();
    const parsed = RegisterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]!.message },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    const existing = await prisma.customer.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existing) {
      // Return success to prevent email enumeration — caller checks via verification email
      return NextResponse.json(
        { message: "Falls ein Konto mit dieser E-Mail-Adresse existiert, haben wir einen Bestätigungslink gesendet." },
        { status: 200 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: { id: true, email: true, name: true },
    });

    // Send email verification (don't block response)
    try {
      const siteUrl = SITE_URL.startsWith("http") ? SITE_URL : `https://${SITE_URL}`;
      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await prisma.verificationToken.create({
        data: { token, email, expiresAt },
      });

      const verificationUrl = `${siteUrl}/email-verifizieren?token=${token}`;
      await sendEmailVerification({
        to: email,
        name: customer.name,
        verificationUrl,
      });
    } catch (emailError) {
      logger.error("Failed to send verification email", {
        email,
        error: emailError instanceof Error ? emailError.message : String(emailError),
      });
    }

    const token = await generateCustomerToken(customer);
    const cookieOptions = setCustomerCookie(token, request);

    const response = NextResponse.json({
      success: true,
      customer: { email: customer.email, name: customer.name },
    }, { status: 201 });

    applyCookiesToResponse(response, cookieOptions);

    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
