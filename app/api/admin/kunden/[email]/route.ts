import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api-helpers";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ email: string }> }
) {
  try {
    const ip = getClientIp(request);
    if (!await checkRateLimit(`admin-kunden-email:${ip}`, 30, 60_000)) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    await requireAdmin();
    const { email } = await params;
    const decodedEmail = decodeURIComponent(email);

    const orders = await prisma.order.findMany({
      where: { customerEmail: decodedEmail },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        orderNumber: true,
        total: true,
        status: true,
        paymentStatus: true,
        createdAt: true,
        customerFirstName: true,
        customerLastName: true,
        customerPhone: true,
        customerAddress: true,
        customerCity: true,
        customerZip: true,
        customerCountry: true,
        items: {
          select: {
            quantity: true,
            price: true,
            product: {
              select: { name: true },
            },
          },
        },
      },
    });

    if (orders.length === 0) {
      return NextResponse.json(
        { error: "Kunde nicht gefunden." },
        { status: 404 }
      );
    }

    const latest = orders[0]!;
    const totalSpent = orders.reduce((sum, o) => sum + Number(o.total), 0);

    return NextResponse.json({
      customer: {
        email: decodedEmail,
        firstName: latest.customerFirstName,
        lastName: latest.customerLastName,
        phone: latest.customerPhone,
        address: latest.customerAddress,
        city: latest.customerCity,
        zip: latest.customerZip,
        country: latest.customerCountry,
        orderCount: orders.length,
        totalSpent,
      },
      orders: orders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        total: Number(o.total),
        status: o.status,
        paymentStatus: o.paymentStatus,
        createdAt: o.createdAt,
        items: o.items.map((item) => ({
          productName: item.product.name,
          quantity: item.quantity,
          price: Number(item.price),
        })),
      })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
