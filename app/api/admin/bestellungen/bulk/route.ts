import { NextResponse, NextRequest } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError, validateContentType } from "@/lib/api-helpers";
import { checkRateLimit } from "@/lib/rate-limit";
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
    const ip = request.headers?.get?.("x-forwarded-for") || "unknown";
    if (!await checkRateLimit(`admin-bestellung-bulk:${ip}`, 10, 60_000)) {
      return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429 });
    }
    const body = await request.json();
    const parsed = BulkOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { ids, status } = parsed.data;

    const result = await prisma.order.updateMany({
      where: { id: { in: ids } },
      data: { status },
    });

    return NextResponse.json({ count: result.count });
  } catch (error) {
    return handleApiError(error);
  }
}
