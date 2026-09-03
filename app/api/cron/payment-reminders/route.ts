import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPaymentReminder } from "@/lib/emails";
import { logger } from "@/lib/logger";

const PAYMENT_REMINDER_DELAYS = [
  { days: 2, maxReminders: 1 },
  { days: 5, maxReminders: 2 },
  { days: 10, maxReminders: 3 },
];
const MAX_REMINDERS_TOTAL = 3;

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
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
      processed: eligibleOrders.length,
      ...results,
    });
  } catch (error) {
    logger.error("cron-payment-reminders", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
