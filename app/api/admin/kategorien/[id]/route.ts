import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError, validateContentType, validateCsrfOrigin } from "@/lib/api-helpers";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { ValidationError } from "@/lib/errors";
import { z } from "zod";

const CategorySchema = z.object({
  name: z.string().min(1, "Name ist erforderlich").max(100),
  slug: z.string().min(1, "Slug ist erforderlich").max(100).regex(/^[a-z0-9-]+$/, "Slug darf nur Kleinbuchstaben, Zahlen und Bindestriche enthalten"),
  description: z.string().max(500).optional().nullable(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ctError = validateContentType(request, "application/json");
    if (ctError) return ctError;

    if (!validateCsrfOrigin(request)) {
      return NextResponse.json({ error: "CSRF-Token ungültig" }, { status: 403 });
    }

    await requireAdmin();
    const ip = getClientIp(request);
    if (!await checkRateLimit(`admin-kategorie:${ip}`, 30, 60_000)) {
      return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429, headers: { "Retry-After": "60" } });
    }
    const { id } = await params;
    const body = await request.json();
    const parsed = CategorySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]!.message },
        { status: 400 }
      );
    }

    const category = await prisma.category.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({ category });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!validateCsrfOrigin(request)) {
      return NextResponse.json({ error: "CSRF-Token ungültig" }, { status: 403 });
    }

    await requireAdmin();

    const ip = getClientIp(request);
    const allowed = await checkRateLimit(`admin-kategorie-delete:${ip}`, 30, 60_000);
    if (!allowed) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }
    const { id } = await params;

    await prisma.$transaction(async (tx) => {
      const productCount = await tx.product.count({ where: { categoryId: id } });
      if (productCount > 0) {
        throw new ValidationError(`Kategorie kann nicht gelöscht werden: ${productCount} Produkte sind zugeordnet.`);
      }
      const childCount = await tx.category.count({ where: { parentId: id } });
      if (childCount > 0) {
        throw new ValidationError(`Kategorie kann nicht gelöscht werden: ${childCount} Unterkategorien sind zugeordnet.`);
      }
      await tx.category.delete({ where: { id } });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
