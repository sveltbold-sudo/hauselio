import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api-helpers";
import { checkRateLimit } from "@/lib/rate-limit";
import { verifyUnsubscribeToken } from "@/lib/auth";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://hauselio.de";

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (!await checkRateLimit(`unsubscribe:${ip}`, 5, 60_000)) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return new NextResponse(
        `<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8"><title>Ungültiger Link</title></head><body style="font-family:sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;background:#FAFAF8;"><div style="text-align:center;padding:40px;background:white;border-radius:16px;box-shadow:0 4px 6px rgba(0,0,0,0.05);"><h1 style="color:#0A2540;">Ungültiger Link</h1><p style="color:#6B7280;">Der Abmelde-Link ist ungültig oder abgelaufen.</p><a href="${SITE_URL}" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#0A2540;color:white;border-radius:8px;text-decoration:none;">Zurück zur Startseite</a></div></body></html>`,
        { headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }

    const email = await verifyUnsubscribeToken(token);
    if (!email) {
      return new NextResponse(
        `<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8"><title>Link abgelaufen</title></head><body style="font-family:sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;background:#FAFAF8;"><div style="text-align:center;padding:40px;background:white;border-radius:16px;box-shadow:0 4px 6px rgba(0,0,0,0.05);"><h1 style="color:#0A2540;">Link abgelaufen</h1><p style="color:#6B7280;">Der Abmelde-Link ist abgelaufen. Bitte fordern Sie einen neuen an.</p><a href="${SITE_URL}" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#0A2540;color:white;border-radius:8px;text-decoration:none;">Zurück zur Startseite</a></div></body></html>`,
        { headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }

    const subscriber = await prisma.newsletter.findUnique({
      where: { email },
    });

    if (!subscriber) {
      return new NextResponse(
        `<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8"><title>E-Mail nicht gefunden</title></head><body style="font-family:sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;background:#FAFAF8;"><div style="text-align:center;padding:40px;background:white;border-radius:16px;box-shadow:0 4px 6px rgba(0,0,0,0.05);"><h1 style="color:#0A2540;">E-Mail nicht gefunden</h1><p style="color:#6B7280;">Diese E-Mail-Adresse ist nicht für unseren Newsletter registriert.</p><a href="${SITE_URL}" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#0A2540;color:white;border-radius:8px;text-decoration:none;">Zurück zur Startseite</a></div></body></html>`,
        { headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }

    await prisma.newsletter.update({
      where: { email },
      data: { isActive: false },
    });

    return new NextResponse(
      `<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8"><title>Abgemeldet</title></head><body style="font-family:sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;background:#FAFAF8;"><div style="text-align:center;padding:40px;background:white;border-radius:16px;box-shadow:0 4px 6px rgba(0,0,0,0.05);"><h1 style="color:#0A2540;">Erfolgreich abgemeldet</h1><p style="color:#6B7280;">Sie erhalten keine Newsletter mehr von HAUSELIO.</p><a href="${SITE_URL}" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#0A2540;color:white;border-radius:8px;text-decoration:none;">Zurück zur Startseite</a></div></body></html>`,
      { headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
