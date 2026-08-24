import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cache } from "react";
import { prisma } from "@/lib/prisma";
import ProductPageClient from "@/components/product/ProductPageClient";
import ProductJsonLd from "@/components/seo/ProductJsonLd";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { SITE_URL } from "@/lib/constants";
import { logger } from "@/lib/logger";

export const revalidate = 300;

const getProduct = cache(async (slug: string) => {
  try {
    return await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        brand: true,
        images: { orderBy: { position: "asc" } },
        specs: { orderBy: { position: "asc" } },
      },
    });
  } catch (error) {
    logger.error("produkt-slug", error);
    return null;
  }
});

export async function generateStaticParams() {
  try {
    const products = await prisma.product.findMany({
      select: { slug: true },
    });
    return products.map((p) => ({ slug: p.slug }));
  } catch (error) {
    logger.error("Failed to generate static params", error);
    return [];
  }
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return { title: "Produkt nicht gefunden" };
  }

  const baseUrl = SITE_URL;
  const priceStr = Number(product.price).toFixed(2).replace(".", ",");
  const desc = product.description
    ? product.description.slice(0, 150).trim() + "…"
    : `Jetzt ${product.name} bei HAUSELIO kaufen. Ab €${priceStr}.`;

  return {
    title: product.name,
    description: desc,
    alternates: {
      canonical: `${baseUrl}/produkt/${slug}`,
    },
    openGraph: {
      title: product.name,
      description: desc,
      url: `${baseUrl}/produkt/${slug}`,
      siteName: "HAUSELIO",
      locale: "de_DE",
      type: "website",
      images: product.images[0]?.url
        ? [{ url: product.images[0].url, width: 800, height: 600 }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: desc,
      images: product.images[0]?.url ? [product.images[0].url] : undefined,
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;

  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const formattedProduct = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: Number(product.price),
    originalPrice: product.originalPrice
      ? Number(product.originalPrice)
      : null,
    rating: Number(product.rating),
    reviewCount: product.reviewCount,
    isNew: product.isNew,
    inStock: product.inStock,
    brand: product.brand?.name || null,
    categoryName: product.category.name,
    categorySlug: product.category.slug,
    specs: product.specs.map((s) => ({ key: s.key, value: s.value })),
    images: product.images.map((img) => img.url),
  };

  let relatedProducts: { id: string; name: string; slug: string; price: number; image: string; brand: string | null }[] = [];
  try {
    const rawRelated = await prisma.product.findMany({
      where: {
        category: { slug: product.category.slug },
        id: { not: product.id },
      },
      include: {
        brand: { select: { name: true } },
        images: { take: 1, orderBy: { position: "asc" } },
      },
      take: 3,
      orderBy: { rating: "desc" },
    });
    relatedProducts = rawRelated.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: Number(p.price),
      image: p.images[0]?.url || "/images/placeholder-product.svg",
      brand: p.brand?.name || null,
    }));
  } catch (error) {
    logger.error("Failed to fetch related products", error);
    relatedProducts = [];
  }

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Startseite", url: "/" },
          { name: product.category?.name || "Shop", url: `/kategorie/${product.category?.slug || ""}` },
          { name: product.name, url: `/produkt/${product.slug}` },
        ]}
      />
      <ProductJsonLd
        name={product.name}
        description={product.description}
        image={product.images[0]?.url || "/images/placeholder.jpg"}
        price={Number(product.price)}
        brand={product.brand?.name || "HAUSELIO"}
        slug={product.slug}
        sku={product.sku || product.slug}
        rating={Number(product.rating)}
        reviewCount={product.reviewCount}
        availability={product.inStock ? "InStock" : "OutOfStock"}
      />
      <main>
        <ProductPageClient product={formattedProduct} relatedProducts={relatedProducts} />
      </main>
    </>
  );
}
