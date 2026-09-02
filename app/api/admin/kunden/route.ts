import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api-helpers";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { z } from "zod";

const KundenQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().max(200).default(""),
  sort: z.enum(["name", "orders", "spent", "lastOrder"]).default("lastOrder"),
  dir: z.enum(["asc", "desc"]).default("desc"),
});

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const ip = getClientIp(request);
    if (!await checkRateLimit(`admin-kunden:${ip}`, 30, 60_000)) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    const { searchParams } = new URL(request.url);
    const parsed = KundenQuerySchema.safeParse(Object.fromEntries(searchParams));
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]!.message },
        { status: 400 }
      );
    }
    const { page, limit, search, sort, dir } = parsed.data;

    const where = search
      ? {
          OR: [
            { customerEmail: { contains: search, mode: "insensitive" as const } },
            { customerFirstName: { contains: search, mode: "insensitive" as const } },
            { customerLastName: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const aggregatedCustomers = await prisma.order.groupBy({
      by: ["customerEmail"],
      where,
      _count: true,
      _sum: { total: true },
      _max: { createdAt: true },
      orderBy: { _max: { createdAt: "desc" } },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalCount = await prisma.order.groupBy({
      by: ["customerEmail"],
      where,
      _count: true,
    });

    const [statsResult, distinctResult] = await Promise.all([
      prisma.$queryRaw<[{ total: string }]>`SELECT COALESCE(SUM("total"), 0) as "total" FROM "Order"`,
      prisma.$queryRaw<[{ count: bigint }]>`SELECT COUNT(DISTINCT "customerEmail") as "count" FROM "Order"`,
    ]);
    const totalRevenue = Number(statsResult[0]?.total || 0);
    const totalCustomers = Number(distinctResult[0]?.count || 0);

    const customerEmails = aggregatedCustomers.map((c) => c.customerEmail);
    const latestOrders = await prisma.order.findMany({
      where: { customerEmail: { in: customerEmails } },
      select: {
        customerEmail: true,
        customerFirstName: true,
        customerLastName: true,
        customerPhone: true,
        customerAddress: true,
        customerCity: true,
        customerZip: true,
        customerCountry: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const latestOrderMap = new Map<string, typeof latestOrders[0]>();
    for (const order of latestOrders) {
      if (!latestOrderMap.has(order.customerEmail)) {
        latestOrderMap.set(order.customerEmail, order);
      }
    }

    const customers = aggregatedCustomers.map((agg) => {
      const latest = latestOrderMap.get(agg.customerEmail);
      return {
        email: agg.customerEmail,
        firstName: latest?.customerFirstName ?? "",
        lastName: latest?.customerLastName ?? "",
        phone: latest?.customerPhone ?? null,
        address: latest?.customerAddress ?? "",
        city: latest?.customerCity ?? "",
        zip: latest?.customerZip ?? "",
        country: latest?.customerCountry ?? "",
        orderCount: agg._count,
        totalSpent: Number(agg._sum.total || 0),
        lastOrderAt: agg._max.createdAt ?? new Date(),
      };
    });

    customers.sort((a, b) => {
      const d = dir === "asc" ? 1 : -1;
      switch (sort) {
        case "name":
          return d * `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        case "orders":
          return d * (a.orderCount - b.orderCount);
        case "spent":
          return d * (a.totalSpent - b.totalSpent);
        case "lastOrder":
        default:
          return d * (new Date(a.lastOrderAt).getTime() - new Date(b.lastOrderAt).getTime());
      }
    });

    return NextResponse.json({
      customers,
      pagination: {
        page,
        limit,
        total: totalCount.length,
        pages: Math.ceil(totalCount.length / limit),
      },
      stats: {
        totalRevenue,
        totalCustomers,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
