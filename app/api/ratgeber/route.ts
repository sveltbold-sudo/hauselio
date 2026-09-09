import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromRequest } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  const admin = await getAdminFromRequest();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  try {
    const article = await prisma.ratgeberArticle.create({
      data: {
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt || null,
        content: body.content,
        coverImage: body.coverImage || null,
        authorName: body.authorName || "HAUSAURA Redaktion",
        category: body.category,
        tags: body.tags || [],
        seoTitle: body.seoTitle || null,
        seoDesc: body.seoDesc || null,
        isPublished: body.isPublished ?? false,
        publishedAt: body.isPublished ? new Date() : null,
        readingTime: body.readingTime || null,
      },
    });
    return NextResponse.json({ success: true, article });
  } catch (e) {
    logger.error("api-ratgeber-create", e);
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}
