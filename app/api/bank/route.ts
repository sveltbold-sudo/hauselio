import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { handleApiError } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (!await checkRateLimit(`bank:${ip}`, 10, 60 * 1000)) {
      return NextResponse.json(
        { error: "Zu viele Anfragen" },
        { status: 429 }
      );
    }

    const origin = request.headers.get("origin") || request.headers.get("referer");
    const host = request.headers.get("host");
    if (origin && host) {
      try {
        const originHost = new URL(origin).host;
        if (originHost !== host) {
          return NextResponse.json(
            { error: "Ungültige Herkunft" },
            { status: 403 }
          );
        }
      } catch {
        return NextResponse.json(
          { error: "Ungültige Herkunft" },
          { status: 403 }
        );
      }
    }

    const settings = await prisma.siteSettings.findFirst();

    if (!settings) {
      return NextResponse.json(
        { error: "Keine Zahlungsdaten konfiguriert" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        bank: {
          accountName: settings.bankAccountName,
          iban: settings.bankIban,
          bic: settings.bankBic,
          bankName: settings.bankName,
        },
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
