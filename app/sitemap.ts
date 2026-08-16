import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${SITE_URL}/shop`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${SITE_URL}/versand`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.3 },
    { url: `${SITE_URL}/kontakt`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${SITE_URL}/ueber-uns`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${SITE_URL}/impressum`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.2 },
    { url: `${SITE_URL}/datenschutz`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.2 },
    { url: `${SITE_URL}/agb`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.2 },
    { url: `${SITE_URL}/widerruf`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.2 },
  ];

  try {
    const { prisma } = await import("@/lib/prisma");

    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        select: { slug: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.category.findMany({
        select: { slug: true, updatedAt: true },
      }),
    ]);

    const categoryPages = categories.map((cat) => ({
      url: `${SITE_URL}/kategorie/${cat.slug}`,
      lastModified: cat.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    const productPages = products.map((product) => ({
      url: `${SITE_URL}/produkt/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    return [...staticPages, ...categoryPages, ...productPages];
  } catch {
    return staticPages;
  }
}
