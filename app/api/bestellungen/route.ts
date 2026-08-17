import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";
import { sendOrderConfirmation } from "@/lib/emails";
import { CreateOrderSchema } from "@/lib/validations";
import { checkRateLimit } from "@/lib/rate-limit";
import { getShippingCost } from "@/lib/constants";
import { validateCsrfOrigin, validateContentType, handleApiError } from "@/lib/api-helpers";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const ctError = validateContentType(request, "application/json");
    if (ctError) return ctError;

    if (!validateCsrfOrigin(request)) {
      return NextResponse.json(
        { error: "CSRF-Schutz: Ungültige Herkunft" },
        { status: 403 }
      );
    }

    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (!await checkRateLimit(`order:${ip}`, 5, 60 * 1000)) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = CreateOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, firstName, lastName, phone, address, city, zip, country, notes, items } = parsed.data;

    const productIds = items.map((item) => item.id);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, price: true, name: true, inStock: true },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    let subtotal = 0;
    const validatedItems = items.map((item) => {
      const product = productMap.get(item.id);
      if (!product) {
        throw new Error(`Produkt ${item.id} nicht gefunden`);
      }
      if (!product.inStock) {
        throw new Error(`${product.name} ist leider nicht verfügbar`);
      }
      const quantity = Math.max(1, Math.min(99, item.quantity));
      const price = Number(product.price);
      subtotal += price * quantity;
      return { productId: item.id, quantity, price };
    });

    const shippingCost = getShippingCost(subtotal);
    const total = subtotal + shippingCost;

    const MAX_RETRIES = 5;
    let order;
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        order = await prisma.order.create({
          data: {
            orderNumber: generateOrderNumber(),
            customerEmail: email,
            customerFirstName: firstName,
            customerLastName: lastName,
            customerPhone: phone || null,
            customerAddress: address,
            customerZip: zip,
            customerCity: city,
            customerCountry: country || "DE",
            customerNotes: notes || null,
            subtotal,
            shippingCost,
            total,
            items: {
              create: validatedItems,
            },
          },
          include: {
            items: true,
          },
        });
        break;
      } catch (err: unknown) {
        if (err instanceof Error && 'code' in err && err.code === "P2002" && attempt < MAX_RETRIES - 1) {
          continue;
        }
        throw err;
      }
    }

    if (!order) {
      return NextResponse.json(
        { error: "Bestellung konnte nicht erstellt werden. Bitte versuchen Sie es erneut." },
        { status: 500 }
      );
    }

    try {
      const emailItems = validatedItems.map((item) => {
        const product = productMap.get(item.productId);
        return {
          name: product?.name || "Produkt",
          quantity: item.quantity,
          price: item.price,
        };
      });

      await sendOrderConfirmation({
        orderNumber: order.orderNumber,
        customerEmail: email,
        customerName: `${firstName} ${lastName}`,
        items: emailItems,
        total: total,
        shippingCost,
      });
    } catch (emailError) {
      logger.error("order-email", emailError);
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (!await checkRateLimit(`lookup:${ip}`, 10, 60_000)) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get("orderNumber");
    const email = searchParams.get("email");

    if (!orderNumber || orderNumber.length > 50) {
      return NextResponse.json(
        { error: "Bestellnummer und E-Mail sind erforderlich" },
        { status: 400 }
      );
    }

    if (!email || email.length > 254) {
      return NextResponse.json(
        { error: "E-Mail-Adresse erforderlich" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findFirst({
      where: {
        orderNumber,
        customerEmail: { equals: email, mode: "insensitive" },
      },
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
