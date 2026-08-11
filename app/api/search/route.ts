import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { handleApiError } from "@/lib/api-helpers";

const algoliaAvailable = !!(
  process.env.ALGOLIA_APP_ID && process.env.ALGOLIA_SEARCH_API_KEY
);

export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const allowed = await checkRateLimit(`search:${ip}`, 30, 60_000);
  if (!allowed) {
    return NextResponse.json(
      { error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const rawLimit = parseInt(searchParams.get("limit") || "10", 10);
  const limit = Number.isFinite(rawLimit)
    ? Math.min(50, Math.max(1, rawLimit))
    : 10;

  if (!query || query.trim().length === 0) {
    return NextResponse.json({ hits: [], nbHits: 0 });
  }

  if (algoliaAvailable) {
    try {
      const { algoliaClient, PRODUCTS_INDEX } = await import("@/lib/algolia");
      const result = await algoliaClient.search({
        requests: [
          {
            indexName: PRODUCTS_INDEX,
            query: query.trim(),
            hitsPerPage: limit,
            attributesToRetrieve: [
              "objectID",
              "name",
              "slug",
              "price",
              "originalPrice",
              "brand",
              "categoryName",
              "image",
              "rating",
              "reviewCount",
              "isNew",
              "isPromo",
            ],
            attributesToHighlight: ["name"],
          },
        ],
      });

      const result0 = result.results[0] as { hits: unknown[]; nbHits: number };

      return NextResponse.json({
        hits: result0.hits,
        nbHits: result0.nbHits,
      });
    } catch (error) {
      console.error("Algolia search error, falling back to Prisma:", error);
    }
  }

  try {
    const searchQuery = query.trim();

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: searchQuery, mode: "insensitive" } },
            { description: { contains: searchQuery, mode: "insensitive" } },
            { brand: { name: { contains: searchQuery, mode: "insensitive" } } },
          ],
          inStock: true,
        },
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
          category: { select: { name: true } },
          images: { take: 1, orderBy: { position: "asc" }, select: { url: true } },
        },
        take: limit,
        orderBy: { rating: "desc" },
      }),
      prisma.product.count({
        where: {
          OR: [
            { name: { contains: searchQuery, mode: "insensitive" } },
            { description: { contains: searchQuery, mode: "insensitive" } },
            { brand: { name: { contains: searchQuery, mode: "insensitive" } } },
          ],
          inStock: true,
        },
      }),
    ]);

    const hits = products.map((p) => ({
      objectID: p.id,
      name: p.name,
      slug: p.slug,
      price: Number(p.price),
      originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
      brand: p.brand?.name || null,
      categoryName: p.category?.name || "",
      image: p.images[0]?.url || "",
      rating: Number(p.rating),
      reviewCount: p.reviewCount,
      isNew: p.isNew,
      isPromo: p.isPromo,
    }));

    return NextResponse.json({ hits, nbHits: total });
  } catch (error) {
    return handleApiError(error);
  }
}
