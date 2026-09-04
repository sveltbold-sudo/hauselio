import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendPaymentReceipt } from "@/lib/emails";
import { handleApiError, validateContentType, validateCsrfOrigin } from "@/lib/api-helpers";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!validateCsrfOrigin(request)) {
      return NextResponse.json(
        { error: "CSRF-Schutz: Ung\u00fcltige Herkunft" },
        { status: 403 }
      );
    }

    const ctError = validateContentType(request, "application/json");
    if (ctError) return ctError;

    await requireAdmin();
    const ip = getClientIp(request);
    if (!await checkRateLimit(`resend-receipt:${ip}`, 5, 60_000)) {
      return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429, headers: { "Retry-After": "60" } });
    }

    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      select: {
        invoiceNumber: true,
        orderNumber: true,
        paidAt: true,
        updatedAt: true,
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
        items: {
          select: {
            quantity: true,
            price: true,
            product: { select: { name: true } },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Bestellung nicht gefunden" }, { status: 404 });
    }

    if (!order.invoiceNumber) {
      return NextResponse.json(
        { error: "Keine Rechnungsnummer vorhanden. Bestellung muss zuerst als bezahlt best\u00e4tigt werden." },
        { status: 400 }
      );
    }

    const settings = await prisma.siteSettings.findFirst();

    const customerName = `${order.customerFirstName} ${order.customerLastName}`;
    const orderTotal = Number(order.total);
    const orderShipping = Number(order.shippingCost);
    const orderCouponDiscount = Number(order.couponDiscount);

    await sendPaymentReceipt({
      orderNumber: order.orderNumber,
      invoiceNumber: order.invoiceNumber,
      customerEmail: order.customerEmail,
      customerName,
      customerAddress: order.customerAddress,
      customerCity: order.customerCity,
      customerZip: order.customerZip,
      customerCountry: order.customerCountry,
      items: order.items.map((item) => ({
        name: item.product?.name || "Produkt",
        quantity: item.quantity,
        price: Number(item.price),
      })),
      subtotal: order.subtotal ? Number(order.subtotal) : (orderTotal - orderShipping + orderCouponDiscount),
      couponDiscount: orderCouponDiscount,
      total: orderTotal,
      shippingCost: orderShipping,
      paidAt: (order.paidAt || order.updatedAt).toISOString(),
      companyName: settings?.companyName || "HAUSAURA GmbH",
      companyAddress: settings?.companyAddress || "Kastanienallee 42, 10435 Berlin",
      vatId: settings?.vatId || "",
      defaultVatRate: settings?.defaultVatRate ?? 19,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("resend-receipt", error);
    return handleApiError(error);
  }
}
