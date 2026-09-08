import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateProductInAlgolia } from "@/lib/algolia-sync";
import { handleApiError, validateContentType, validateCsrfOrigin } from "@/lib/api-helpers";
import { CreateProductSchema } from "@/lib/validations";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import { logActivity } from "@/lib/activity-log";

export async function POST(request: NextRequest) {
  try {
    if (!validateCsrfOrigin(request)) {
      return NextResponse.json(
        { error: "CSRF-Schutz: Ungültige Herkunft" },
        { status: 403 }
      );
    }

    const ip = getClientIp(request);
    const allowed = await checkRateLimit(`admin-produkt-create:${ip}`, 30, 60_000);
    if (!allowed) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    const ctError = validateContentType(request, "application/json");
    if (ctError) return ctError;

    const adminUser = await requireAdmin();
    const body = await request.json();
    const parsed = CreateProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]!.message },
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

    let product;
    try {
      if (data.isDailyDeal) {
        product = await prisma.$transaction(async (tx) => {
          await tx.product.updateMany({ where: { isDailyDeal: true }, data: { isDailyDeal: false } });
          return tx.product.create({
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
              isDailyDeal: data.isDailyDeal,
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
              images: data.imageUrl
                ? {
                    create: [
                      { url: data.imageUrl, publicId: data.imagePublicId || null, position: 0 },
                      ...(data.images || []).map((img, idx) => ({
                        url: img.url,
                        publicId: img.publicId || null,
                        position: img.position ?? idx + 1,
                      })),
                    ],
                  }
                : data.images && data.images.length > 0
                  ? {
                      create: data.images.map((img, idx) => ({
                        url: img.url,
                        publicId: img.publicId || null,
                        position: img.position ?? idx,
                      })),
                    }
                  : undefined,
            },
            select: {
              id: true,
              name: true,
              slug: true,
              description: true,
              shortDesc: true,
              price: true,
              originalPrice: true,
              categoryId: true,
              brandId: true,
              isNew: true,
              isFeatured: true,
              isPromo: true,
              isDailyDeal: true,
              weight: true,
              features: true,
              seoTitle: true,
              seoDesc: true,
              rating: true,
              reviewCount: true,
              createdAt: true,
              updatedAt: true,
              images: { select: { id: true, url: true, alt: true, position: true } },
            },
          });
        });
      } else {
        product = await prisma.product.create({
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
            isDailyDeal: data.isDailyDeal,
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
            images: data.imageUrl
              ? {
                  create: [
                    { url: data.imageUrl, publicId: data.imagePublicId || null, position: 0 },
                    ...(data.images || []).map((img, idx) => ({
                      url: img.url,
                      publicId: img.publicId || null,
                      position: img.position ?? idx + 1,
                    })),
                  ],
                }
              : data.images && data.images.length > 0
                ? {
                    create: data.images.map((img, idx) => ({
                      url: img.url,
                      publicId: img.publicId || null,
                      position: img.position ?? idx,
                    })),
                  }
                : undefined,
          },
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            shortDesc: true,
            price: true,
            originalPrice: true,
            categoryId: true,
            brandId: true,
            isNew: true,
            isFeatured: true,
            isPromo: true,
            isDailyDeal: true,
            weight: true,
            features: true,
            seoTitle: true,
            seoDesc: true,
            rating: true,
            reviewCount: true,
            createdAt: true,
            updatedAt: true,
            images: { select: { id: true, url: true, alt: true, position: true } },
          },
        });
      }
    } catch (err) {
      if (err && typeof err === "object" && "code" in err && err.code === "P2002") {
        return NextResponse.json(
          { error: "Ein Produkt mit diesem Slug existiert bereits" },
          { status: 409 }
        );
      }
      throw err;
    }

    try {
      await updateProductInAlgolia(product.id);
    } catch (algoliaError) {
      logger.error("algolia-sync", algoliaError);
    }

    logActivity({ action: "product.create", entity: "product", entityId: product.id, adminId: adminUser.id, adminEmail: adminUser.email, details: { name: product.name } });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
