import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError, validateContentType } from "@/lib/api-helpers";
import { checkRateLimit } from "@/lib/rate-limit";
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

    await requireAdmin();
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (!await checkRateLimit(`admin-kategorie:${ip}`, 30, 60_000)) {
      return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429 });
    }
    const { id } = await params;
    const body = await request.json();
    const parsed = CategorySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
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
    await requireAdmin();
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const allowed = await checkRateLimit(`admin-kategorie-delete:${ip}`, 30, 60_000);
    if (!allowed) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }
    const { id } = await params;

    await prisma.category.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
