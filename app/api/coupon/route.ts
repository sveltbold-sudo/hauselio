import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const COUPONS: Record<string, { discountPercent: number; label: string; minCart?: number; maxUses?: number }> = {
  HAUSAURA10: { discountPercent: 10, label: "10% Rabatt" },
};

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    if (!await checkRateLimit(`coupon:${ip}`, 10, 60 * 1000)) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    const body = await request.json();
    const code = (body.code || "").trim().toUpperCase();
    const cartTotal = Number(body.cartTotal) || 0;

    if (!code) {
      return NextResponse.json(
        { error: "Gutscheincode ist erforderlich" },
        { status: 400 }
      );
    }

    const coupon = COUPONS[code];
    if (!coupon) {
      return NextResponse.json(
        { valid: false, error: "Ungültiger Gutscheincode" },
        { status: 200 }
      );
    }

    if (coupon.minCart && cartTotal < coupon.minCart) {
      return NextResponse.json(
        { valid: false, error: `Mindestbestellwert: ${coupon.minCart}€` },
        { status: 200 }
      );
    }

    return NextResponse.json({
      valid: true,
      code,
      discountPercent: coupon.discountPercent,
      label: coupon.label,
    });
  } catch {
    return NextResponse.json(
      { error: "Fehler bei der Gutscheinprüfung" },
      { status: 500 }
    );
  }
}
