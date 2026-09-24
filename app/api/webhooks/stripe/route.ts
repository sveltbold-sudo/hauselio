import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { sendPaymentConfirmed, sendNewOrderAdminNotification } from "@/lib/emails";
import { logger } from "@/lib/logger";

// POST /api/webhooks/stripe — événements Stripe (signature vérifiée)
export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    logger.error("stripe-webhook-no-secret", new Error("STRIPE_WEBHOOK_SECRET missing"));
    return NextResponse.json({ error: "Webhook nicht konfiguriert" }, { status: 500 });
  }

  let stripe;
  try {
    stripe = getStripe();
  } catch {
    return NextResponse.json({ error: "Stripe nicht konfiguriert" }, { status: 500 });
  }

  const rawBody = await request.text();
  const sig = request.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Signatur fehlt" }, { status: 400 });

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, secret);
  } catch (err) {
    logger.error("stripe-webhook-bad-sig", err instanceof Error ? err : new Error(String(err)));
    return NextResponse.json({ error: "Ungültige Signatur" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as { id: string; metadata?: { orderId?: string; couponCode?: string }; amount_total?: number | null; currency?: string | null; payment_intent?: string | { id: string } | null };
      const orderId = session.metadata?.orderId;
      if (!orderId) {
        logger.error("stripe-webhook-no-order", new Error("Missing orderId in metadata"));
        return NextResponse.json({ received: true });
      }

      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: { include: { product: { select: { name: true } } } } },
      });
      if (!order) {
        logger.error("stripe-webhook-order-missing", new Error(`Order ${orderId} not found`));
        return NextResponse.json({ received: true });
      }
      if (order.paymentStatus === "CONFIRMED") return NextResponse.json({ received: true });

      // Vérifier le montant (centimes) avant de confirmer
      const expectedCents = Math.round(Number(order.total) * 100);
      if (session.amount_total !== expectedCents || (session.currency || "").toLowerCase() !== "eur") {
        logger.error("stripe-webhook-amount", new Error(`Amount mismatch order ${order.orderNumber}: stripe=${session.amount_total} expected=${expectedCents}`));
        return NextResponse.json({ received: true });
      }

      const piId = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id || null;

      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: "CONFIRMED",
          status: "PAYMENT_CONFIRMED",
          paidAt: new Date(),
          stripeSessionId: session.id,
          stripePaymentIntentId: piId,
        },
      });

      // Coupon : incrémenté uniquement au paiement confirmé
      if (session.metadata?.couponCode) {
        await prisma.$executeRaw`
          UPDATE "Coupon" SET "usedCount" = "usedCount" + 1
          WHERE "code" = ${session.metadata.couponCode}
          AND "isActive" = true
          AND ("expiresAt" IS NULL OR "expiresAt" > NOW())
          AND ("maxUses" = 0 OR "usedCount" < "maxUses")
        `;
      }

      const emailItems = order.items.map((i) => ({ name: i.product?.name || "Produkt", quantity: i.quantity, price: Number(i.price) }));
      const customerName = `${order.customerFirstName} ${order.customerLastName}`;

      await sendPaymentConfirmed({
        orderNumber: order.orderNumber,
        customerEmail: order.customerEmail,
        customerName,
        items: emailItems,
        subtotal: Number(order.subtotal),
        couponDiscount: Number(order.couponDiscount),
        total: Number(order.total),
        shippingCost: Number(order.shippingCost),
      }).catch((e) => logger.error("stripe-email-customer", e instanceof Error ? e : new Error(String(e))));

      await sendNewOrderAdminNotification({
        orderNumber: order.orderNumber,
        customerName,
        customerEmail: order.customerEmail,
        customerAddress: order.customerAddress,
        customerCity: order.customerCity,
        customerZip: order.customerZip,
        items: emailItems,
        subtotal: Number(order.subtotal),
        couponDiscount: Number(order.couponDiscount),
        total: Number(order.total),
        shippingCost: Number(order.shippingCost),
      }).catch((e) => logger.error("stripe-email-admin", e instanceof Error ? e : new Error(String(e))));
    } else if (event.type === "checkout.session.expired") {
      const session = event.data.object as { metadata?: { orderId?: string } };
      const orderId = session.metadata?.orderId;
      if (orderId) {
        await prisma.order.updateMany({
          where: { id: orderId, paymentStatus: "PENDING", paymentMethod: "card" },
          data: { status: "CANCELLED", paymentStatus: "FAILED" },
        });
      }
    }
  } catch (err) {
    logger.error("stripe-webhook-handler", err instanceof Error ? err : new Error(String(err)));
    // 200 quand même pour éviter les retries infinis sur erreur métier
    return NextResponse.json({ received: true });
  }

  return NextResponse.json({ received: true });
}
