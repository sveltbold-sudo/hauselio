import { prisma } from "./prisma";
import { getAlgoliaAdminClient, PRODUCTS_INDEX } from "./algolia";
import { logger } from "./logger";

type ProductWithRelations = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: import("@prisma/client").Prisma.Decimal;
  originalPrice: import("@prisma/client").Prisma.Decimal | null;
  rating: import("@prisma/client").Prisma.Decimal;
  reviewCount: number;
  isNew: boolean;
  isPromo: boolean;
  category: { name: string; slug: string } | null;
  brand: { name: string } | null;
  images: { url: string }[];
};

interface ProductRecord extends Record<string, unknown> {
  objectID: string;
  name: string;
  slug: string;
  price: number;
  originalPrice: number | null;
  brand: string | null;
  categoryName: string;
  categorySlug: string;
  image: string;
  rating: number;
  reviewCount: number;
  isNew: boolean;
  isPromo: boolean;
  description: string;
}

function formatProduct(product: ProductWithRelations): ProductRecord {
  return {
    objectID: product.id,
    name: product.name,
    slug: product.slug,
    price: Number(product.price),
    originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
    brand: product.brand?.name || null,
    categoryName: product.category?.name || "",
    categorySlug: product.category?.slug || "",
    image: product.images?.[0]?.url || "",
    rating: Number(product.rating),
    reviewCount: product.reviewCount,
    isNew: product.isNew,
    isPromo: product.isPromo,
    description: product.description,
  };
}

export async function syncProductsToAlgolia(): Promise<{ indexed: number; errors: number }> {
  const BATCH_SIZE = 500;
  let cursor: string | undefined;
  let totalIndexed = 0;
  let totalErrors = 0;

  do {
    const products = await prisma.product.findMany({
      take: BATCH_SIZE,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        price: true,
        originalPrice: true,
        rating: true,
        reviewCount: true,
        isNew: true,
        isPromo: true,
        category: { select: { name: true, slug: true } },
        brand: { select: { name: true } },
        images: { take: 1, orderBy: { position: "asc" }, select: { url: true } },
      },
      orderBy: { id: "asc" },
    });

    if (products.length === 0) break;

    const records: ProductRecord[] = products.map(formatProduct);

    try {
      await getAlgoliaAdminClient().saveObjects({
        indexName: PRODUCTS_INDEX,
        objects: records,
      });
      totalIndexed += records.length;
    } catch (error) {
      logger.error("algolia-batch", error);
      totalErrors += records.length;
    }

    cursor = products[products.length - 1]!.id;
  } while (cursor);

  return { indexed: totalIndexed, errors: totalErrors };
}

export async function deleteProductFromAlgolia(productId: string): Promise<void> {
  try {
    await getAlgoliaAdminClient().deleteObject({
      indexName: PRODUCTS_INDEX,
      objectID: productId,
    });
  } catch (error) {
    logger.error("algolia-delete", error);
  }
}

export async function updateProductInAlgolia(productId: string): Promise<void> {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        price: true,
        originalPrice: true,
        rating: true,
        reviewCount: true,
        isNew: true,
        isPromo: true,
        category: { select: { name: true, slug: true } },
        brand: { select: { name: true } },
        images: { take: 1, orderBy: { position: "asc" }, select: { url: true } },
      },
    });

    if (!product) return;

    const record = formatProduct(product);

    await getAlgoliaAdminClient().saveObject({
      indexName: PRODUCTS_INDEX,
      body: record,
    });
  } catch (error) {
    logger.error("algolia-update", error);
  }
}
