import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { handleApiError } from "@/lib/api-helpers";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = getClientIp(request);
    if (!await checkRateLimit(`bestellung-detail:${ip}`, 30, 60_000)) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    await requireAdmin();
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: { product: { select: { name: true } } },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Bestellung nicht gefunden" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        total: Number(order.subtotal) + Number(order.shippingCost),
        shippingCost: Number(order.shippingCost),
        status: order.status,
        items: order.items.map((item) => ({
          product: { name: item.product.name },
          quantity: item.quantity,
          price: Number(item.price),
        })),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
