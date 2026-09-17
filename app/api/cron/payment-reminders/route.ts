import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { prisma } from "@/lib/prisma";
import { sendPaymentReminder, sendReviewRequest } from "@/lib/emails";
import { logger } from "@/lib/logger";

const PAYMENT_REMINDER_DELAYS = [
  { days: 2, maxReminders: 1 },
  { days: 5, maxReminders: 2 },
  { days: 10, maxReminders: 3 },
];
const MAX_REMINDERS_TOTAL = 3;

// Demandes d'avis post-livraison: 1re demande à J+3, rappel unique à J+10
const REVIEW_REQUEST_DELAYS = [
  { days: 3, maxRequests: 1 },
  { days: 10, maxRequests: 2 },
];
const MAX_REVIEW_REQUESTS_TOTAL = 2;

async function processReviewRequests(now: Date) {
  const results = { sent: 0, skipped: 0, errors: 0 };

  const deliveredOrders = await prisma.order.findMany({
    where: {
      status: "DELIVERED",
      deliveredAt: { not: null },
      reviewRequestCount: { lt: MAX_REVIEW_REQUESTS_TOTAL },
    },
    select: {
      id: true,
      orderNumber: true,
      customerEmail: true,
      customerFirstName: true,
      customerLastName: true,
      deliveredAt: true,
      reviewRequestCount: true,
      items: {
        select: {
          product: { select: { id: true, name: true, slug: true } },
        },
      },
    },
  });

  for (const order of deliveredOrders) {
    if (!order.deliveredAt) {
      results.skipped++;
      continue;
    }
    const daysSinceDelivered = Math.floor(
      (now.getTime() - order.deliveredAt.getTime()) / (1000 * 60 * 60 * 24)
    );

    const nextRequest = REVIEW_REQUEST_DELAYS.find(
      (r) => order.reviewRequestCount < r.maxRequests && daysSinceDelivered >= r.days
    );

    if (!nextRequest) {
      results.skipped++;
      continue;
    }

    // Ne pas relancer un client qui a déjà noté un article de la commande
    const productIds = [...new Set(order.items.map((i) => i.product.id))];
    const alreadyReviewed = await prisma.review.count({
      where: { productId: { in: productIds }, authorEmail: order.customerEmail },
    });
    if (alreadyReviewed > 0) {
      await prisma.order.update({
        where: { id: order.id },
        data: { reviewRequestCount: MAX_REVIEW_REQUESTS_TOTAL },
      });
      results.skipped++;
      continue;
    }

    const seen = new Set<string>();
    const items = order.items
      .filter((i) => {
        if (seen.has(i.product.id)) return false;
        seen.add(i.product.id);
        return true;
      })
      .map((i) => ({ name: i.product.name, slug: i.product.slug }));

    if (items.length === 0) {
      results.skipped++;
      continue;
    }

    try {
      await sendReviewRequest({
        orderNumber: order.orderNumber,
        customerEmail: order.customerEmail,
        customerName: `${order.customerFirstName} ${order.customerLastName}`,
        items,
        isReminder: order.reviewRequestCount > 0,
      });

      await prisma.order.update({
        where: { id: order.id },
        data: {
          reviewRequestCount: { increment: 1 },
          lastReviewRequestAt: now,
        },
      });

      results.sent++;
      logger.info("review-request-sent", `Review request sent for ${order.orderNumber}`, {
        orderNumber: order.orderNumber,
        reviewRequestCount: order.reviewRequestCount + 1,
      });
    } catch (emailError) {
      results.errors++;
      logger.error("review-request-error", emailError);
    }
  }

  return results;
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || !authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const receivedToken = authHeader.slice(7);
    const expectedBuf = Buffer.from(cronSecret, "utf8");
    const receivedBuf = Buffer.from(receivedToken, "utf8");

    if (expectedBuf.length !== receivedBuf.length || !timingSafeEqual(expectedBuf, receivedBuf)) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const now = new Date();

    const eligibleOrders = await prisma.order.findMany({
      where: {
        status: "PENDING_PAYMENT",
        paymentStatus: "PENDING",
        reminderCount: { lt: MAX_REMINDERS_TOTAL },
      },
      select: {
        id: true,
        orderNumber: true,
        customerEmail: true,
        customerFirstName: true,
        customerLastName: true,
        total: true,
        createdAt: true,
        reminderCount: true,
      },
    });

    const results = { sent: 0, skipped: 0, errors: 0 };

    for (const order of eligibleOrders) {
      const daysSinceOrder = Math.floor(
        (now.getTime() - order.createdAt.getTime()) / (1000 * 60 * 60 * 24)
      );

      const nextReminder = PAYMENT_REMINDER_DELAYS.find(
        (r) => order.reminderCount < r.maxReminders && daysSinceOrder >= r.days
      );

      if (!nextReminder) {
        results.skipped++;
        continue;
      }

      try {
        await sendPaymentReminder({
          orderNumber: order.orderNumber,
          customerEmail: order.customerEmail,
          customerName: `${order.customerFirstName} ${order.customerLastName}`,
          total: Number(order.total),
          createdAt: order.createdAt.toISOString(),
          reminderCount: order.reminderCount,
        });

        await prisma.order.update({
          where: { id: order.id },
          data: {
            reminderCount: { increment: 1 },
            lastReminderAt: now,
          },
        });

        results.sent++;
        logger.info("payment-reminder-sent", `Reminder sent for ${order.orderNumber}`, {
          orderNumber: order.orderNumber,
          reminderCount: order.reminderCount + 1,
        });
      } catch (emailError) {
        results.errors++;
        logger.error("payment-reminder-error", emailError);
      }
    }

    return NextResponse.json({
      success: true,
      paymentReminders: {
        processed: eligibleOrders.length,
        ...results,
      },
      reviewRequests: await processReviewRequests(now),
    });
  } catch (error) {
    logger.error("cron-payment-reminders", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
