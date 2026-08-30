import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendPaymentConfirmed, sendShippedConfirmation, sendOrderCancelled } from "@/lib/emails";
import { handleApiError, validateContentType } from "@/lib/api-helpers";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import { ALLOWED_ORDER_STATUSES } from "@/lib/admin-constants";
import { z } from "zod";

const UpdateOrderSchema = z.object({
  status: z.enum(ALLOWED_ORDER_STATUSES),
  trackingNumber: z.string().max(50).optional().nullable(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ctError = validateContentType(request, "application/json");
    if (ctError) return ctError;

    await requireAdmin();
    const ip = getClientIp(request);
    if (!await checkRateLimit(`admin-bestellung:${ip}`, 30, 60_000)) {
      return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429, headers: { "Retry-After": "60" } });
    }
    const { id } = await params;
    const body = await request.json();
    const parsed = UpdateOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]!.message },
        { status: 400 }
      );
    }

    const { status, trackingNumber } = parsed.data;

    const currentOrder = await prisma.order.findUnique({ where: { id }, select: { status: true } });
    if (!currentOrder) {
      return NextResponse.json({ error: "Bestellung nicht gefunden" }, { status: 404 });
    }

    const { VALID_ORDER_TRANSITIONS } = await import("@/lib/admin-constants");
    const allowed = VALID_ORDER_TRANSITIONS[currentOrder.status] ?? [];
    if (!allowed.includes(status)) {
      return NextResponse.json(
        { error: `Ungültiger Statusübergang: ${currentOrder.status} → ${status}` },
        { status: 400 }
      );
    }

    const paymentStatusUpdate =
      status === "PAYMENT_CONFIRMED" ? "CONFIRMED"
      : status === "CANCELLED" ? "FAILED"
      : status === "SHIPPED" || status === "DELIVERED" ? "CONFIRMED"
      : status === "PROCESSING" ? "CONFIRMED"
      : undefined;

    const order = await prisma.order.update({
      where: { id },
      data: {
        status,
        paymentStatus: paymentStatusUpdate,
        trackingNumber: trackingNumber || undefined,
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    try {
      const customerName = `${order.customerFirstName} ${order.customerLastName}`;
      const emailData = {
        orderNumber: order.orderNumber,
        customerEmail: order.customerEmail,
        customerName,
        items: order.items.map((item) => ({
          name: item.product.name,
          quantity: item.quantity,
          price: Number(item.price),
        })),
        total: Number(order.total),
        shippingCost: Number(order.shippingCost),
      };

      if (status === "PAYMENT_CONFIRMED") {
        await sendPaymentConfirmed(emailData);
      } else if (status === "SHIPPED" && trackingNumber) {
        await sendShippedConfirmation(emailData, trackingNumber);
      } else if (status === "CANCELLED") {
        await sendOrderCancelled(emailData);
      }
    } catch (emailError) {
      logger.error("order-status-email", emailError);
    }

    return NextResponse.json({ order });
  } catch (error) {
    return handleApiError(error);
  }
}
