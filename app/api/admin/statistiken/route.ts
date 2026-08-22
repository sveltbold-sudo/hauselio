import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api-helpers";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

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
    const range = searchParams.get("range") || "all";
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
      activeProducts,
      topProducts,
      recentOrders,
      categoryStats,
      categoryRevenues,
    ] = await Promise.all([
      prisma.order.aggregate({ _sum: { total: true }, where: orderFilter }),
      prisma.order.count({ where: orderFilter }),
      prisma.product.count(),
      prisma.order.count({ where: { status: "PENDING_PAYMENT", ...orderFilter } }),
      prisma.product.count({ where: { inStock: true } }),
      prisma.orderItem.groupBy({
        by: ["productId"],
        _sum: { price: true },
        _count: true,
        orderBy: { _sum: { price: "desc" } },
        take: 5,
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
      prisma.orderItem.groupBy({
        by: ["productId"],
        _sum: { price: true },
        where: { order: orderFilter },
      }),
    ]);

    const topProductIds = topProducts.map((tp) => tp.productId);
    const topProductNames = await prisma.product.findMany({
      where: { id: { in: topProductIds } },
      select: { id: true, name: true },
    });
    const topProductNameMap = new Map(topProductNames.map((p) => [p.id, p.name]));

    const topProductsWithNames = topProducts.map((tp) => ({
      name: topProductNameMap.get(tp.productId) || "Unbekannt",
      orderCount: tp._count,
      revenue: tp._sum.price || 0,
    }));

    const productCategoryMap = new Map<string, string>();
    const allProductIds = categoryRevenues.map((cr) => cr.productId);
    if (allProductIds.length > 0) {
      const products = await prisma.product.findMany({
        where: { id: { in: allProductIds } },
        select: { id: true, categoryId: true },
      });
      for (const p of products) {
        productCategoryMap.set(p.id, p.categoryId);
      }
    }

    const categoryRevenueMap = new Map<string, number>();
    for (const cr of categoryRevenues) {
      const catId = productCategoryMap.get(cr.productId);
      if (catId) {
        const current = categoryRevenueMap.get(catId) || 0;
        categoryRevenueMap.set(catId, current + Number(cr._sum.price || 0));
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
      activeProducts,
      avgOrderValue,
      topProducts: topProductsWithNames,
      recentOrders,
      categoryStats: categoryStatsWithRevenue,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
