export interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number | null;
  image: string;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isPromo?: boolean;
  brand?: string | null;
  categorySlug?: string | null;
}

export interface ProductSpec {
  key: string;
  value: string;
}

export interface ProductDetail {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice: number | null;
  isPromo: boolean;
  rating: number;
  liveRating: number;
  reviewCount: number;
  isNew: boolean;
  brand: string | null;
  brandSlug: string | null;
  categoryName: string;
  categorySlug: string;
  specs: ProductSpec[];
  images: string[];
  stockQuantity: number | null;
}

export interface BundleProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  brand: string | null;
}

export interface DealProduct {
  name: string;
  slug: string;
  brand: string;
  price: number;
  originalPrice: number;
  image: string;
  tagline: string;
  rating?: number;
  reviewCount?: number;
}

export interface SimilarProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number | null;
  isPromo?: boolean;
  image: string;
  brand: string;
  rating: number;
  reviewCount: number;
}

export interface CategoryBrand {
  name: string;
  slug: string;
  count: number;
}
