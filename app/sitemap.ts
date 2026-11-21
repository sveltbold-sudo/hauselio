import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/constants";
import { OG_IMAGE_URL } from "@/lib/seo";

export const revalidate = 3600;

// Date of the last editorial change to static pages (legal texts, help, about).
const CONTENT_UPDATED = new Date("2026-11-20");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products, ratgeberArticles, brands, latestProduct] = await Promise.all([
    prisma.category.findMany({
      select: {
        slug: true,
        products: {
          select: {
            slug: true,
            updatedAt: true,
            images: { select: { url: true }, take: 1, orderBy: { position: "asc" as const } },
          },
          take: 1,
          orderBy: { updatedAt: "desc" as const },
        },
      },
    }),
    prisma.product.findMany({
      select: {
        slug: true,
        updatedAt: true,
        images: { select: { url: true }, take: 1, orderBy: { position: "asc" as const } },
      },
    }),
    prisma.ratgeberArticle.findMany({
      where: { isPublished: true },
      select: {
        slug: true,
        updatedAt: true,
        coverImage: true,
      },
    }),
    prisma.brand.findMany({
      where: { products: { some: {} } },
      select: {
        slug: true,
        _count: { select: { products: true } },
        products: { select: { updatedAt: true }, take: 1, orderBy: { updatedAt: "desc" as const } },
      },
    }),
    prisma.product.findFirst({ select: { updatedAt: true }, orderBy: { updatedAt: "desc" } }),
  ]);

  const catalogUpdated = latestProduct?.updatedAt ?? CONTENT_UPDATED;

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: catalogUpdated,
      changeFrequency: "daily",
      priority: 1.0,
      images: [OG_IMAGE_URL],
    },
    { url: `${SITE_URL}/shop`, lastModified: catalogUpdated, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/angebote`, lastModified: catalogUpdated, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/kategorie`, lastModified: catalogUpdated, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/marken`, lastModified: catalogUpdated, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/thermomix`, lastModified: CONTENT_UPDATED, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/hilfe`, lastModified: CONTENT_UPDATED, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/kontakt`, lastModified: CONTENT_UPDATED, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/garantie`, lastModified: CONTENT_UPDATED, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/ueber-uns`, lastModified: CONTENT_UPDATED, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/barrierefreiheit`, lastModified: CONTENT_UPDATED, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/impressum`, lastModified: CONTENT_UPDATED, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/datenschutz`, lastModified: CONTENT_UPDATED, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/agb`, lastModified: CONTENT_UPDATED, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/widerruf`, lastModified: CONTENT_UPDATED, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/versand`, lastModified: CONTENT_UPDATED, changeFrequency: "monthly", priority: 0.4 },
  ];

  const toAbsoluteImage = (url: string) =>
    url.startsWith("http") ? url : `${SITE_URL}${url.startsWith("/") ? "" : "/"}${url}`;

  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${SITE_URL}/kategorie/${cat.slug}`,
    lastModified: cat.products[0]?.updatedAt ?? CONTENT_UPDATED,
    changeFrequency: "weekly" as const,
    priority: 0.7,
    images: cat.products[0]?.images[0]?.url
      ? [toAbsoluteImage(cat.products[0].images[0].url)]
      : undefined,
  }));

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/produkt/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
    images: p.images[0]?.url ? [toAbsoluteImage(p.images[0].url)] : undefined,
  }));

  const ratgeberPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/ratgeber`, lastModified: catalogUpdated, changeFrequency: "weekly" as const, priority: 0.7 },
    ...ratgeberArticles.map((a) => ({
      url: `${SITE_URL}/ratgeber/${a.slug}`,
      lastModified: a.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      images: a.coverImage ? [toAbsoluteImage(a.coverImage)] : undefined,
    })),
  ];

  // Brand pages exist for every brand with at least two products (see
  // app/marken/[slug]). Single-product brands stay reachable through the shop.
  const brandPages: MetadataRoute.Sitemap = brands
    .filter((b) => b._count.products >= 2)
    .map((b) => ({
      url: `${SITE_URL}/marken/${b.slug}`,
      lastModified: b.products[0]?.updatedAt ?? catalogUpdated,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

  return [
    ...staticPages,
    ...categoryPages,
    ...productPages,
    ...brandPages,
    ...ratgeberPages,
  ];
}
