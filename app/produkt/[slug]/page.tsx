import { notFound } from "next/navigation";
import { cache } from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ProductPageClient from "@/components/product/ProductPageClient";
import ProductJsonLd from "@/components/seo/ProductJsonLd";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST, SITE_URL, SITE_NAME } from "@/lib/constants";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import CustomerReviewsSection from "@/components/product/CustomerReviewsSection";
import PressReviewsSection from "@/components/product/PressReviewsSection";
import TestimonialsSection from "@/components/product/TestimonialsSection";
import { getArticlesByCategory } from "@/lib/ratgeber";
import { logger } from "@/lib/logger";

export const revalidate = 300;

interface PageProps {
  params: Promise<{ slug: string }>;
}

const getProductFromDb = cache(async function getProductFromDb(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      select: {
        id: true, name: true, slug: true, sku: true, barcode: true,
        description: true, longDescription: true, price: true, originalPrice: true,
        isPromo: true, isNew: true, rating: true, reviewCount: true, stockQuantity: true,
        category: { select: { name: true, slug: true } },
        brand: { select: { name: true, slug: true } },
        images: { orderBy: { position: "asc" as const }, select: { url: true } },
        specs: { orderBy: { position: "asc" as const }, select: { key: true, value: true } },
        reviews: {
          where: { isApproved: true },
          select: { authorName: true, rating: true, title: true, content: true, createdAt: true },
          orderBy: { createdAt: "desc" as const },
          take: 10,
        },
      },
    });

    if (!product) return null;

    const [realReviewCount, liveAggregate, relatedProducts] = await Promise.all([
      prisma.review.count({
        where: { productId: product.id, isApproved: true },
      }),
      prisma.review.aggregate({
        where: { productId: product.id, isApproved: true },
        _avg: { rating: true },
      }),
      prisma.product.findMany({
        where: product.category?.slug ? { category: { slug: product.category.slug }, id: { not: product.id } } : { id: { not: product.id } },
        select: {
          id: true, name: true, slug: true, price: true, originalPrice: true,
          rating: true, reviewCount: true, isNew: true, isPromo: true,
          brand: { select: { name: true } },
          images: { select: { url: true }, take: 1, orderBy: { position: "asc" as const } },
        },
        take: 3,
        orderBy: { rating: "desc" },
      }),
    ]);

    const liveRating = realReviewCount > 0 ? Number(liveAggregate._avg.rating ?? product.rating) : 0;

    return {
      product: {
        ...product,
        reviewCount: realReviewCount,
        liveRating,
        price: Number(product.price),
        originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
        rating: Number(product.rating),
        images: product.images.map((img) => img.url),
        reviews: product.reviews.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })),
      },
      relatedProducts: relatedProducts.map((p) => ({
        id: p.id, name: p.name, slug: p.slug, price: Number(p.price),
        originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
        rating: Number(p.rating), reviewCount: p.reviewCount,
        isNew: p.isNew, isPromo: p.isPromo,
        image: p.images[0]?.url || "/images/placeholder-product.svg",
        brand: p.brand?.name || null,
      })),
    };
  } catch (error) {
    logger.error("produkt-slug-db", error);
    throw error;
  }
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProductFromDb(slug);

  if (!data?.product) {
    return {
      title: "Produkt nicht gefunden",
      description: "Das gesuchte Produkt existiert leider nicht oder wurde aus unserem Sortiment entfernt.",
      robots: { index: false },
    };
  }

  const product = data.product;
  const priceStr = Number(product.price).toFixed(2).replace(".", ",");
  const brandName = product.brand?.name || "";
  const catName = product.category?.name || "";
  const desc = product.description
    ? product.description.slice(0, 155).replace(/\s+\S*$/, "") + "\u2026"
    : `Jetzt ${product.name} bei ${SITE_NAME} kaufen. Ab ${priceStr} \u20AC.`;
  const titleSuffix = brandName ? ` — ${brandName}` : "";

  return {
    title: `${product.name}${titleSuffix}`,
    description: desc,
    alternates: {
      canonical: `${SITE_URL}/produkt/${slug}`,
    },
    openGraph: {
      title: `${product.name} kaufen | ${SITE_NAME}`,
      description: desc,
      url: `${SITE_URL}/produkt/${slug}`,
      siteName: SITE_NAME,
      locale: "de_DE",
      type: "website",
      images: product.images?.[0]
        ? [{ url: product.images[0], width: 800, height: 600, alt: product.name }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} kaufen | ${SITE_NAME}`,
      description: desc,
      images: product.images?.[0] ? [product.images[0]] : undefined,
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getProductFromDb(slug);

  if (!data?.product) {
    notFound();
  }

  const product = data.product;
  const relatedProducts = data.relatedProducts || [];

  let ratgeberArticles: Awaited<ReturnType<typeof getArticlesByCategory>> = [];
  try {
    ratgeberArticles = product.category?.slug
      ? await getArticlesByCategory(product.category.slug, 3)
      : [];
  } catch (e) {
    logger.error("produkt-ratgeber", e);
  }

  let sellerName = `${SITE_NAME} GmbH`;
  try {
    const settings = await prisma.siteSettings.findFirst();
    if (settings?.companyName) sellerName = settings.companyName;
  } catch (e) { logger.error("site-settings", e); }

  const formattedProduct = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    longDescription: product.longDescription || undefined,
    price: Number(product.price),
    originalPrice: product.originalPrice
      ? Number(product.originalPrice)
      : null,
    isPromo: product.isPromo,
    rating: Number(product.rating),
    liveRating: product.liveRating,
    reviewCount: product.reviewCount,
    isNew: product.isNew,
    brand: product.brand?.name || null,
    brandSlug: product.brand?.slug || null,
    categoryName: product.category?.name || "",
    categorySlug: product.category?.slug || "",
    specs: product.specs || [],
    images: product.images || [],
    stockQuantity: product.stockQuantity ?? null,
  };

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Startseite", url: SITE_URL },
          { name: "Kategorien", url: "/kategorie" },
          { name: product.category?.name || "Shop", url: `/kategorie/${product.category?.slug || ""}` },
          { name: product.name, url: `/produkt/${product.slug}` },
        ]}
      />
      <ProductJsonLd
        name={product.name}
        description={product.description}
        image={product.images?.[0] || "/images/placeholder-product.svg"}
        price={Number(product.price)}
        brand={product.brand?.name || SITE_NAME}
        slug={product.slug}
        category={product.category?.name || undefined}
        sku={product.sku || undefined}
        gtin={product.barcode || undefined}
        rating={product.liveRating || Number(product.rating)}
        reviewCount={product.reviewCount}
        shippingRate={Number(product.price) >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST}
        specs={(product.specs || []).map((s: { key: string; value: string }) => ({ key: s.key, value: s.value }))}
        reviews={(product.reviews || []).map((r: { authorName: string; rating: number; title: string | null; content: string | null; createdAt: string }) => ({
          author: r.authorName,
          rating: r.rating,
          title: r.title ?? undefined,
          content: r.content ?? undefined,
          date: r.createdAt.split("T")[0] as string,
        }))}
        availability={product.stockQuantity == null || product.stockQuantity > 0 ? "InStock" : "OutOfStock"}
        sellerName={sellerName}
      />
      <main id="main-content">
        <ProductPageClient product={formattedProduct} relatedProducts={relatedProducts} ratgeberArticles={ratgeberArticles} />
        <CustomerReviewsSection productId={product.id} />
        <PressReviewsSection />
        <TestimonialsSection />
      </main>
    </>
  );
}
