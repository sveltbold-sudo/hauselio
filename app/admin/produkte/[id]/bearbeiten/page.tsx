"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { useToast } from "@/components/ui/Toast";

export const dynamic = "force-dynamic";

interface Category {
  id: string;
  name: string;
}

interface Brand {
  id: string;
  name: string;
}

interface ProductSpec {
  key: string;
  value: string;
}

interface ProductImage {
  url: string;
  position: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDesc: string | null;
  price: number;
  originalPrice: number | null;
  categoryId: string;
  brandId: string | null;
  inStock: boolean;
  isNew: boolean;
  isFeatured: boolean;
  weight: number | null;
  features: string[];
  seoTitle: string | null;
  seoDesc: string | null;
  specs: ProductSpec[];
  images: ProductImage[];
}

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const toast = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [initialData, setInitialData] = useState<
    Record<string, unknown> | null
  >(null);

  useEffect(() => {
    async function load() {
      try {
        const [idResolved, catsData, brsData] = await Promise.all([
          params,
          fetch("/api/admin/kategorien").then((r) => r.json()),
          fetch("/api/admin/marken").then((r) => r.json()),
        ]);

        setCategories(catsData.categories || []);
        setBrands(brsData.brands || []);

        const res = await fetch(`/api/admin/produkte/${idResolved.id}`);
        if (!res.ok) throw new Error("Produkt nicht gefunden");

        const data = await res.json();
        const p: Product = data.product;

        setInitialData({
          name: p.name,
          slug: p.slug,
          description: p.description,
          shortDesc: p.shortDesc || "",
          price: String(p.price),
          originalPrice: p.originalPrice ? String(p.originalPrice) : "",
          categoryId: p.categoryId,
          brandId: p.brandId || "",
          inStock: p.inStock,
          isNew: p.isNew,
          isFeatured: p.isFeatured,
          weight: p.weight ? String(p.weight) : "",
          imageUrl: p.images[0]?.url || "",
          features: p.features || [],
          specs: p.specs || [],
          seoTitle: p.seoTitle || "",
          seoDesc: p.seoDesc || "",
        });
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Fehler beim Laden"
        );
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [params, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]" />
      </div>
    );
  }

  const handleSubmit = async (data: {
    name: string;
    slug: string;
    description: string;
    shortDesc: string;
    price: string;
    originalPrice: string;
    categoryId: string;
    brandId: string;
    inStock: boolean;
    isNew: boolean;
    isFeatured: boolean;
    weight: string;
    imageUrl: string;
    features: string[];
    specs: { key: string; value: string }[];
    seoTitle: string;
    seoDesc: string;
  }) => {
    setIsSaving(true);
    try {
      const idResolved = await params;
      const res = await fetch(`/api/admin/produkte/${idResolved.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
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
          inStock: data.inStock,
          isNew: data.isNew,
          isFeatured: data.isFeatured,
          weight: data.weight
            ? Number(data.weight) || undefined
            : undefined,
          features: data.features,
          specs: data.specs,
          imageUrl: data.imageUrl || undefined,
          seoTitle: data.seoTitle || undefined,
          seoDesc: data.seoDesc || undefined,
        }),
      });

      if (!res.ok) {
        const resData = await res.json();
        throw new Error(resData.error || "Fehler beim Speichern");
      }

      toast.success("Produkt erfolgreich aktualisiert!");
      router.push("/admin/produkte");
      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Ein Fehler ist aufgetreten"
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ProductForm
      title="Produkt bearbeiten"
      submitLabel="Änderungen speichern"
      loadingLabel="Wird gespeichert..."
      backHref="/admin/produkte"
      categories={categories}
      brands={brands}
      initialData={initialData || undefined}
      isLoading={isSaving}
      onSubmit={handleSubmit}
    />
  );
}
