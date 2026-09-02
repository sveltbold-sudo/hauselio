import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError, validateContentType, validateCsrfOrigin } from "@/lib/api-helpers";
import { CreateBrandSchema } from "@/lib/validations";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = getClientIp(request);
    if (!await checkRateLimit(`admin-marke-update:${ip}`, 30, 60_000)) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    const ctError = validateContentType(request, "application/json");
    if (ctError) return ctError;

    if (!validateCsrfOrigin(request)) {
      return NextResponse.json({ error: "CSRF-Token ungültig" }, { status: 403 });
    }

    const admin = await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const parsed = CreateBrandSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]!.message },
        { status: 400 }
      );
    }

    const { name } = parsed.data;
    const slug = name
      .toLowerCase()
      .replace(/[äöüß]/g, (m) => ({ ä: "ae", ö: "oe", ü: "ue", ß: "ss" }[m] || m))
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const existing = await prisma.brand.findFirst({
      where: { slug, NOT: { id } },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Eine Marke mit diesem Namen existiert bereits" },
        { status: 409 }
      );
    }

    const brand = await prisma.brand.update({
      where: { id },
      data: { name: name.trim(), slug },
      select: { id: true, name: true, slug: true },
    });

    try {
      // admin already captured
      logger.info("brand-updated", `Brand updated: ${brand.name} by ${admin.email}`);
    } catch (auditErr) {
      logger.error("brand-update-audit-failed", auditErr);
    }

    return NextResponse.json(brand);
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
    if (!await checkRateLimit(`admin-marke-delete:${ip}`, 10, 60_000)) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    const admin = await requireAdmin();
    const { id } = await params;

    if (!validateCsrfOrigin(_request)) {
      return NextResponse.json({ error: "CSRF-Token ungültig" }, { status: 403 });
    }

    const brand = await prisma.brand.findUnique({
      where: { id },
      select: { id: true, name: true, _count: { select: { products: true } } },
    });

    if (!brand) {
      return NextResponse.json({ error: "Marke nicht gefunden" }, { status: 404 });
    }

    if (brand._count.products > 0) {
      return NextResponse.json(
        { error: `Marke kann nicht gelöscht werden: ${brand._count.products} Produkte sind zugeordnet.` },
        { status: 400 }
      );
    }

    await prisma.brand.delete({ where: { id } });

    try {
      // admin already captured
      logger.info("brand-deleted", `Brand deleted: ${brand.name} by ${admin.email}`);
    } catch (auditErr) {
      logger.error("brand-delete-audit-failed", auditErr);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
