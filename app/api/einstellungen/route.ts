import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { handleApiError } from "@/lib/api-helpers";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    if (!await checkRateLimit(`einstellungen:${ip}`, 30, 60_000)) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    await requireAdmin();

    const settings = await prisma.siteSettings.findFirst();

    if (!settings) {
      return NextResponse.json(
        {
          settings: {
            bankAccountName: "",
            bankIban: "",
            bankBic: "",
            bankName: "",
            contactEmail: "",
            contactPhone: "",
            contactAddress: "",
            shippingInfo: "",
          },
        },
        {
          headers: { "Cache-Control": "private, no-store, no-cache, must-revalidate" },
        }
      );
    }

    return NextResponse.json(
      {
        settings: {
          bankAccountName: settings.bankAccountName,
          bankIban: settings.bankIban,
          bankBic: settings.bankBic,
          bankName: settings.bankName,
          contactEmail: settings.contactEmail,
          contactPhone: settings.contactPhone,
          contactAddress: settings.contactAddress,
          shippingInfo: settings.shippingInfo,
        },
      },
      {
        headers: { "Cache-Control": "private, no-store, no-cache, must-revalidate" },
      }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
