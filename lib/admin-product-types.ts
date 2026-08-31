export interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  shortDesc: string;
  price: string;
  originalPrice: string;
  categoryId: string;
  brandId: string;
  inStock: boolean;
  stockQuantity: string;
  isNew: boolean;
  isFeatured: boolean;
  weight: string;
  imageUrl: string;
  features: string[];
  newFeature: string;
  specs: { key: string; value: string }[];
  newSpecKey: string;
  newSpecValue: string;
  seoTitle: string;
  seoDesc: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Brand {
  id: string;
  name: string;
}

export const emptyFormData: ProductFormData = {
  name: "",
  slug: "",
  description: "",
  shortDesc: "",
  price: "",
  originalPrice: "",
  categoryId: "",
  brandId: "",
  inStock: true,
  stockQuantity: "",
  isNew: false,
  isFeatured: false,
  weight: "",
  imageUrl: "",
  features: [],
  newFeature: "",
  specs: [],
  newSpecKey: "",
  newSpecValue: "",
  seoTitle: "",
  seoDesc: "",
};
