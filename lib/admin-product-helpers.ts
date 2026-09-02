import type { ProductFormData } from "@/lib/admin-product-types";

type FormData = Omit<ProductFormData, "newFeature" | "newSpecKey" | "newSpecValue">;

export function serializeProductBody(data: FormData) {
  return {
    name: data.name,
    slug: data.slug,
    description: data.description,
    shortDesc: data.shortDesc || undefined,
    price: Number(data.price) || 0,
    originalPrice: data.originalPrice
      ? Number(data.originalPrice) || undefined
      : undefined,
    categoryId: data.categoryId,
    brandId: data.brandId || undefined,
    isNew: data.isNew,
    isFeatured: data.isFeatured,
    isPromo: data.isPromo,
    weight: data.weight ? Number(data.weight) || undefined : undefined,
    features: data.features,
    specs: data.specs,
    imageUrl: data.imageUrl || undefined,
    seoTitle: data.seoTitle || undefined,
    seoDesc: data.seoDesc || undefined,
  };
}
