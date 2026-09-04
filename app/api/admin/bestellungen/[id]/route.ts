import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendPaymentConfirmed, sendShippedConfirmation, sendOrderCancelled, sendPaymentReceipt } from "@/lib/emails";
import { handleApiError, validateContentType, validateCsrfOrigin } from "@/lib/api-helpers";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import { ALLOWED_ORDER_STATUSES } from "@/lib/admin-constants";
import { z } from "zod";
import { randomBytes } from "crypto";

async function generateInvoiceNumber(): Promise<string> {
  const now = new Date();
  const year = now.getFullYear();
  const prefix = "RE";

  let settings = await prisma.siteSettings.findFirst();
  if (!settings) {
    settings = await prisma.siteSettings.create({
      data: { bankIban: "", bankBic: "", bankAccountName: "", bankName: "", shippingInfo: "", contactEmail: "", contactPhone: "", contactAddress: "" },
    });
  }

  let counter = (settings.invoiceCounter || 0) + 1;
  if (settings.invoiceYear !== year) {
    counter = 1;
  }

  await prisma.siteSettings.update({
    where: { id: settings.id },
    data: { invoiceCounter: counter, invoiceYear: year },
  });

  return `${prefix}-${year}-${String(counter).padStart(5, "0")}`;
}

const UpdateOrderSchema = z.object({
  status: z.enum(ALLOWED_ORDER_STATUSES),
  trackingNumber: z.string().max(50).optional().nullable(),
});

const PatchOrderSchema = z.object({
  adminNotes: z.string().max(2000).optional(),
  trackingNumber: z.string().max(50).optional().nullable(),
  bankReference: z.string().max(100).optional().nullable(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!validateCsrfOrigin(request)) {
      return NextResponse.json(
        { error: "CSRF-Schutz: Ungültige Herkunft" },
        { status: 403 }
      );
    }

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
      status === "CANCELLED" ? "FAILED"
      : status !== "PENDING_PAYMENT" ? "CONFIRMED"
      : undefined;

    const order = await prisma.order.update({
      where: { id },
      data: {
        status,
        paymentStatus: paymentStatusUpdate,
        trackingNumber: trackingNumber || null,
      },
      select: {
        id: true,
        orderNumber: true,
        invoiceNumber: true,
        status: true,
        paymentStatus: true,
        customerEmail: true,
        customerFirstName: true,
        customerLastName: true,
        customerAddress: true,
        customerCity: true,
        customerZip: true,
        customerCountry: true,
        subtotal: true,
        total: true,
        shippingCost: true,
        couponDiscount: true,
        trackingNumber: true,
        paidAt: true,
        updatedAt: true,
        items: {
          select: {
            quantity: true,
            price: true,
            product: { select: { name: true } },
          },
        },
      },
    });

    try {
      const customerName = `${order.customerFirstName} ${order.customerLastName}`;
      const orderTotal = Number(order.total);
      const orderShipping = Number(order.shippingCost);
      const orderCouponDiscount = Number(order.couponDiscount);
      const emailData = {
        orderNumber: order.orderNumber,
        customerEmail: order.customerEmail,
        customerName,
        items: order.items.map((item) => ({
          name: item.product?.name || "Produkt",
          quantity: item.quantity,
          price: Number(item.price),
        })),
        subtotal: order.subtotal ? Number(order.subtotal) : (orderTotal - orderShipping + orderCouponDiscount),
        couponDiscount: orderCouponDiscount,
        total: orderTotal,
        shippingCost: orderShipping,
      };

      if (status === "PAYMENT_CONFIRMED") {
        // Generate sequential invoice number with retry on collision
        let invoiceNumber: string | null = null;
        const paidAt = new Date();
        const MAX_INVOICE_RETRIES = 5;
        for (let i = 0; i < MAX_INVOICE_RETRIES; i++) {
          try {
            invoiceNumber = await generateInvoiceNumber();
            await prisma.order.update({
              where: { id },
              data: { invoiceNumber, paidAt },
            });
            break;
          } catch (err: unknown) {
            if (err instanceof Error && 'code' in err && err.code === "P2002" && i < MAX_INVOICE_RETRIES - 1) {
              continue;
            }
            throw err;
          }
        }
        if (!invoiceNumber) {
          return NextResponse.json({ error: "Rechnungsnummer konnte nicht erstellt werden" }, { status: 500 });
        }

        // Fetch settings for invoice data
        const settings = await prisma.siteSettings.findFirst();

        // Send receipt first (legally important document)
        await sendPaymentReceipt({
          ...emailData,
          invoiceNumber,
          customerAddress: order.customerAddress,
          customerCity: order.customerCity,
          customerZip: order.customerZip,
          customerCountry: order.customerCountry,
          paidAt: paidAt.toISOString(),
          companyName: settings?.companyName || "HAUSAURA GmbH",
          companyAddress: settings?.companyAddress || "Kastanienallee 42, 10435 Berlin",
          vatId: settings?.vatId || "",
          defaultVatRate: settings?.defaultVatRate ?? 19,
        });
        await sendPaymentConfirmed(emailData);
      } else if (status === "SHIPPED") {
        const shippedTracking = trackingNumber || order.trackingNumber || "";
        await sendShippedConfirmation(emailData, shippedTracking);
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!validateCsrfOrigin(request)) {
      return NextResponse.json(
        { error: "CSRF-Schutz: Ungültige Herkunft" },
        { status: 403 }
      );
    }

    const ctError = validateContentType(request, "application/json");
    if (ctError) return ctError;

    await requireAdmin();
    const ip = getClientIp(request);
    if (!await checkRateLimit(`admin-bestellung-patch:${ip}`, 30, 60_000)) {
      return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429, headers: { "Retry-After": "60" } });
    }
    const { id } = await params;
    const body = await request.json();
    const parsed = PatchOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]!.message },
        { status: 400 }
      );
    }

    const { adminNotes, trackingNumber, bankReference } = parsed.data;

    const order = await prisma.order.update({
      where: { id },
      data: {
        ...(adminNotes !== undefined && { adminNotes }),
        ...(trackingNumber !== undefined && { trackingNumber: trackingNumber || null }),
        ...(bankReference !== undefined && { bankReference: bankReference || null }),
      },
    });

    return NextResponse.json({ order });
  } catch (error) {
    return handleApiError(error);
  }
}
