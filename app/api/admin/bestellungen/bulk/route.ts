import { NextResponse, NextRequest } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError, validateContentType } from "@/lib/api-helpers";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { z } from "zod";

const BulkOrderSchema = z.object({
  ids: z.array(z.string().uuid()).min(1).max(50),
  status: z.enum([
    "PENDING_PAYMENT",
    "PAYMENT_CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ]),
});

export async function POST(request: NextRequest) {
  try {
    const ctError = validateContentType(request, "application/json");
    if (ctError) return ctError;

    await requireRole("ADMIN");
    const ip = getClientIp(request);
    if (!await checkRateLimit(`admin-bestellung-bulk:${ip}`, 10, 60_000)) {
      return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429, headers: { "Retry-After": "60" } });
    }
    const body = await request.json();
    const parsed = BulkOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]!.message },
        { status: 400 }
      );
    }

    const { ids, status } = parsed.data;

    const { VALID_ORDER_TRANSITIONS } = await import("@/lib/admin-constants");
    const orders = await prisma.order.findMany({
      where: { id: { in: ids } },
      select: { id: true, status: true },
    });

    const validOrders = orders.filter((o) => {
      const allowed = VALID_ORDER_TRANSITIONS[o.status] ?? [];
      return allowed.includes(status);
    });

    if (validOrders.length === 0) {
      return NextResponse.json(
        { error: `Keine Bestellungen mit gültigem Statusübergang für → ${status}` },
        { status: 400 }
      );
    }

    const validIds = validOrders.map((o) => o.id);
    const result = await prisma.order.updateMany({
      where: { id: { in: validIds } },
      data: { status },
    });

    const skipped = ids.length - result.count;
    return NextResponse.json({
      count: result.count,
      skipped,
      message: skipped > 0 ? `${skipped} Bestellung(en) übersprungen (ungültiger Übergang)` : undefined,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
