import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError, validateContentType } from "@/lib/api-helpers";
import { checkRateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const UpdateReviewSchema = z.object({
  isApproved: z.boolean(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ctError = validateContentType(request, "application/json");
    if (ctError) return ctError;

    await requireAdmin();
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (!await checkRateLimit(`admin-bewertung:${ip}`, 30, 60_000)) {
      return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429 });
    }
    const { id } = await params;
    const body = await request.json();
    const parsed = UpdateReviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const review = await prisma.review.update({
      where: { id },
      data: { isApproved: parsed.data.isApproved },
    });

    const stats = await prisma.review.aggregate({
      where: { productId: review.productId, isApproved: true },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await prisma.product.update({
      where: { id: review.productId },
      data: {
        rating: stats._avg.rating || 0,
        reviewCount: stats._count.rating,
      },
    });

    return NextResponse.json({ review });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const review = await prisma.review.findUnique({ where: { id }, select: { productId: true } });
    await prisma.review.delete({ where: { id } });

    if (review) {
      const stats = await prisma.review.aggregate({
        where: { productId: review.productId, isApproved: true },
        _avg: { rating: true },
        _count: { rating: true },
      });

      await prisma.product.update({
        where: { id: review.productId },
        data: {
          rating: stats._avg.rating || 0,
          reviewCount: stats._count.rating,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
