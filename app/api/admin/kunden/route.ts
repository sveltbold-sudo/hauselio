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
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }
    const { page, limit, search } = parsed.data;

    const where = search
      ? {
          OR: [
            { customerEmail: { contains: search, mode: "insensitive" as const } },
            { customerFirstName: { contains: search, mode: "insensitive" as const } },
            { customerLastName: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const orders = await prisma.order.findMany({
      where,
      select: {
        customerEmail: true,
        customerFirstName: true,
        customerLastName: true,
        customerPhone: true,
        customerAddress: true,
        customerCity: true,
        customerZip: true,
        customerCountry: true,
        total: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const customerMap = new Map<string, {
      email: string;
      firstName: string;
      lastName: string;
      phone: string | null;
      address: string;
      city: string;
      zip: string;
      country: string;
      orderCount: number;
      totalSpent: number;
      lastOrderAt: Date;
    }>();

    for (const order of orders) {
      const key = order.customerEmail.toLowerCase();
      const existing = customerMap.get(key);
      if (existing) {
        existing.orderCount++;
        existing.totalSpent += Number(order.total);
        if (order.createdAt > existing.lastOrderAt) {
          existing.lastOrderAt = order.createdAt;
        }
      } else {
        customerMap.set(key, {
          email: order.customerEmail,
          firstName: order.customerFirstName,
          lastName: order.customerLastName,
          phone: order.customerPhone,
          address: order.customerAddress,
          city: order.customerCity,
          zip: order.customerZip,
          country: order.customerCountry,
          orderCount: 1,
          totalSpent: Number(order.total),
          lastOrderAt: order.createdAt,
        });
      }
    }

    const allCustomers = Array.from(customerMap.values())
      .sort((a, b) => b.lastOrderAt.getTime() - a.lastOrderAt.getTime());

    const total = allCustomers.length;
    const customers = allCustomers.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      customers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
