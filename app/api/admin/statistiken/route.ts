import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api-helpers";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { z } from "zod";

const RangeSchema = z.enum(["all", "7d", "30d", "90d"]);

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    if (!await checkRateLimit(`admin-statistiken:${ip}`, 30, 60_000)) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const rangeResult = RangeSchema.safeParse(searchParams.get("range") || "all");
    const range = rangeResult.success ? rangeResult.data : "all";
    const now = new Date();
    let dateFrom: Date | undefined;
    if (range === "7d") {
      dateFrom = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (range === "30d") {
      dateFrom = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (range === "90d") {
      dateFrom = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    }

    const orderFilter = dateFrom ? { createdAt: { gte: dateFrom } } : {};

    const [
      totalRevenue,
      totalOrders,
      totalProducts,
      pendingOrders,
      recentOrders,
      categoryStats,
      totalCustomers,
      revenueByProduct,
    ] = await Promise.all([
      prisma.order.aggregate({ _sum: { total: true }, where: { ...orderFilter, status: { not: "CANCELLED" } } }),
      prisma.order.count({ where: orderFilter }),
      prisma.product.count(),
      prisma.order.count({ where: { status: "PENDING_PAYMENT", ...orderFilter } }),
      prisma.order.findMany({
        select: {
          orderNumber: true,
          total: true,
          status: true,
          createdAt: true,
        },
        where: orderFilter,
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.category.findMany({
        select: {
          id: true,
          name: true,
          _count: { select: { products: true } },
        },
      }),
      dateFrom
        ? prisma.$queryRawUnsafe<[{ count: bigint }]>('SELECT COUNT(DISTINCT "customerEmail") as count FROM "Order" WHERE "createdAt" >= $1', dateFrom)
        : prisma.$queryRaw<[{ count: bigint }]>`SELECT COUNT(DISTINCT "customerEmail") as count FROM "Order"`,
      prisma.$queryRawUnsafe<{ name: string; orderCount: number; revenue: number }[]>(
        `SELECT p.name, COUNT(DISTINCT oi."orderId")::int AS "orderCount", SUM(oi.price * oi.quantity)::float AS revenue
         FROM "OrderItem" oi JOIN "Product" p ON oi."productId" = p.id
         JOIN "Order" o ON oi."orderId" = o.id AND o.status != 'CANCELLED'
         WHERE o."createdAt" >= $1
         GROUP BY p.name ORDER BY revenue DESC LIMIT 5`,
        dateFrom ?? new Date(0)
      ),
    ]);

    const topProductsWithNames = revenueByProduct.map((row) => ({
      name: row.name,
      orderCount: row.orderCount,
      revenue: row.revenue,
    }));

    const categoryRevenueRaw = await prisma.$queryRawUnsafe<{ categoryId: string; revenue: number }[]>(
      `SELECT p."categoryId", SUM(oi.price * oi.quantity)::float AS revenue
       FROM "OrderItem" oi JOIN "Product" p ON oi."productId" = p.id
       JOIN "Order" o ON oi."orderId" = o.id AND o.status != 'CANCELLED'
       WHERE o."createdAt" >= $1
       GROUP BY p."categoryId"`,
      dateFrom ?? new Date(0)
    );
    const categoryRevenueMap = new Map(categoryRevenueRaw.map((r) => [r.categoryId, r.revenue]));

    const categoryStatsWithRevenue = categoryStats.map((cat) => ({
      name: cat.name,
      productCount: cat._count.products,
      totalRevenue: categoryRevenueMap.get(cat.id) || 0,
    }));

    const totalRevenueNum = Number(totalRevenue._sum.total || 0);
    const avgOrderValue =
      totalOrders > 0 ? totalRevenueNum / totalOrders : 0;

    return NextResponse.json({
      totalRevenue: totalRevenueNum,
      totalOrders,
      totalProducts,
      totalCustomers: Number(totalCustomers[0]?.count || 0),
      pendingOrders,
      activeProducts: totalProducts,
      avgOrderValue,
      topProducts: topProductsWithNames,
      recentOrders,
      categoryStats: categoryStatsWithRevenue,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
