import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { uploadOrderConversionById, isAdsUploadConfigured } from "@/lib/google-ads.server";
import type { OrderStatus } from "@prisma/client";

const PAID_STATUSES: OrderStatus[] = ["PAYMENT_CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];
const BATCH_SIZE = 20;
const MAX_ATTEMPTS = 5;

function unauthorized() {
  return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
}

/**
 * Cron import serveur Google Ads (toutes les 6h via vercel.json).
 * Rattrape les conversions non uploadees (bulk admin, echec inline).
 *
 * GET /api/cron/ads-conversions (Bearer CRON_SECRET)
 *   ?validateOnly=1            -> dry-run, ne marque rien comme uploade
 *   ?orderNumber=HL-...        -> traite une seule commande (debug)
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || !authHeader?.startsWith("Bearer ")) {
      return unauthorized();
    }

    const receivedToken = authHeader.slice(7);
    const expectedBuf = Buffer.from(cronSecret, "utf8");
    const receivedBuf = Buffer.from(receivedToken, "utf8");

    if (expectedBuf.length !== receivedBuf.length || !timingSafeEqual(expectedBuf, receivedBuf)) {
      return unauthorized();
    }

    if (!isAdsUploadConfigured()) {
      return NextResponse.json(
        { error: "Google Ads API nicht konfiguriert (GOOGLE_ADS_CLIENT_ID/SECRET/REFRESH_TOKEN/DEVELOPER_TOKEN)" },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const validateOnly = searchParams.get("validateOnly") === "1";
    const onlyOrderNumber = searchParams.get("orderNumber");

    const pending = await prisma.order.findMany({
      where: onlyOrderNumber
        ? { orderNumber: onlyOrderNumber }
        : {
            status: { in: PAID_STATUSES },
            adsConversionUploadedAt: null,
            adsUploadAttempts: { lt: MAX_ATTEMPTS },
          },
      select: { id: true, orderNumber: true, status: true },
      orderBy: { updatedAt: "asc" },
      take: onlyOrderNumber ? 1 : BATCH_SIZE,
    });

    const results = { uploaded: 0, skipped: 0, failed: 0, details: [] as Array<{ orderNumber: string; ok: boolean; info: string }> };

    for (const order of pending) {
      try {
        const outcome = await uploadOrderConversionById(order.id, { validateOnly });
        if (outcome.ok) {
          results.uploaded++;
          results.details.push({
            orderNumber: order.orderNumber,
            ok: true,
            info: `click:${outcome.clickUploaded ? "ja" : "nein"} enhanced:${outcome.enhancedUploaded ? "ja" : "nein"}${validateOnly ? " (dry-run)" : ""}`,
          });
        } else if (outcome.skipped) {
          results.skipped++;
          results.details.push({ orderNumber: order.orderNumber, ok: false, info: `skip: ${outcome.skipped}` });
        } else {
          results.failed++;
          results.details.push({ orderNumber: order.orderNumber, ok: false, info: `fehler: ${outcome.error}` });
        }
      } catch (error) {
        results.failed++;
        const message = error instanceof Error ? error.message : String(error);
        logger.error("cron-ads-conversions", error instanceof Error ? error : new Error(message), {
          orderNumber: order.orderNumber,
        });
        results.details.push({ orderNumber: order.orderNumber, ok: false, info: `fehler: ${message}` });
      }
    }

    return NextResponse.json({
      success: true,
      processed: pending.length,
      validateOnly,
      ...results,
    });
  } catch (error) {
    logger.error("cron-ads-conversions", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
