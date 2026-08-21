import { NextResponse, NextRequest } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendNewsletterCampaign } from "@/lib/emails";
import { handleApiError, validateContentType } from "@/lib/api-helpers";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { z } from "zod";

const CampaignSchema = z.object({
  subject: z.string().min(1, "Betreff ist erforderlich").max(200),
  content: z.string().min(1, "Inhalt ist erforderlich"),
});

export async function POST(request: NextRequest) {
  try {
    const ctError = validateContentType(request, "application/json");
    if (ctError) return ctError;

    await requireRole("ADMIN");
    const ip = getClientIp(request);
    if (!await checkRateLimit(`admin-newsletter-send:${ip}`, 3, 60_000)) {
      return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429 });
    }

    const body = await request.json();
    const parsed = CampaignSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { subject, content } = parsed.data;
    const sanitizedContent = content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
      .replace(/ on\w+="[^"]*"/gi, "")
      .replace(/ on\w+='[^']*'/gi, "");

    const subscribers = await prisma.newsletter.findMany({
      where: { isActive: true, confirmed: true },
      select: { email: true },
    });

    if (subscribers.length === 0) {
      return NextResponse.json(
        { error: "Keine aktiven Abonnenten vorhanden." },
        { status: 400 }
      );
    }

    const emails = subscribers.map((s) => s.email);
    const result = await sendNewsletterCampaign({ subject, content: sanitizedContent, emails });

    return NextResponse.json({
      success: true,
      sent: result.sent,
      failed: result.failed,
      total: result.total,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
