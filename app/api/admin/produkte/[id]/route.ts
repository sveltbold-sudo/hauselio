import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateProductInAlgolia, deleteProductFromAlgolia } from "@/lib/algolia-sync";
import { handleApiError, validateContentType } from "@/lib/api-helpers";
import { CreateProductSchema } from "@/lib/validations";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import { logActivity } from "@/lib/activity-log";
import { getCloudinary } from "@/lib/cloudinary";

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
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        shortDesc: true,
        price: true,
        originalPrice: true,
        sku: true,
        barcode: true,
        weight: true,
        isFeatured: true,
        isNew: true,
        isPromo: true,
        isDailyDeal: true,
        rating: true,
        reviewCount: true,
        features: true,
        seoTitle: true,
        seoDesc: true,
        categoryId: true,
        subCategory: true,
        brandId: true,
        createdAt: true,
        updatedAt: true,
        category: { select: { id: true, name: true, slug: true, description: true, image: true } },
        brand: { select: { id: true, name: true, slug: true, logo: true } },
        images: { orderBy: { position: "asc" }, select: { id: true, url: true, publicId: true, alt: true, position: true } },
        specs: { orderBy: { position: "asc" }, select: { id: true, key: true, value: true, position: true } },
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

    const adminUser = await requireAdmin();
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

    // Fetch existing images for incremental diff
    const existingImages = await prisma.productImage.findMany({
      where: { productId: id },
      select: { id: true, url: true, publicId: true, position: true },
      orderBy: { position: "asc" },
    });

    // Build new images list
    const newImages: { url: string; publicId: string | null; position: number }[] = [];
    if (data.imageUrl) {
      newImages.push({ url: data.imageUrl, publicId: data.imagePublicId || null, position: 0 });
      (data.images || []).forEach((img, idx) => {
        newImages.push({ url: img.url, publicId: img.publicId || null, position: img.position ?? idx + 1 });
      });
    } else if (data.images && data.images.length > 0) {
      data.images.forEach((img, idx) => {
        newImages.push({ url: img.url, publicId: img.publicId || null, position: img.position ?? idx });
      });
    }

    // Diff: find images to delete (in DB but not in new list by URL)
    const newUrls = new Set(newImages.map(i => i.url));
    const imagesToDeleteFromDb = existingImages.filter(e => !newUrls.has(e.url));
    const imagesToDeleteFromCloudinary = imagesToDeleteFromDb.filter(i => i.publicId);

    // Diff: find images to add (in new list but not in DB by URL)
    const existingUrls = new Set(existingImages.map(e => e.url));
    const imagesToAdd = newImages.filter(n => !existingUrls.has(n.url));

    try {
      await prisma.$transaction([
        ...(data.isDailyDeal ? [prisma.product.updateMany({ where: { isDailyDeal: true, NOT: { id } }, data: { isDailyDeal: false } })] : []),
        prisma.productSpec.deleteMany({ where: { productId: id } }),
        // Only delete images that were removed
        ...(imagesToDeleteFromDb.length > 0
          ? [prisma.productImage.deleteMany({ where: { id: { in: imagesToDeleteFromDb.map(i => i.id) } } })]
          : []),
        prisma.product.update({
          where: { id },
          data: {
            name: data.name,
            slug: data.slug,
            description: data.description,
            shortDesc: data.shortDesc || null,
            price: data.price,
            originalPrice: data.originalPrice || null,
            sku: data.sku || null,
            barcode: data.barcode || null,
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
            // Only add new images
            ...(imagesToAdd.length > 0
              ? { images: { create: imagesToAdd } }
              : {}),
          },
        }),
      ]);
    } catch (err) {
      if (err && typeof err === "object" && "code" in err && err.code === "P2002") {
        return NextResponse.json(
          { error: "Ein Produkt mit diesem Slug existiert bereits" },
          { status: 409 }
        );
      }
      throw err;
    }

    // Delete only removed images from Cloudinary (after DB transaction succeeds)
    if (imagesToDeleteFromCloudinary.length > 0) {
      const cloudinary = getCloudinary();
      for (const img of imagesToDeleteFromCloudinary) {
        try {
          await cloudinary.uploader.destroy(img.publicId!);
        } catch (cloudErr) {
          logger.error("cloudinary-delete", cloudErr instanceof Error ? cloudErr : new Error(String(cloudErr)), { publicId: img.publicId });
        }
      }
    }

    const product = await prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        shortDesc: true,
        price: true,
        originalPrice: true,
        sku: true,
        barcode: true,
        weight: true,
        isFeatured: true,
        isNew: true,
        isPromo: true,
        isDailyDeal: true,
        rating: true,
        reviewCount: true,
        features: true,
        seoTitle: true,
        seoDesc: true,
        categoryId: true,
        subCategory: true,
        brandId: true,
        createdAt: true,
        updatedAt: true,
        category: { select: { id: true, name: true, slug: true, description: true, image: true } },
        brand: { select: { id: true, name: true, slug: true, logo: true } },
        images: { orderBy: { position: "asc" }, select: { id: true, url: true, alt: true, position: true } },
        specs: { orderBy: { position: "asc" }, select: { id: true, key: true, value: true, position: true } },
      },
    });

    try {
      await updateProductInAlgolia(id);
    } catch (algoliaError) {
      logger.error("algolia-sync", algoliaError);
    }

    await logActivity({ action: "product.update", entity: "product", entityId: id, adminId: adminUser.id, adminEmail: adminUser.email, details: { name: product?.name ?? "unknown" } });

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
    const adminUser = await requireAdmin();
    if (adminUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Nur Administratoren können Produkte löschen" }, { status: 403 });
    }
    const ip = getClientIp(request);
    if (!await checkRateLimit(`admin-produkt:${ip}`, 30, 60_000)) {
      return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429, headers: { "Retry-After": "60" } });
    }
    const { id } = await params;

    const existingProduct = await prisma.product.findUnique({ where: { id }, select: { name: true } });
    if (!existingProduct) {
      return NextResponse.json({ error: "Produkt nicht gefunden" }, { status: 404 });
    }

    const orderItemCount = await prisma.orderItem.count({
      where: { productId: id },
    });

    if (orderItemCount > 0) {
      return NextResponse.json(
        { error: `Produkt kann nicht gelöscht werden — es ist in ${orderItemCount} Bestellung(en) verknüpft.` },
        { status: 409 }
      );
    }

    // Fetch images before DB delete (cascade will remove them from DB)
    const imagesToDelete = await prisma.productImage.findMany({
      where: { productId: id },
      select: { publicId: true },
    });

    // Delete from DB first (source of truth)
    await prisma.product.delete({
      where: { id },
    });

    // Then clean up Cloudinary images (best-effort)
    const cloudinary = getCloudinary();
    for (const img of imagesToDelete) {
      if (img.publicId) {
        try {
          await cloudinary.uploader.destroy(img.publicId);
        } catch (cloudErr) {
          logger.error("cloudinary-delete", cloudErr instanceof Error ? cloudErr : new Error(String(cloudErr)), { publicId: img.publicId });
        }
      }
    }

    try {
      await deleteProductFromAlgolia(id);
    } catch (algoliaError) {
      logger.error("algolia-delete", algoliaError);
    }

    await logActivity({ action: "product.delete", entity: "product", entityId: id, adminId: adminUser.id, adminEmail: adminUser.email, details: { name: existingProduct.name } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
