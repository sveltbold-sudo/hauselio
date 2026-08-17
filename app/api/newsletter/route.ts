import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { checkRateLimit } from "@/lib/rate-limit";
import { requireAdmin } from "@/lib/auth";
import { handleApiError, validateCsrfOrigin, validateContentType } from "@/lib/api-helpers";
import { sendNewsletterConfirmation } from "@/lib/emails";

const NewsletterSchema = z.object({
  email: z.string().email("Ungültige E-Mail-Adresse").max(254),
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

    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (!await checkRateLimit(`newsletter:${ip}`, 3, 60 * 1000)) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = NewsletterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    const existing = await prisma.newsletter.findUnique({
      where: { email },
    });

    if (existing) {
      if (existing.confirmed) {
        return NextResponse.json({ success: true });
      }
      const confirmToken = crypto.randomUUID();
      await prisma.newsletter.update({
        where: { email },
        data: { isActive: true, confirmToken },
      });
      await sendNewsletterConfirmation(email, confirmToken);
    } else {
      const confirmToken = crypto.randomUUID();
      await prisma.newsletter.create({
        data: { email, isActive: true, confirmed: false, confirmToken },
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
    await requireAdmin();

    if (!validateCsrfOrigin(request)) {
      return NextResponse.json(
        { error: "CSRF-Schutz: Ungültige Herkunft" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

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
