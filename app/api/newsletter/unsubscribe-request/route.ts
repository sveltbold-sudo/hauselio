import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { createUnsubscribeToken } from "@/lib/auth";
import { sendEmail, baseTemplate, headerBanner } from "@/lib/emails/helpers";
import { FROM_EMAIL } from "@/lib/resend";
import { SITE_URL } from "@/lib/constants";
import { logger } from "@/lib/logger";

const UnsubscribeRequestSchema = z.object({
  email: z.string().email("Ungültige E-Mail-Adresse").max(254),
});

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    if (!await checkRateLimit(`unsubscribe-request:${ip}`, 3, 60_000)) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    const body = await request.json();
    const parsed = UnsubscribeRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]!.message },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    const subscriber = await prisma.newsletter.findUnique({
      where: { email },
    });

    if (!subscriber || !subscriber.isActive) {
      return NextResponse.json({
        success: true,
        message: "Falls diese E-Mail-Adresse bei uns registriert ist, erhalten Sie in Kürze einen Abmeldelink.",
      });
    }

    const token = await createUnsubscribeToken(email);
    const unsubscribeUrl = `${SITE_URL}/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}`;

    const html = baseTemplate(`
      ${headerNewsletterUnsubscribe()}
      <div style="padding:36px 40px;">
        <p style="color:#4B5563;font-size:15px;margin:0 0 24px 0;line-height:1.6;">
          Hallo,
        </p>
        <p style="color:#4B5563;font-size:14px;margin:0 0 24px 0;line-height:1.6;">
          Sie haben sich vom HAUSAURA Newsletter abgemelden möchten. Klicken Sie auf den folgenden Button, um die Abmeldung abzuschließen:
        </p>
        <div style="text-align:center;padding:16px 0 24px 0;">
          <a href="${unsubscribeUrl}" style="display:inline-block;background-color:#DC2626;color:#FFFFFF;font-size:15px;font-weight:700;text-decoration:none;padding:16px 40px;border-radius:10px;">
            Newsletter abmelden
          </a>
        </div>
        <div style="border-top:1px solid #E8ECF1;padding-top:20px;">
          <p style="color:#9CA3AF;font-size:12px;margin:0;line-height:1.5;">
            Dieser Link ist 30 Tage gültig. Wenn Sie sich nicht abmelden möchten, ignorieren Sie diese E-Mail einfach.
          </p>
        </div>
      </div>
    `);

    await sendEmail({
      from: FROM_EMAIL,
      to: email,
      subject: "Newsletter abmelden — HAUSAURA",
      html,
    }).catch((err) => logger.error("unsubscribe-request-email", err));

    return NextResponse.json({
      success: true,
      message: "Falls diese E-Mail-Adresse bei uns registriert ist, erhalten Sie in Kürze einen Abmeldelink.",
    });
  } catch (error) {
    logger.error("unsubscribe-request", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut." },
      { status: 500 }
    );
  }
}

function headerNewsletterUnsubscribe(): string {
  const SITE = SITE_URL.startsWith("http") ? SITE_URL : `https://${SITE_URL}`;
  const LOGO_URL = `${SITE}/logos/logosecondaire.png`;
  return `<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0A2540;">
    <tr>
      <td style="padding:36px 40px 32px 40px;">
        <h1 style="color:#FFFFFF;font-size:22px;font-weight:800;margin:0 0 6px 0;letter-spacing:-0.3px;">Newsletter abmelden</h1>
        <p style="color:rgba(255,255,255,0.7);font-size:13px;margin:0;font-weight:400;">HAUSAURA</p>
      </td>
    </tr>
  </table>`;
}
