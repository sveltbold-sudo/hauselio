import { prisma } from "./prisma";
import { getAlgoliaAdminClient, PRODUCTS_INDEX } from "./algolia";
import { logger } from "./logger";

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
  inStock: boolean;
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
      include: {
        category: true,
        brand: true,
        images: { take: 1, orderBy: { position: "asc" } },
      },
      orderBy: { id: "asc" },
    });

    if (products.length === 0) break;

    const records: ProductRecord[] = products.map((product) => ({
      objectID: product.id,
      name: product.name,
      slug: product.slug,
      price: Number(product.price),
      originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
      brand: product.brand?.name || null,
      categoryName: product.category?.name || "",
      categorySlug: product.category?.slug || "",
      image: product.images[0]?.url || "",
      rating: Number(product.rating),
      reviewCount: product.reviewCount,
      isNew: product.isNew,
      isPromo: product.isPromo,
      description: product.description,
      inStock: product.inStock,
    }));

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

    cursor = products[products.length - 1].id;
  } while (cursor);

  return { indexed: totalIndexed, errors: totalErrors };
}

export async function deleteProductFromAlgolia(productId: string): Promise<void> {
  await getAlgoliaAdminClient().deleteObject({
    indexName: PRODUCTS_INDEX,
    objectID: productId,
  });
}

export async function updateProductInAlgolia(productId: string): Promise<void> {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      category: true,
      brand: true,
      images: { take: 1, orderBy: { position: "asc" } },
    },
  });

  if (!product) return;

  const record: ProductRecord = {
    objectID: product.id,
    name: product.name,
    slug: product.slug,
    price: Number(product.price),
    originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
    brand: product.brand?.name || null,
    categoryName: product.category?.name || "",
    categorySlug: product.category?.slug || "",
    image: product.images[0]?.url || "",
    rating: Number(product.rating),
    reviewCount: product.reviewCount,
    isNew: product.isNew,
    isPromo: product.isPromo,
    description: product.description,
    inStock: product.inStock,
  };

  await getAlgoliaAdminClient().saveObject({
    indexName: PRODUCTS_INDEX,
    body: record,
  });
}
