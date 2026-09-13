import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromRequest } from "@/lib/auth";
import { validateContentType } from "@/lib/api-helpers";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import { z } from "zod";

const CreateArticleSchema = z.object({
  title: z.string().min(3).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  excerpt: z.string().max(500).optional().nullable(),
  content: z.string().min(10),
  coverImage: z.string().max(500).optional().nullable(),
  authorName: z.string().max(100).optional().nullable(),
  category: z.string().min(1).max(50),
  tags: z.array(z.string().max(50)).max(20).optional().default([]),
  seoTitle: z.string().max(200).optional().nullable(),
  seoDesc: z.string().max(500).optional().nullable(),
  isPublished: z.boolean().optional().default(false),
  readingTime: z.number().int().min(1).max(120).optional().nullable(),
});

export async function POST(request: NextRequest) {
  const admin = await getAdminFromRequest();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const contentTypeError = validateContentType(request, "application/json");
  if (contentTypeError) return contentTypeError;

  const ip = getClientIp(request);
  if (!await checkRateLimit(`ratgeber-create:${ip}`, 20, 60_000)) {
    return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429 });
  }

  const parsed = CreateArticleSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]!.message }, { status: 400 });
  }
  const body = parsed.data;

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
