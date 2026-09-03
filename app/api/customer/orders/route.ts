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

    const orders = await prisma.order.findMany({
      where: {
        OR: [
          { customerId },
          { customerEmail: { equals: email, mode: "insensitive" } },
        ],
      },
      include: {
        items: {
          include: {
            product: {
              select: { name: true, slug: true, images: { take: 1, select: { url: true } } },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json({
      orders: orders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
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
    });
  } catch (error) {
    return handleApiError(error);
  }
}
