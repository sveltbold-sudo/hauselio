import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateProductInAlgolia, deleteProductFromAlgolia } from "@/lib/algolia-sync";
import { handleApiError, validateContentType } from "@/lib/api-helpers";
import { CreateProductSchema } from "@/lib/validations";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = getClientIp(request);
    if (!await checkRateLimit(`admin-produkt-get:${ip}`, 60, 60_000)) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    await requireAdmin();
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        images: { orderBy: { position: "asc" } },
        specs: { orderBy: { position: "asc" } },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Produkt nicht gefunden" },
        { status: 404 }
      );
    }

    return NextResponse.json({ product });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ctError = validateContentType(request, "application/json");
    if (ctError) return ctError;

    await requireAdmin();
    const ip = getClientIp(request);
    if (!await checkRateLimit(`admin-produkt:${ip}`, 30, 60_000)) {
      return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429, headers: { "Retry-After": "60" } });
    }
    const { id } = await params;
    const body = await request.json();
    const parsed = CreateProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]!.message },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const existing = await prisma.product.findFirst({
      where: { slug: data.slug, id: { not: id } },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Ein Produkt mit diesem Slug existiert bereits" },
        { status: 409 }
      );
    }

    try {
      await prisma.$transaction([
        prisma.productSpec.deleteMany({ where: { productId: id } }),
        prisma.product.update({
          where: { id },
          data: {
            name: data.name,
            slug: data.slug,
            description: data.description,
            shortDesc: data.shortDesc || null,
            price: data.price,
            originalPrice: data.originalPrice || null,
            categoryId: data.categoryId,
            brandId: data.brandId || null,
            isNew: data.isNew,
            isFeatured: data.isFeatured,
            isPromo: data.isPromo,
            weight: data.weight || null,
            features: data.features,
            seoTitle: data.seoTitle || null,
            seoDesc: data.seoDesc || null,
            specs: data.specs.length
              ? {
                  create: data.specs.map((spec, i) => ({
                    key: spec.key,
                    value: spec.value,
                    position: i,
                  })),
                }
              : undefined,
          },
        }),
      ]);
    } catch (err) {
      if (err && typeof err === "object" && "code" in err && err.code === "P2002") {
        return NextResponse.json(
          { error: "Ein Produkt mit diesem Slug existiert bereits (Race Condition)" },
          { status: 409 }
        );
      }
      throw err;
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        images: { orderBy: { position: "asc" } },
        specs: { orderBy: { position: "asc" } },
      },
    });

    try {
      await updateProductInAlgolia(id);
    } catch (algoliaError) {
      logger.error("algolia-sync", algoliaError);
    }

    return NextResponse.json({ product });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole("ADMIN");
    const ip = getClientIp(request);
    if (!await checkRateLimit(`admin-produkt:${ip}`, 30, 60_000)) {
      return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429, headers: { "Retry-After": "60" } });
    }
    const { id } = await params;

    const orderItemCount = await prisma.orderItem.count({
      where: { productId: id },
    });

    if (orderItemCount > 0) {
      return NextResponse.json(
        { error: `Produkt kann nicht gelöscht werden — es ist in ${orderItemCount} Bestellung(en) verknüpft.` },
        { status: 409 }
      );
    }

    await prisma.product.delete({
      where: { id },
    });

    try {
      await deleteProductFromAlgolia(id);
    } catch (algoliaError) {
      logger.error("algolia-delete", algoliaError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
