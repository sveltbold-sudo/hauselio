import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { validateCsrfOrigin, handleApiError } from "@/lib/api-helpers";

export async function POST(request: NextRequest) {
  try {
    if (!validateCsrfOrigin(request)) {
      return NextResponse.json(
        { error: "CSRF-Schutz: Ungültige Herkunft" },
        { status: 403 }
      );
    }

    const ip = getClientIp(request);
    if (!await checkRateLimit(`coupon:${ip}`, 10, 60 * 1000)) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    const body = await request.json();
    const rawCode = typeof body.code === "string" ? body.code : "";
    const code = rawCode.trim().toUpperCase();

    if (!code) {
      return NextResponse.json(
        { error: "Gutscheincode ist erforderlich" },
        { status: 400 }
      );
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code },
    });

    if (!coupon) {
      return NextResponse.json(
        { valid: false, error: "Ungültiger Gutscheincode" },
        { status: 200 }
      );
    }

    if (!coupon.isActive) {
      return NextResponse.json(
        { valid: false, error: "Gutscheincode ist nicht mehr aktiv" },
        { status: 200 }
      );
    }

    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return NextResponse.json(
        { valid: false, error: "Gutscheincode ist abgelaufen" },
        { status: 200 }
      );
    }

    if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json(
        { valid: false, error: "Gutscheincode wurde bereits maximal oft verwendet" },
        { status: 200 }
      );
    }

    return NextResponse.json({
      valid: true,
      code: coupon.code,
      discountPercent: coupon.discountPercent,
      label: `${coupon.discountPercent}% Rabatt`,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
