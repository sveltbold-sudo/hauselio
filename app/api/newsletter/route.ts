import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { requireRole } from "@/lib/auth";
import { handleApiError, validateContentType, validateCsrfOrigin } from "@/lib/api-helpers";
import { sendNewsletterConfirmation } from "@/lib/emails";
import { randomBytes } from "crypto";

const NewsletterSchema = z.object({
  email: z.string().email("Ungültige E-Mail-Adresse").max(254),
});

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
    if (!await checkRateLimit(`newsletter:${ip}`, 3, 60 * 1000)) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    const body = await request.json();
    const parsed = NewsletterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]!.message },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    const confirmToken = randomBytes(32).toString("hex");
    const confirmExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    const existing = await prisma.newsletter.findUnique({
      where: { email },
    });

    if (existing) {
      if (existing.confirmed) {
        return NextResponse.json({ success: true });
      }
      await prisma.newsletter.update({
        where: { email },
        data: { isActive: true, confirmToken, confirmExpiresAt },
      });
      await sendNewsletterConfirmation(email, confirmToken);
    } else {
      await prisma.newsletter.create({
        data: { email, isActive: true, confirmed: false, confirmToken, confirmExpiresAt },
      });
      await sendNewsletterConfirmation(email, confirmToken);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const ctError = validateContentType(request, "application/json");
    if (ctError) return ctError;

    if (!validateCsrfOrigin(request)) {
      return NextResponse.json({ error: "CSRF-Token ungültig" }, { status: 403 });
    }

    await requireRole("ADMIN");

    const ip = getClientIp(request);
    if (!await checkRateLimit(`newsletter-delete:${ip}`, 10, 60 * 1000)) {
      return NextResponse.json(
        { error: "Zu viele Anfragen" },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const parsed = NewsletterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Ungültige E-Mail-Adresse" },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    if (!email) {
      return NextResponse.json(
        { error: "E-Mail-Adresse ist erforderlich" },
        { status: 400 }
      );
    }

    const subscriber = await prisma.newsletter.findUnique({
      where: { email },
    });

    if (!subscriber) {
      return NextResponse.json(
        { error: "E-Mail-Adresse nicht gefunden" },
        { status: 404 }
      );
    }

    await prisma.newsletter.update({
      where: { email },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
