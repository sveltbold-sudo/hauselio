import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError, validateContentType } from "@/lib/api-helpers";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { z } from "zod";

const CategorySchema = z.object({
  name: z.string().min(1, "Name ist erforderlich").max(100),
  slug: z.string().min(1, "Slug ist erforderlich").max(100).regex(/^[a-z0-9-]+$/, "Slug darf nur Kleinbuchstaben, Zahlen und Bindestriche enthalten"),
  description: z.string().max(500).optional().nullable(),
});

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50", 10) || 50));

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        orderBy: { sortOrder: "asc" },
        skip: (page - 1) * limit,
        take: limit,
        include: { _count: { select: { products: true } } },
      }),
      prisma.category.count(),
    ]);

    return NextResponse.json({
      categories,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const allowed = await checkRateLimit(`admin-kategorie-create:${ip}`, 30, 60_000);
    if (!allowed) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    const ctError = validateContentType(request, "application/json");
    if (ctError) return ctError;

    await requireAdmin();
    const body = await request.json();
    const parsed = CategorySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: parsed.data,
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
