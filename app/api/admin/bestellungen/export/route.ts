import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api-helpers";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { ORDER_STATUS_LABELS, ALLOWED_ORDER_STATUSES } from "@/lib/admin-constants";
import { logger } from "@/lib/logger";

function escapeCsv(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    if (!await checkRateLimit(`admin-orders-export:${ip}`, 5, 60_000)) {
      return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429, headers: { "Retry-After": "60" } });
    }

    await requireAdmin();

    const params = request.nextUrl.searchParams;
    const status = params.get("status") || undefined;
    const q = params.get("q") || undefined;

    const where: Prisma.OrderWhereInput = {};
    if (status && ALLOWED_ORDER_STATUSES.includes(status as typeof ALLOWED_ORDER_STATUSES[number])) {
      where.status = status as typeof ALLOWED_ORDER_STATUSES[number];
    }
    if (q) {
      where.OR = [
        { orderNumber: { contains: q, mode: "insensitive" } },
        { customerEmail: { contains: q, mode: "insensitive" } },
        { customerFirstName: { contains: q, mode: "insensitive" } },
        { customerLastName: { contains: q, mode: "insensitive" } },
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 5000,
    });

    const header = [
      "Bestellnummer",
      "Rechnungsnr.",
      "Datum",
      "Status",
      "Zahlungsstatus",
      "Kunde",
      "E-Mail",
      "Adresse",
      "PLZ",
      "Ort",
      "Land",
      "Zwischensumme",
      "Rabatt",
      "Versand",
      "Gesamt",
      "Zahlungsmethode",
      "Bankreferenz",
      "Tracking",
    ];

    const rows = orders.map((o) => [
      o.orderNumber,
      o.invoiceNumber || "",
      new Date(o.createdAt).toLocaleDateString("de-DE"),
      ORDER_STATUS_LABELS[o.status] || o.status,
      o.paymentStatus === "CONFIRMED" ? "Best\u00e4tigt" : o.paymentStatus === "FAILED" ? "Fehlgeschlagen" : "Ausstehend",
      `${o.customerFirstName} ${o.customerLastName}`,
      o.customerEmail,
      o.customerAddress,
      o.customerZip,
      o.customerCity,
      o.customerCountry,
      String(Number(o.subtotal)),
      String(Number(o.couponDiscount)),
      String(Number(o.shippingCost)),
      String(Number(o.total)),
      o.paymentMethod || "\u00dcberweisung (SEPA)",
      o.bankReference || "",
      o.trackingNumber || "",
    ]);

    const csv = [
      header.map(escapeCsv).join(","),
      ...rows.map((row) => row.map(escapeCsv).join(",")),
    ].join("\n");

    const bom = "\uFEFF";
    return new NextResponse(bom + csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="Bestellungen_${new Date().toISOString().slice(0, 10)}.csv"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    logger.error("admin-orders-export", error);
    return handleApiError(error);
  }
}
