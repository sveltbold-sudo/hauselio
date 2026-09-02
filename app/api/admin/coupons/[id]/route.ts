import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError, validateContentType, validateCsrfOrigin } from "@/lib/api-helpers";
import { CreateCouponSchema } from "@/lib/validations";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = getClientIp(request);
    if (!await checkRateLimit(`admin-coupon-update:${ip}`, 30, 60_000)) {
      return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429, headers: { "Retry-After": "60" } });
    }

    const ctError = validateContentType(request, "application/json");
    if (ctError) return ctError;

    if (!validateCsrfOrigin(request)) {
      return NextResponse.json({ error: "CSRF-Token ungültig" }, { status: 403 });
    }

    const admin = await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const parsed = CreateCouponSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]!.message }, { status: 400 });
    }

    const existing = await prisma.coupon.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Gutschein nicht gefunden" }, { status: 404 });
    }

    const { code, ...data } = parsed.data;

    const duplicate = await prisma.coupon.findFirst({
      where: { code: code.toUpperCase(), NOT: { id } },
    });
    if (duplicate) {
      return NextResponse.json({ error: "Ein Gutschein mit diesem Code existiert bereits" }, { status: 409 });
    }

    const coupon = await prisma.coupon.update({
      where: { id },
      data: { code: code.toUpperCase(), ...data },
    });

    try {
      // admin already captured
      logger.info("coupon-updated", `Coupon updated: ${coupon.code} by ${admin.email}`);
    } catch (auditErr) {
      logger.error("coupon-update-audit-failed", auditErr);
    }

    return NextResponse.json({ coupon });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = getClientIp(_request);
    if (!await checkRateLimit(`admin-coupon-delete:${ip}`, 30, 60_000)) {
      return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429, headers: { "Retry-After": "60" } });
    }

    const admin = await requireAdmin();

    if (!validateCsrfOrigin(_request)) {
      return NextResponse.json({ error: "CSRF-Token ungültig" }, { status: 403 });
    }

    const { id } = await params;

    const coupon = await prisma.coupon.findUnique({ where: { id } });
    if (!coupon) {
      return NextResponse.json({ error: "Gutschein nicht gefunden" }, { status: 404 });
    }

    await prisma.coupon.delete({ where: { id } });

    try {
      // admin already captured
      logger.info("coupon-deleted", `Coupon deleted: ${coupon.code} by ${admin.email}`);
    } catch (auditErr) {
      logger.error("coupon-delete-audit-failed", auditErr);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
