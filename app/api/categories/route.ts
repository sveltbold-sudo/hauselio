import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api-helpers";
import { checkRateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (!await checkRateLimit(`categories:${ip}`, 60, 60_000)) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        _count: { select: { products: true } },
      },
    });

    return NextResponse.json(
      {
        categories: categories.map((cat) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          image: cat.image,
          productCount: cat._count.products,
        })),
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600",
        },
      }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
