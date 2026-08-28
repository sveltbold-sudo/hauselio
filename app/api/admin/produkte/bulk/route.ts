import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError, validateContentType } from "@/lib/api-helpers";
import { deleteProductFromAlgolia, updateProductInAlgolia } from "@/lib/algolia-sync";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { z } from "zod";

const BulkActionSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("delete"),
    ids: z.array(z.string().uuid()).min(1).max(50),
  }),
  z.object({
    action: z.literal("updateStock"),
    ids: z.array(z.string().uuid()).min(1).max(50),
    inStock: z.boolean(),
  }),
]);

export async function POST(request: NextRequest) {
  try {
    const ctError = validateContentType(request, "application/json");
    if (ctError) return ctError;

    await requireRole("ADMIN");
    const ip = getClientIp(request);
    if (!await checkRateLimit(`admin-produkt-bulk:${ip}`, 10, 60_000)) {
      return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429, headers: { "Retry-After": "60" } });
    }
    const body = await request.json();
    const parsed = BulkActionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]!.message },
        { status: 400 }
      );
    }

    const { action, ids } = parsed.data;

    if (action === "delete") {
      const result = await prisma.product.deleteMany({
        where: { id: { in: ids } },
      });
      for (const id of ids) {
        try { await deleteProductFromAlgolia(id); } catch { /* ignore */ }
      }
      return NextResponse.json({ count: result.count });
    }

    if (action === "updateStock") {
      const result = await prisma.product.updateMany({
        where: { id: { in: ids } },
        data: { inStock: parsed.data.inStock },
      });
      for (const id of ids) {
        try { await updateProductInAlgolia(id); } catch { /* ignore */ }
      }
      return NextResponse.json({ count: result.count });
    }

    return NextResponse.json({ error: "Unbekannte Aktion" }, { status: 400 });
  } catch (error) {
    return handleApiError(error);
  }
}
