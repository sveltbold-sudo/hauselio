import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ProductPageClient from "@/components/product/ProductPageClient";
import ProductJsonLd from "@/components/seo/ProductJsonLd";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import CustomerReviewsSection from "@/components/product/CustomerReviewsSection";
import PressReviewsSection from "@/components/product/PressReviewsSection";
import TestimonialsSection from "@/components/product/TestimonialsSection";
import { SITE_URL } from "@/lib/constants";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getProductFromDb(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      select: {
        id: true, name: true, slug: true, sku: true, barcode: true,
        description: true, price: true, originalPrice: true,
        isPromo: true, isNew: true, rating: true, reviewCount: true,
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

    const relatedProducts = await prisma.product.findMany({
      where: { category: { slug: product.category?.slug || "" }, id: { not: product.id } },
      select: {
        id: true, name: true, slug: true, price: true,
        brand: { select: { name: true } },
        images: { select: { url: true }, take: 1, orderBy: { position: "asc" as const } },
      },
      take: 3,
      orderBy: { rating: "desc" },
    });

    return {
      product: {
        ...product,
        price: Number(product.price),
        originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
        rating: Number(product.rating),
        images: product.images.map((img) => img.url),
        reviews: product.reviews.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })),
      },
      relatedProducts: relatedProducts.map((p) => ({
        id: p.id, name: p.name, slug: p.slug, price: Number(p.price),
        image: p.images[0]?.url || "/images/placeholder-product.svg",
        brand: p.brand?.name || null,
      })),
    };
  } catch (error) {
    logger.error("produkt-slug-db", error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProductFromDb(slug);

  if (!data?.product) {
    return { title: "Produkt nicht gefunden" };
  }

  const product = data.product;
  const priceStr = Number(product.price).toFixed(2).replace(".", ",");
  const desc = product.description
    ? product.description.slice(0, 150).trim() + "\u2026"
    : `Jetzt ${product.name} bei HAUSAURA kaufen. Ab ${priceStr} \u20AC.`;

  return {
    title: product.name,
    description: desc,
    alternates: {
      canonical: `${SITE_URL}/produkt/${slug}`,
    },
    openGraph: {
      title: product.name,
      description: desc,
      url: `${SITE_URL}/produkt/${slug}`,
      siteName: "HAUSAURA",
      locale: "de_DE",
      type: "website",
      images: product.images?.[0]
        ? [{ url: product.images[0], width: 800, height: 600, alt: product.name }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
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

  const formattedProduct = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: Number(product.price),
    originalPrice: product.originalPrice
      ? Number(product.originalPrice)
      : null,
    isPromo: product.isPromo,
    rating: Number(product.rating),
    reviewCount: product.reviewCount,
    isNew: product.isNew,
    brand: product.brand?.name || null,
    brandSlug: product.brand?.slug || null,
    categoryName: product.category?.name || "",
    categorySlug: product.category?.slug || "",
    specs: product.specs || [],
    images: product.images || [],
  };

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Startseite", url: "/" },
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
        brand={product.brand?.name || "HAUSAURA"}
        slug={product.slug}
        sku={product.sku || undefined}
        gtin={product.barcode || undefined}
        rating={Number(product.rating)}
        reviewCount={product.reviewCount}
        reviews={(product.reviews || []).map((r: { authorName: string; rating: number; title: string | null; content: string | null; createdAt: string }) => ({
          author: r.authorName,
          rating: r.rating,
          title: r.title ?? undefined,
          content: r.content ?? undefined,
          date: r.createdAt.split("T")[0] as string,
        }))}
        availability="InStock"
      />
      <main id="main-content">
        <ProductPageClient product={formattedProduct} relatedProducts={relatedProducts} />
        <CustomerReviewsSection productId={product.id} />
        <PressReviewsSection />
        <TestimonialsSection />
      </main>
    </>
  );
}
