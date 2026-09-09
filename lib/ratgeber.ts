import { prisma } from "@/lib/prisma";
import type { RatgeberArticle as PrismaRatgeberArticle } from "@prisma/client";

export type RatgeberArticle = PrismaRatgeberArticle;

export interface RatgeberArticleListItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  authorName: string;
  category: string;
  tags: string[];
  readingTime: number | null;
  publishedAt: Date | null;
  createdAt: Date;
}

export interface RatgeberArticleDetail extends RatgeberArticleListItem {
  content: string;
  seoTitle: string | null;
  seoDesc: string | null;
  viewCount: number;
  updatedAt: Date;
}

export const RATGEBER_CATEGORIES = [
  { slug: "alle", name: "Alle Artikel" },
  { slug: "kueche", name: "Küche" },
  { slug: "kaffee", name: "Kaffee" },
  { slug: "reinigung", name: "Reinigung" },
  { slug: "klima", name: "Klima" },
  { slug: "smart-home", name: "Smart Home" },
  { slug: "haushaltsgeraete", name: "Haushaltsgeräte" },
  { slug: "tipps", name: "Tipps & Tricks" },
] as const;

export type RatgeberCategorySlug = (typeof RATGEBER_CATEGORIES)[number]["slug"];

export const RATGEBER_PAGE_SIZE = 9;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[ä]/g, "ae")
    .replace(/[ö]/g, "oe")
    .replace(/[ü]/g, "ue")
    .replace(/[ß]/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function generateArticleSlug(title: string): string {
  return slugify(title);
}

function estimateReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  const words = text.split(" ").length;
  return Math.max(1, Math.ceil(words / 200));
}

export async function getPublishedArticles(
  category?: string,
  page: number = 1,
  pageSize: number = RATGEBER_PAGE_SIZE
): Promise<{ articles: RatgeberArticleListItem[]; total: number }> {
  const where: Record<string, unknown> = { isPublished: true };
  if (category && category !== "alle") {
    where.category = category;
  }

  const [articles, total] = await Promise.all([
    prisma.ratgeberArticle.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        authorName: true,
        category: true,
        tags: true,
        readingTime: true,
        publishedAt: true,
        createdAt: true,
      },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.ratgeberArticle.count({ where }),
  ]);

  return { articles, total };
}

export async function getArticleBySlug(
  slug: string
): Promise<RatgeberArticleDetail | null> {
  const article = await prisma.ratgeberArticle.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      content: true,
      coverImage: true,
      authorName: true,
      category: true,
      tags: true,
      readingTime: true,
      seoTitle: true,
      seoDesc: true,
      viewCount: true,
      publishedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!article) return null;

  // Increment view count
  await prisma.ratgeberArticle.update({
    where: { slug },
    data: { viewCount: { increment: 1 } },
  });

  return article;
}

export async function getRelatedArticles(
  category: string,
  currentSlug: string,
  limit: number = 3
): Promise<RatgeberArticleListItem[]> {
  return prisma.ratgeberArticle.findMany({
    where: {
      isPublished: true,
      category,
      slug: { not: currentSlug },
    },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverImage: true,
      authorName: true,
      category: true,
      tags: true,
      readingTime: true,
      publishedAt: true,
      createdAt: true,
    },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}

export async function getFeaturedArticles(
  limit: number = 3
): Promise<RatgeberArticleListItem[]> {
  return prisma.ratgeberArticle.findMany({
    where: { isPublished: true },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverImage: true,
      authorName: true,
      category: true,
      tags: true,
      readingTime: true,
      publishedAt: true,
      createdAt: true,
    },
    orderBy: { viewCount: "desc" },
    take: limit,
  });
}

export async function getCategoryArticleCounts(): Promise<
  Record<string, number>
> {
  const results = await prisma.ratgeberArticle.groupBy({
    by: ["category"],
    where: { isPublished: true },
    _count: { id: true },
  });

  const counts: Record<string, number> = {};
  for (const r of results) {
    counts[r.category] = r._count.id;
  }
  return counts;
}

export function formatDate(date: Date | null): string {
  if (!date) return "";
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function getReadingTimeText(minutes: number | null): string {
  if (!minutes) return "5 Min. Lesezeit";
  return `${minutes} Min. Lesezeit`;
}
