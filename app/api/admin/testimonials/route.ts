import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError, validateContentType } from "@/lib/api-helpers";
import { CreateTestimonialSchema } from "@/lib/validations";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    if (!await checkRateLimit(`admin-testimonials:${ip}`, 60, 60_000)) {
      return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429, headers: { "Retry-After": "60" } });
    }

    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const filter = searchParams.get("filter") || "all";
    const skip = (page - 1) * limit;

    const where = filter === "approved"
      ? { isApproved: true }
      : filter === "pending"
        ? { isApproved: false }
        : {};

    const [testimonials, total, pendingCount] = await Promise.all([
      prisma.testimonial.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.testimonial.count({ where }),
      prisma.testimonial.count({ where: { isApproved: false } }),
    ]);

    return NextResponse.json({
      testimonials,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      pendingCount,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    if (!await checkRateLimit(`admin-testimonial-create:${ip}`, 30, 60_000)) {
      return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429, headers: { "Retry-After": "60" } });
    }

    const ctError = validateContentType(request, "application/json");
    if (ctError) return ctError;

    const admin = await requireAdmin();
    const body = await request.json();
    const parsed = CreateTestimonialSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]!.message }, { status: 400 });
    }

    const testimonial = await prisma.testimonial.create({ data: parsed.data });

    // admin already captured
    logger.info("testimonial-created", `Testimonial created by ${admin.email}: ${testimonial.name}`);

    return NextResponse.json({ testimonial }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
