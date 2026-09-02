import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/constants";

const STATIC_BUILD_DATE = new Date("2026-09-02T00:00:00Z");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: STATIC_BUILD_DATE, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE_URL}/shop`, lastModified: STATIC_BUILD_DATE, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/kategorie`, lastModified: STATIC_BUILD_DATE, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/kontakt`, lastModified: STATIC_BUILD_DATE, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/garantie`, lastModified: STATIC_BUILD_DATE, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/ueber-uns`, lastModified: STATIC_BUILD_DATE, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/agb`, lastModified: STATIC_BUILD_DATE, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/datenschutz`, lastModified: STATIC_BUILD_DATE, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/impressum`, lastModified: STATIC_BUILD_DATE, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/widerruf`, lastModified: STATIC_BUILD_DATE, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/barrierefreiheit`, lastModified: STATIC_BUILD_DATE, changeFrequency: "yearly", priority: 0.3 },
  ];

  let categoryPages: MetadataRoute.Sitemap = [];
  let productPages: MetadataRoute.Sitemap = [];

  try {
    const categories = await prisma.category.findMany({ select: { slug: true, updatedAt: true } });
    categoryPages = categories.map((cat) => ({
      url: `${SITE_URL}/kategorie/${cat.slug}`,
      lastModified: cat.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    const products = await prisma.product.findMany({
      select: { slug: true, updatedAt: true },
    });
    productPages = products.map((p) => ({
      url: `${SITE_URL}/produkt/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    // DB not available, return static pages only
  }

  return [...staticPages, ...categoryPages, ...productPages];
}
