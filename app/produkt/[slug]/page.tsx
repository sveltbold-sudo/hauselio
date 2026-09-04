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

async function getProductFromApi(slug: string) {
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_SITE_URL || SITE_URL;
    const res = await fetch(`${baseUrl}/api/products/${slug}`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.product ? data : null;
  } catch (error) {
    logger.error("produkt-slug-fetch", error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProductFromApi(slug);

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
  const data = await getProductFromApi(slug);

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
    specs: (product.specs || []).map((s: { key: string; value: string }) => ({ key: s.key, value: s.value })),
    images: (product.images || []).map((url: string) => url),
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
        reviews={(product.reviews || []).map((r: { authorName: string; rating: number; title?: string; content?: string; createdAt: string }) => ({
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
