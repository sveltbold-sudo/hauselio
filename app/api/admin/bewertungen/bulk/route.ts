import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError, validateContentType } from "@/lib/api-helpers";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { logActivity } from "@/lib/activity-log";
import { z } from "zod";

const BulkReviewSchema = z.object({
  action: z.enum(["approve", "reject", "delete"]),
  ids: z.array(z.string().uuid()).min(1).max(100),
});

export async function POST(request: NextRequest) {
  try {
    const ctError = validateContentType(request, "application/json");
    if (ctError) return ctError;

    const admin = await requireAdmin();
    const ip = getClientIp(request);
    if (!await checkRateLimit(`admin-bewertungen-bulk:${ip}`, 10, 60_000)) {
      return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429, headers: { "Retry-After": "60" } });
    }

    const body = await request.json();
    const parsed = BulkReviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]!.message }, { status: 400 });
    }

    const { action, ids } = parsed.data;

    if (action === "delete") {
      const reviews = await prisma.review.findMany({
        where: { id: { in: ids } },
        select: { id: true, productId: true },
      });

      await prisma.$transaction(async (tx) => {
        await tx.review.deleteMany({ where: { id: { in: ids } } });

        const productIds = [...new Set(reviews.map((r) => r.productId))];
        for (const productId of productIds) {
          const stats = await tx.review.aggregate({
            where: { productId, isApproved: true },
            _avg: { rating: true },
            _count: { rating: true },
          });
          await tx.product.update({
            where: { id: productId },
            data: { rating: stats._avg.rating || 0, reviewCount: stats._count.rating },
          });
        }
      });

      logActivity({ action: "review.bulk_delete", entity: "review", adminId: admin.id, adminEmail: admin.email, details: { count: ids.length } });
      return NextResponse.json({ success: true, affected: ids.length });
    }

    const isApproved = action === "approve";

    const reviews = await prisma.review.findMany({
      where: { id: { in: ids } },
      select: { id: true, productId: true },
    });

    await prisma.$transaction(async (tx) => {
      await tx.review.updateMany({
        where: { id: { in: ids } },
        data: { isApproved },
      });

      const productIds = [...new Set(reviews.map((r) => r.productId))];
      for (const productId of productIds) {
        const stats = await tx.review.aggregate({
          where: { productId, isApproved: true },
          _avg: { rating: true },
          _count: { rating: true },
        });
        await tx.product.update({
          where: { id: productId },
          data: { rating: stats._avg.rating || 0, reviewCount: stats._count.rating },
        });
      }
    });

    logActivity({ action: `review.bulk_${action}`, entity: "review", adminId: admin.id, adminEmail: admin.email, details: { count: ids.length } });
    return NextResponse.json({ success: true, affected: ids.length });
  } catch (error) {
    return handleApiError(error);
  }
}
