import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmailVerification } from "@/lib/emails";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { validateCsrfOrigin, validateContentType } from "@/lib/api-helpers";
import { z } from "zod";
import crypto from "crypto";

const RequestVerificationSchema = z.object({
  email: z.string().email("Ungültige E-Mail-Adresse"),
});

export async function POST(request: NextRequest) {
  try {
    const ctError = validateContentType(request, "application/json");
    if (ctError) return ctError;

    if (!validateCsrfOrigin(request)) {
      return NextResponse.json(
        { error: "CSRF-Schutz: Ungültige Herkunft" },
        { status: 403 }
      );
    }

    const ip = getClientIp(request);
    if (!await checkRateLimit(`verify-email:${ip}`, 3, 15 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." },
        { status: 429, headers: { "Retry-After": "900" } }
      );
    }

    const body = await request.json();
    const parsed = RequestVerificationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]!.message },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    const customer = await prisma.customer.findUnique({ where: { email } });
    if (!customer) {
      // Don't reveal whether email exists
      return NextResponse.json({ success: true });
    }

    if (customer.emailVerified) {
      return NextResponse.json({ success: true });
    }

    // Invalidate old tokens
    await prisma.verificationToken.deleteMany({ where: { email } });

    // Create new token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.verificationToken.create({
      data: {
        token,
        email,
        expiresAt,
      },
    });

    // Send verification email
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.hausaura.de";
    const verificationUrl = `${siteUrl}/email-verifizieren?token=${token}`;

    await sendEmailVerification({
      to: email,
      name: customer.name,
      verificationUrl,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error requesting email verification:", error);
    return NextResponse.json(
      { error: "Fehler beim Senden der Verifizierungs-E-Mail" },
      { status: 500 }
    );
  }
}
