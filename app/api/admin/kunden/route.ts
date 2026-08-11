import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10) || 20));
    const search = searchParams.get("search") || "";

    const orders = await prisma.order.findMany({
      where: search
        ? {
            OR: [
              { customerEmail: { contains: search, mode: "insensitive" } },
              { customerFirstName: { contains: search, mode: "insensitive" } },
              { customerLastName: { contains: search, mode: "insensitive" } },
            ],
          }
        : {},
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

    const customerMap = new Map<
      string,
      {
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
      }
    >();

    for (const order of orders) {
      const key = order.customerEmail.toLowerCase();
      const existing = customerMap.get(key);

      if (existing) {
        existing.orderCount += 1;
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

    const customers = Array.from(customerMap.values()).sort(
      (a, b) => b.lastOrderAt.getTime() - a.lastOrderAt.getTime()
    );

    const total = customers.length;
    const paginated = customers.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      customers: paginated,
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
