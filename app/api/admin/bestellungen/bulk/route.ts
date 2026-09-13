import { NextResponse, NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendPaymentConfirmed, sendShippedConfirmation, sendOrderCancelled } from "@/lib/emails";
import { handleApiError, validateContentType } from "@/lib/api-helpers";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import { z } from "zod";
import { ALLOWED_ORDER_STATUSES } from "@/lib/admin-constants";

const BulkOrderSchema = z.object({
    ids: z.array(z.string().regex(/^c[a-z0-9]{20,}$/i)).min(1).max(50),
  status: z.enum(ALLOWED_ORDER_STATUSES),
});

export async function POST(request: NextRequest) {
  try {
    const ctError = validateContentType(request, "application/json");
    if (ctError) return ctError;

    await requireAdmin();
    const ip = getClientIp(request);
    if (!await checkRateLimit(`admin-bestellung-bulk:${ip}`, 10, 60_000)) {
      return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429, headers: { "Retry-After": "60" } });
    }
    const body = await request.json();
    const parsed = BulkOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]!.message },
        { status: 400 }
      );
    }

    const { ids, status } = parsed.data;

    const { VALID_ORDER_TRANSITIONS } = await import("@/lib/admin-constants");
    const orders = await prisma.order.findMany({
      where: { id: { in: ids } },
      select: { id: true, status: true },
    });

    const validOrders = orders.filter((o) => {
      const allowed = VALID_ORDER_TRANSITIONS[o.status] ?? [];
      return allowed.includes(status);
    });

    if (validOrders.length === 0) {
      return NextResponse.json(
        { error: `Keine Bestellungen mit gültigem Statusübergang für → ${status}` },
        { status: 400 }
      );
    }

    const validIds = validOrders.map((o) => o.id);
    const paymentStatusUpdate =
      status === "CANCELLED" ? "FAILED"
      : status !== "PENDING_PAYMENT" ? "CONFIRMED"
      : undefined;

    const result = await prisma.order.updateMany({
      where: { id: { in: validIds } },
      data: {
        status,
        ...(paymentStatusUpdate ? { paymentStatus: paymentStatusUpdate } : {}),
      },
    });

    // Send email notifications for status changes (best-effort)
    if (["PAYMENT_CONFIRMED", "SHIPPED", "CANCELLED"].includes(status)) {
      const updatedOrders = await prisma.order.findMany({
        where: { id: { in: validIds } },
        select: {
          orderNumber: true, customerEmail: true, customerFirstName: true, customerLastName: true,
          total: true, shippingCost: true, couponDiscount: true, trackingNumber: true,
          items: { select: { quantity: true, price: true, product: { select: { name: true } } } },
        },
      });
      for (const o of updatedOrders) {
        try {
          const emailData = {
            orderNumber: o.orderNumber, customerEmail: o.customerEmail,
            customerName: `${o.customerFirstName} ${o.customerLastName}`,
            items: o.items.map(i => ({ name: i.product?.name || "Produkt", quantity: i.quantity, price: Number(i.price) })),
            subtotal: Number(o.total) - Number(o.shippingCost) + Number(o.couponDiscount),
            couponDiscount: Number(o.couponDiscount), total: Number(o.total), shippingCost: Number(o.shippingCost),
          };
          if (status === "PAYMENT_CONFIRMED") await sendPaymentConfirmed(emailData);
          else if (status === "SHIPPED") await sendShippedConfirmation(emailData, o.trackingNumber || "");
          else if (status === "CANCELLED") await sendOrderCancelled(emailData);
        } catch (emailErr) {
          logger.error("bulk-order-email", emailErr instanceof Error ? emailErr : new Error(String(emailErr)), { orderNumber: o.orderNumber });
        }
      }
    }

    const skipped = ids.length - result.count;
    return NextResponse.json({
      count: result.count,
      skipped,
      message: skipped > 0 ? `${skipped} Bestellung(en) übersprungen (ungültiger Übergang)` : undefined,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
