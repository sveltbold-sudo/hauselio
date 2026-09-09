import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/constants";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const fixedDate = new Date("2026-09-01");

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: fixedDate, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE_URL}/shop`, lastModified: fixedDate, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/angebote`, lastModified: fixedDate, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/kategorie`, lastModified: fixedDate, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/hilfe`, lastModified: fixedDate, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/kontakt`, lastModified: fixedDate, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/garantie`, lastModified: fixedDate, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/ueber-uns`, lastModified: fixedDate, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/barrierefreiheit`, lastModified: fixedDate, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/impressum`, lastModified: fixedDate, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/datenschutz`, lastModified: fixedDate, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/agb`, lastModified: fixedDate, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/widerruf`, lastModified: fixedDate, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/versand`, lastModified: fixedDate, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/zahlungsarten`, lastModified: fixedDate, changeFrequency: "monthly", priority: 0.4 },
  ];

  const [categories, products, ratgeberArticles] = await Promise.all([
    prisma.category.findMany({ select: { slug: true } }),
    prisma.product.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.ratgeberArticle.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${SITE_URL}/kategorie/${cat.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/produkt/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const ratgeberPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/ratgeber`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.7 },
    ...ratgeberArticles.map((a) => ({
      url: `${SITE_URL}/ratgeber/${a.slug}`,
      lastModified: a.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];

  return [...staticPages, ...categoryPages, ...productPages, ...ratgeberPages];
}
