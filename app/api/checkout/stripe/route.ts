import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";
import { CreateOrderSchema } from "@/lib/validations";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { getShippingCost } from "@/lib/constants";
import { SITE_URL } from "@/lib/constants";
import { validateCsrfOrigin, validateContentType, handleApiError } from "@/lib/api-helpers";
import { ValidationError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { getCustomerFromRequest } from "@/lib/auth";
import { getStripe } from "@/lib/stripe";

// POST /api/checkout/stripe — crée la commande (paiement carte) + session Stripe Checkout
export async function POST(request: NextRequest) {
  try {
    const ctError = validateContentType(request, "application/json");
    if (ctError) return ctError;

    if (!validateCsrfOrigin(request)) {
      return NextResponse.json({ error: "CSRF-Schutz: Ungültige Herkunft" }, { status: 403 });
    }

    const ip = getClientIp(request);
    if (!await checkRateLimit(`stripe-checkout:${ip}`, 5, 60 * 1000)) {
      return NextResponse.json({ error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." }, { status: 429, headers: { "Retry-After": "60" } });
    }

    let stripe;
    try {
      stripe = getStripe();
    } catch {
      return NextResponse.json({ error: "Kartenzahlung ist derzeit nicht verfügbar." }, { status: 503 });
    }

    const body = await request.json();
    const parsed = CreateOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]!.message }, { status: 400 });
    }

    const { email, firstName, lastName, phone, address, city, zip, country, notes, items, couponCode, gclid, gbraid, wbraid } = parsed.data;

    let customerId: string | null = null;
    try {
      const customer = await getCustomerFromRequest();
      if (customer) {
        const exists = await prisma.customer.findUnique({ where: { id: customer.id }, select: { id: true } });
        if (exists) customerId = exists.id;
      }
    } catch { /* Guest checkout */ }

    // Coupon (mêmes règles que Vorkasse — incrémenté au paiement confirmé via webhook)
    let couponDiscount = 0;
    let couponRecord: { code: string; discountPercent: number } | null = null;
    if (couponCode) {
      const upperCode = couponCode.toUpperCase();
      const found = await prisma.coupon.findUnique({ where: { code: upperCode } });
      if (found && found.isActive && (!found.expiresAt || found.expiresAt > new Date()) && (found.maxUses === 0 || found.usedCount < found.maxUses)) {
        couponRecord = { code: found.code, discountPercent: found.discountPercent };
      }
    }

    const productIds = items.map((item) => item.id);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, price: true, name: true, stockQuantity: true },
    });
    const productMap = new Map(products.map((p) => [p.id, p]));

    let subtotal = 0;
    const validatedItems = items.map((item) => {
      const product = productMap.get(item.id);
      if (!product) throw new ValidationError("Ein oder mehrere Produkte sind nicht verfügbar");
      const quantity = Math.max(1, Math.min(99, item.quantity));
      if (item.quantity < 1 || item.quantity > 99) throw new ValidationError(`Ungültige Menge für ${product.name}: ${item.quantity}`);
      if (product.stockQuantity !== null && quantity > product.stockQuantity) {
        throw new ValidationError(`Nur ${product.stockQuantity} Stück verfügbar für ${product.name}`);
      }
      const price = Number(product.price);
      subtotal += price * quantity;
      return { productId: item.id, quantity, price, name: product.name };
    });

    const shippingCost = getShippingCost(subtotal, country || "DE");
    if (couponRecord) {
      couponDiscount = Math.round(subtotal * (couponRecord.discountPercent / 100) * 100) / 100;
    }
    const total = subtotal - couponDiscount + shippingCost;
    if (total < 0.5) throw new ValidationError("Ungültiger Bestellbetrag");

    // Commande en PENDING (paiement carte en attente)
    const orderNumber = generateOrderNumber();
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: customerId || undefined,
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
        couponDiscount,
        shippingCost,
        total,
        paymentMethod: "card",
        gclid: gclid || null,
        gbraid: gbraid || null,
        wbraid: wbraid || null,
        items: { create: validatedItems.map((i) => ({ productId: i.productId, quantity: i.quantity, price: i.price })) },
      },
      select: { id: true, orderNumber: true },
    });

    // Session Stripe Checkout (prix côté serveur uniquement)
    const lineItems = validatedItems.map((i) => ({
      price_data: {
        currency: "eur",
        product_data: { name: i.name },
        unit_amount: Math.round(i.price * 100),
      },
      quantity: i.quantity,
    }));
    if (shippingCost > 0) {
      lineItems.push({
        price_data: { currency: "eur", product_data: { name: "Versandkosten" }, unit_amount: Math.round(shippingCost * 100) },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: lineItems,
      metadata: { orderId: order.id, orderNumber: order.orderNumber, couponCode: couponRecord?.code || "" },
      success_url: `${SITE_URL}/bestellung/erfolg?order=${order.orderNumber}`,
      cancel_url: `${SITE_URL}/bestellung?stripe=canceled`,
    });

    await prisma.order.update({ where: { id: order.id }, data: { stripeSessionId: session.id } });

    return NextResponse.json({ url: session.url, orderNumber: order.orderNumber });
  } catch (err) {
    return handleApiError(err);
  }
}
