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
      allOrderItems,
      recentOrders,
      categoryStats,
    ] = await Promise.all([
      prisma.order.aggregate({ _sum: { total: true }, where: orderFilter }),
      prisma.order.count({ where: orderFilter }),
      prisma.product.count(),
      prisma.order.count({ where: { status: "PENDING_PAYMENT", ...orderFilter } }),
      prisma.orderItem.findMany({
        select: { productId: true, price: true, quantity: true },
        where: { order: orderFilter },
      }),
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
    ]);

    const revenueByProduct = new Map<string, number>();
    const revenueByCategory = new Map<string, number>();
    const orderCountByProduct = new Map<string, number>();
    for (const item of allOrderItems) {
      const lineTotal = Number(item.price) * item.quantity;
      revenueByProduct.set(item.productId, (revenueByProduct.get(item.productId) || 0) + lineTotal);
      orderCountByProduct.set(item.productId, (orderCountByProduct.get(item.productId) || 0) + 1);
    }

    const topProducts = Array.from(revenueByProduct.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const topProductIds = topProducts.map(([id]) => id);
    const topProductNames = await prisma.product.findMany({
      where: { id: { in: topProductIds } },
      select: { id: true, name: true },
    });
    const topProductNameMap = new Map(topProductNames.map((p) => [p.id, p.name]));

    const topProductsWithNames = topProducts.map(([productId, revenue]) => ({
      name: topProductNameMap.get(productId) || "Unbekannt",
      orderCount: orderCountByProduct.get(productId) || 0,
      revenue,
    }));

    const productCategoryMap = new Map<string, string>();
    if (allOrderItems.length > 0) {
      const productIds = [...new Set(allOrderItems.map((i) => i.productId))];
      const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, categoryId: true },
      });
      for (const p of products) {
        productCategoryMap.set(p.id, p.categoryId);
      }
    }

    const categoryRevenueMap = new Map<string, number>();
    for (const item of allOrderItems) {
      const catId = productCategoryMap.get(item.productId);
      if (catId) {
        categoryRevenueMap.set(
          catId,
          (categoryRevenueMap.get(catId) || 0) + Number(item.price) * item.quantity
        );
      }
    }

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
