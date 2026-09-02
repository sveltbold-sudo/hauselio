import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError, validateContentType } from "@/lib/api-helpers";
import { CreateTestimonialSchema } from "@/lib/validations";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = getClientIp(request);
    if (!await checkRateLimit(`admin-testimonial-update:${ip}`, 30, 60_000)) {
      return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429, headers: { "Retry-After": "60" } });
    }

    const ctError = validateContentType(request, "application/json");
    if (ctError) return ctError;

    await requireAdmin();
    const { id } = await params;
    const body = await request.json();

    const allowedFields = ["isApproved", "isFeatured"];
    const invalidKeys = Object.keys(body).filter((k) => !allowedFields.includes(k));
    if (invalidKeys.length > 0) {
      return NextResponse.json({ error: `Ungültige Felder: ${invalidKeys.join(", ")}` }, { status: 400 });
    }

    if (Object.keys(body).length === 0) {
      return NextResponse.json({ error: "Keine Änderungen angegeben" }, { status: 400 });
    }

    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Testimonial nicht gefunden" }, { status: 404 });
    }

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: body,
    });

    const admin = await requireAdmin();
    logger.info("testimonial-patched", `Testimonial ${Object.keys(body).join(", ")} patched: ${testimonial.name} by ${admin.email}`);

    return NextResponse.json({ testimonial });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = getClientIp(request);
    if (!await checkRateLimit(`admin-testimonial-update:${ip}`, 30, 60_000)) {
      return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429, headers: { "Retry-After": "60" } });
    }

    const ctError = validateContentType(request, "application/json");
    if (ctError) return ctError;

    await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const parsed = CreateTestimonialSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]!.message }, { status: 400 });
    }

    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Testimonial nicht gefunden" }, { status: 404 });
    }

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: parsed.data,
    });

    const admin = await requireAdmin();
    logger.info("testimonial-updated", `Testimonial updated: ${testimonial.name} by ${admin.email}`);

    return NextResponse.json({ testimonial });
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
    if (!await checkRateLimit(`admin-testimonial-delete:${ip}`, 30, 60_000)) {
      return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429, headers: { "Retry-After": "60" } });
    }

    await requireAdmin();
    const { id } = await params;

    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Testimonial nicht gefunden" }, { status: 404 });
    }

    await prisma.testimonial.delete({ where: { id } });

    const admin = await requireAdmin();
    logger.info("testimonial-deleted", `Testimonial deleted: ${existing.name} by ${admin.email}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
