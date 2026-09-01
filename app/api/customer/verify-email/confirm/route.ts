import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { validateCsrfOrigin } from "@/lib/api-helpers";
import { z } from "zod";

const ConfirmVerificationSchema = z.object({
  token: z.string().min(1, "Token ist erforderlich"),
});

export async function POST(request: NextRequest) {
  try {
    if (!validateCsrfOrigin(request)) {
      return NextResponse.json(
        { error: "CSRF-Schutz: Ungültige Herkunft" },
        { status: 403 }
      );
    }

    const ip = getClientIp(request);
    if (!await checkRateLimit(`verify-email-confirm:${ip}`, 5, 15 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." },
        { status: 429, headers: { "Retry-After": "900" } }
      );
    }

    const body = await request.json();
    const parsed = ConfirmVerificationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]!.message },
        { status: 400 }
      );
    }

    const { token } = parsed.data;

    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      return NextResponse.json(
        { error: "Ungültiges oder abgelaufenes Verifizierungs-Token" },
        { status: 400 }
      );
    }

    if (verificationToken.expiresAt < new Date()) {
      await prisma.verificationToken.delete({ where: { token } });
      return NextResponse.json(
        { error: "Token abgelaufen. Bitte fordern Sie eine neue Verifizierungs-E-Mail an." },
        { status: 400 }
      );
    }

    // Mark email as verified
    await prisma.customer.update({
      where: { email: verificationToken.email },
      data: { emailVerified: new Date() },
    });

    // Delete used token
    await prisma.verificationToken.delete({ where: { token } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error confirming email verification:", error);
    return NextResponse.json(
      { error: "Fehler bei der E-Mail-Verifizierung" },
      { status: 500 }
    );
  }
}
