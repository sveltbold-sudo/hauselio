import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api-helpers";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { generateInvoicePdf } from "@/lib/invoice-pdf";
import { logger } from "@/lib/logger";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = getClientIp(request);
    if (!await checkRateLimit(`customer-invoice:${ip}`, 10, 60_000)) {
      return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429, headers: { "Retry-After": "60" } });
    }

    const { id } = await params;
    const email = request.nextUrl.searchParams.get("email");
    const orderNumber = request.nextUrl.searchParams.get("orderNumber");

    if (!email || !orderNumber) {
      return NextResponse.json({ error: "E-Mail und Bestellnummer erforderlich" }, { status: 400 });
    }

    const order = await prisma.order.findFirst({
      where: {
        id,
        customerEmail: email,
        orderNumber,
      },
      select: {
        invoiceNumber: true,
        orderNumber: true,
        paidAt: true,
        updatedAt: true,
        customerFirstName: true,
        customerLastName: true,
        customerAddress: true,
        customerZip: true,
        customerCity: true,
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
        { error: "Keine Rechnung vorhanden" },
        { status: 400 }
      );
    }

    const settings = await prisma.siteSettings.findFirst();
    const customerName = `${order.customerFirstName} ${order.customerLastName}`;
    const orderTotal = Number(order.total);
    const orderShipping = Number(order.shippingCost);
    const orderCouponDiscount = Number(order.couponDiscount);

    const pdfBuffer = generateInvoicePdf({
      invoiceNumber: order.invoiceNumber,
      orderNumber: order.orderNumber,
      paidAt: (order.paidAt || order.updatedAt).toISOString(),
      companyName: settings?.companyName || "HAUSAURA GmbH",
      companyAddress: settings?.companyAddress || "Kastanienallee 42, 10435 Berlin",
      vatId: settings?.vatId || "",
      defaultVatRate: settings?.defaultVatRate ?? 19,
      customerName,
      customerAddress: order.customerAddress,
      customerZip: order.customerZip,
      customerCity: order.customerCity,
      customerCountry: order.customerCountry,
      items: order.items.map((item) => ({
        name: item.product?.name || "Produkt",
        quantity: item.quantity,
        price: Number(item.price),
      })),
      subtotal: order.subtotal ? Number(order.subtotal) : (orderTotal - orderShipping + orderCouponDiscount),
      couponDiscount: orderCouponDiscount,
      shippingCost: orderShipping,
      total: orderTotal,
    });

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Rechnung_${order.invoiceNumber}.pdf"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    logger.error("customer-invoice-pdf", error);
    return handleApiError(error);
  }
}
