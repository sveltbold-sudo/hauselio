import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { handleApiError, validateCsrfOrigin, validateContentType } from "@/lib/api-helpers";
import { checkRateLimit } from "@/lib/rate-limit";

const ReviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(200).optional().nullable(),
  content: z.string().max(5000).optional().nullable(),
  authorName: z.string().min(1, "Name ist erforderlich").max(100),
  authorEmail: z.string().email("Ungültige E-Mail-Adresse").max(254),
});

export async function POST(request: NextRequest) {
  try {
    const ctError = validateContentType(request, "application/json");
    if (ctError) return ctError;

    if (!validateCsrfOrigin(request)) {
      return NextResponse.json(
        { error: "CSRF-Schutz: Ungültige Herkunft" },
        { status: 403 }
      );
    }

    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (!await checkRateLimit(`review:${ip}`, 5, 60 * 1000)) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = ReviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { productId, rating, title, content, authorName, authorEmail } = parsed.data;

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json(
        { error: "Produkt nicht gefunden" },
        { status: 404 }
      );
    }

    const existing = await prisma.review.findFirst({
      where: { productId, authorEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Sie haben bereits eine Bewertung für dieses Produkt abgegeben." },
        { status: 409 }
      );
    }

    const review = await prisma.review.create({
      data: {
        rating,
        title: title || null,
        content: content || null,
        authorName,
        authorEmail,
        isApproved: false,
        productId,
      },
    });

    const stats = await prisma.review.aggregate({
      where: { productId, isApproved: true },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: stats._avg.rating || 0,
        reviewCount: stats._count.rating,
      },
    });

    return NextResponse.json({
      review: {
        id: review.id,
        rating: review.rating,
        title: review.title,
        content: review.content,
        authorName: review.authorName,
        createdAt: review.createdAt,
      },
      message: "Ihre Bewertung wurde eingereicht und wird nach Prüfung veröffentlicht.",
    }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (!await checkRateLimit(`reviews:${ip}`, 30, 60_000)) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10) || 20));
    const skip = (page - 1) * limit;

    if (!productId) {
      return NextResponse.json(
        { error: "Produkt-ID ist erforderlich" },
        { status: 400 }
      );
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { productId, isApproved: true },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          rating: true,
          title: true,
          content: true,
          authorName: true,
          createdAt: true,
        },
        skip,
        take: limit,
      }),
      prisma.review.count({
        where: { productId, isApproved: true },
      }),
    ]);

    return NextResponse.json({
      reviews,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
