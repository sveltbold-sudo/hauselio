import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://hauselio.de";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.category.findMany({
      select: { slug: true, updatedAt: true },
    }),
  ]);

  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${BASE_URL}/shop`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${BASE_URL}/versand`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.3 },
    { url: `${BASE_URL}/kontakt`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${BASE_URL}/ueber-uns`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${BASE_URL}/impressum`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.2 },
    { url: `${BASE_URL}/datenschutz`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.2 },
    { url: `${BASE_URL}/agb`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.2 },
    { url: `${BASE_URL}/widerruf`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.2 },
  ];

  const categoryPages = categories.map((cat) => ({
    url: `${BASE_URL}/kategorie/${cat.slug}`,
    lastModified: cat.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const productPages = products.map((product) => ({
    url: `${BASE_URL}/produkt/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}
