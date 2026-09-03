import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api-helpers";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const allowed = await checkRateLimit(`products:${ip}`, 60, 60_000);
    if (!allowed) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const brand = searchParams.get("brand");
    const search = searchParams.get("search") || searchParams.get("q");
    const sort = searchParams.get("sort");
    const price = searchParams.get("price");
    const promo = searchParams.get("promo");
    const rating = searchParams.get("rating");

    const rawPage = parseInt(searchParams.get("page") || "1", 10);
    const rawLimit = parseInt(searchParams.get("limit") || "20", 10);
    const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;
    const limit = Number.isFinite(rawLimit)
      ? Math.min(100, Math.max(1, rawLimit))
      : 20;

    const where: {
      category?: { slug: string };
      brand?: { slug: string };
      OR?: Array<{ name: { contains: string; mode: "insensitive" } } | { description: { contains: string; mode: "insensitive" } }>;
      price?: { gte?: number; lte?: number };
      rating?: { gte?: number };
      isPromo?: boolean;
    } = {};

    if (category) {
      where.category = { slug: category };
    }

    if (brand) {
      where.brand = { slug: brand };
    }

    if (search && search.trim().length > 0) {
      if (search.trim().length > 200) {
        return NextResponse.json(
          { error: "Suchbegriff darf maximal 200 Zeichen lang sein" },
          { status: 400 }
        );
      }
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (promo === "true") {
      where.isPromo = true;
    }

    if (price) {
      const parts = price.split("-");
      const priceFilter: { gte?: number; lte?: number } = {};
      if (parts[0]) {
        const minVal = parseFloat(parts[0]);
        if (!isNaN(minVal)) priceFilter.gte = minVal;
      }
      if (parts[1]) {
        const maxVal = parseFloat(parts[1]);
        if (!isNaN(maxVal)) priceFilter.lte = maxVal;
      }
      if (Object.keys(priceFilter).length > 0) {
        where.price = priceFilter;
      }
    }

    if (rating) {
      const minRating = Number(rating);
      if (!isNaN(minRating) && minRating > 0) {
        where.rating = { gte: minRating };
      }
    }

    let orderBy: Record<string, string> = { createdAt: "desc" };
    if (sort === "price_asc") orderBy = { price: "asc" };
    else if (sort === "price_desc") orderBy = { price: "desc" };
    else if (sort === "name") orderBy = { name: "asc" };
    else if (sort === "newest") orderBy = { createdAt: "desc" };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          originalPrice: true,
          rating: true,
          reviewCount: true,
          isNew: true,
          isPromo: true,
          brand: { select: { name: true } },
          category: { select: { name: true, slug: true } },
          images: { take: 1, orderBy: { position: "asc" }, select: { url: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
      }),
      prisma.product.count({ where }),
    ]);

    const formatted = products.map((p) => ({
      ...p,
      price: Number(p.price),
      originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
      rating: Number(p.rating),
      brand: p.brand?.name || null,
      category: p.category?.name || null,
      categorySlug: p.category?.slug || null,
      image: p.images[0]?.url || null,
      images: undefined,
    }));

    return NextResponse.json(
      {
        products: formatted,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
