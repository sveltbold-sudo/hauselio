import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError, validateContentType } from "@/lib/api-helpers";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
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
    const ip = getClientIp(request);
    if (!await checkRateLimit(`admin-bewertung:${ip}`, 30, 60_000)) {
      return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429, headers: { "Retry-After": "60" } });
    }
    const { id } = await params;
    const body = await request.json();
    const parsed = UpdateReviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]!.message },
        { status: 400 }
      );
    }

    const existingReview = await prisma.review.findUnique({ where: { id }, select: { productId: true } });
    if (!existingReview) {
      return NextResponse.json({ error: "Review nicht gefunden" }, { status: 404 });
    }

    const review = await prisma.$transaction(async (tx) => {
      const updated = await tx.review.update({
        where: { id },
        data: { isApproved: parsed.data.isApproved },
      });

      const stats = await tx.review.aggregate({
        where: { productId: existingReview.productId, isApproved: true },
        _avg: { rating: true },
        _count: { rating: true },
      });

      await tx.product.update({
        where: { id: existingReview.productId },
        data: {
          rating: stats._avg.rating || 0,
          reviewCount: stats._count.rating,
        },
      });

      return updated;
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
    const ip = getClientIp(request);
    const allowed = await checkRateLimit(`admin-bewertung-delete:${ip}`, 30, 60_000);
    if (!allowed) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }
    const { id } = await params;

    const review = await prisma.review.findUnique({ where: { id }, select: { productId: true } });

    if (!review) {
      return NextResponse.json({ error: "Review nicht gefunden" }, { status: 404 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.review.delete({ where: { id } });

      const stats = await tx.review.aggregate({
        where: { productId: review.productId, isApproved: true },
        _avg: { rating: true },
        _count: { rating: true },
      });

      await tx.product.update({
        where: { id: review.productId },
        data: {
          rating: stats._avg.rating || 0,
          reviewCount: stats._count.rating,
        },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
