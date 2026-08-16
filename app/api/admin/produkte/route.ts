import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateProductInAlgolia } from "@/lib/algolia-sync";
import { handleApiError, validateContentType } from "@/lib/api-helpers";
import { CreateProductSchema } from "@/lib/validations";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const allowed = await checkRateLimit(`admin-produkt-create:${ip}`, 30, 60_000);
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
    const parsed = CreateProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const existing = await prisma.product.findUnique({ where: { slug: data.slug } });
    if (existing) {
      return NextResponse.json(
        { error: "Ein Produkt mit diesem Slug existiert bereits" },
        { status: 409 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        shortDesc: data.shortDesc || null,
        price: data.price,
        originalPrice: data.originalPrice || null,
        categoryId: data.categoryId,
        brandId: data.brandId || null,
        inStock: data.inStock,
        isNew: data.isNew,
        isFeatured: data.isFeatured,
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
    });

    try {
      await updateProductInAlgolia(product.id);
    } catch (algoliaError) {
      console.error("Algolia sync error:", algoliaError);
    }

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
