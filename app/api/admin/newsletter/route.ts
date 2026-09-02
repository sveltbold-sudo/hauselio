import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api-helpers";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    if (!await checkRateLimit(`admin-newsletter-get:${ip}`, 60, 60_000)) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50", 10) || 50));
    const search = searchParams.get("search")?.trim() || "";

    const where = search ? { email: { contains: search, mode: "insensitive" as const } } : {};

    const [subscribers, total, activeCount] = await Promise.all([
      prisma.newsletter.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          email: true,
          isActive: true,
          confirmed: true,
          createdAt: true,
        },
      }),
      prisma.newsletter.count({ where }),
      prisma.newsletter.count({ where: { ...where, isActive: true } }),
    ]);

    return NextResponse.json({
      subscribers,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      activeCount,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
