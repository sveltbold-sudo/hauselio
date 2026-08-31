import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api-helpers";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    if (!await checkRateLimit(`kontakt-settings:${ip}`, 60, 60_000)) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    const settings = await prisma.siteSettings.findFirst();

    return NextResponse.json(
      {
        contactEmail: settings?.contactEmail || "info@hausaura.de",
        contactPhone: settings?.contactPhone || "+49 (0)30 555 789 01",
        contactAddress: settings?.contactAddress || "Kastanienallee 42, 10435 Berlin",
      },
      {
        headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200" },
      }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
