import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ProductPageClient from "@/components/product/ProductPageClient";
import ProductJsonLd from "@/components/seo/ProductJsonLd";

export const revalidate = 300;

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    select: { slug: true },
    where: { inStock: true },
  });
  return products.map((p) => ({ slug: p.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    select: {
      name: true,
      description: true,
      price: true,
      images: { take: 1, orderBy: { position: "asc" } },
    },
  });

  if (!product) {
    return { title: "Produkt nicht gefunden" };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hauselio.de";
  const priceStr = Number(product.price).toFixed(2).replace(".", ",");
  const desc = product.description
    ? product.description.slice(0, 150).trim() + "..."
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
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      brand: true,
      images: { orderBy: { position: "asc" } },
      specs: { orderBy: { position: "asc" } },
    },
  });

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

  return (
    <>
      <ProductJsonLd
        name={product.name}
        description={product.description}
        image={product.images[0]?.url || "/images/placeholder.jpg"}
        price={Number(product.price)}
        brand={product.brand?.name || "HAUSELIO"}
        sku={product.sku || product.slug}
        rating={Number(product.rating)}
        reviewCount={product.reviewCount}
        availability={product.inStock ? "InStock" : "OutOfStock"}
      />
      <div>
        <ProductPageClient product={formattedProduct} />
      </div>
    </>
  );
}
