import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { requireCustomer } from "@/lib/auth";
import { UnauthorizedError } from "@/lib/errors";
import { handleApiError } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    if (!await checkRateLimit(`orders:${ip}`, 10, 60_000)) {
      return NextResponse.json(
        { error: "Zu viele Anfragen" },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    let email: string;
    let customerId: string;
    try {
      const customer = await requireCustomer();
      email = customer.email;
      customerId = customer.id;
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
      }
      throw error;
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const skip = (page - 1) * limit;

    const where = {
      OR: [
        { customerId },
        { customerEmail: { equals: email, mode: "insensitive" as const } },
      ],
    };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        select: {
          id: true,
          orderNumber: true,
          invoiceNumber: true,
          status: true,
          total: true,
          shippingCost: true,
          createdAt: true,
          items: {
            select: {
              quantity: true,
              price: true,
              product: {
                select: { name: true, slug: true, images: { take: 1, select: { url: true } } },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      orders: orders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        invoiceNumber: order.invoiceNumber,
        status: order.status,
        total: Number(order.total),
        shippingCost: Number(order.shippingCost),
        createdAt: order.createdAt.toISOString(),
        items: order.items.map((item) => ({
          name: item.product.name,
          slug: item.product.slug,
          image: item.product.images[0]?.url || null,
          quantity: item.quantity,
          price: Number(item.price),
        })),
      })),
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
