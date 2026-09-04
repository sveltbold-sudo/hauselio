import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api-helpers";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const product = await prisma.product.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        sku: true,
        barcode: true,
        description: true,
        price: true,
        originalPrice: true,
        isPromo: true,
        isNew: true,
        rating: true,
        reviewCount: true,
        category: { select: { name: true, slug: true } },
        brand: { select: { name: true, slug: true } },
        images: { orderBy: { position: "asc" }, select: { url: true } },
        specs: { orderBy: { position: "asc" }, select: { key: true, value: true } },
        reviews: {
          where: { isApproved: true },
          select: {
            authorName: true,
            rating: true,
            title: true,
            content: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Produkt nicht gefunden" }, { status: 404 });
    }

    const relatedProducts = await prisma.product.findMany({
      where: {
        category: { slug: product.category?.slug },
        id: { not: product.id },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        brand: { select: { name: true } },
        images: { take: 1, orderBy: { position: "asc" }, select: { url: true } },
      },
      take: 3,
      orderBy: { rating: "desc" },
    });

    return NextResponse.json({
      product: {
        ...product,
        price: Number(product.price),
        originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
        rating: Number(product.rating),
        reviews: product.reviews.map((r) => ({
          ...r,
          createdAt: r.createdAt.toISOString(),
        })),
      },
      relatedProducts: relatedProducts.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: Number(p.price),
        image: p.images[0]?.url || "/images/placeholder-product.svg",
        brand: p.brand?.name || null,
      })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
