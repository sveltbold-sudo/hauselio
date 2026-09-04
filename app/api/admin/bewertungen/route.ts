import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api-helpers";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    if (!await checkRateLimit(`admin-bewertungen-get:${ip}`, 60, 60_000)) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10) || 20));
    const filter = searchParams.get("filter") || "all";

    const where: { isApproved?: boolean } = {};
    if (filter === "pending") where.isApproved = false;
    else if (filter === "approved") where.isApproved = true;

    const [reviews, total, pendingCount] = await Promise.all([
      prisma.review.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          rating: true,
          title: true,
          content: true,
          authorName: true,
          authorEmail: true,
          isApproved: true,
          productId: true,
          createdAt: true,
          updatedAt: true,
          product: { select: { name: true, slug: true } },
        },
      }),
      prisma.review.count({ where }),
      prisma.review.count({ where: { isApproved: false } }),
    ]);

    return NextResponse.json({
      reviews,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      pendingCount,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
