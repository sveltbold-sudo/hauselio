"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductForm, { emptyFormData } from "@/components/admin/ProductForm";
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

export default function NewProductPage() {
  const router = useRouter();
  const toast = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/kategorien").then((r) => {
        if (!r.ok) throw new Error("Fehler beim Laden der Kategorien");
        return r.json();
      }),
      fetch("/api/admin/marken").then((r) => {
        if (!r.ok) throw new Error("Fehler beim Laden der Marken");
        return r.json();
      }),
    ])
      .then(([cats, brs]) => {
        setCategories(cats.categories || []);
        setBrands(brs.brands || []);
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (
    data: Omit<typeof emptyFormData, "newFeature" | "newSpecKey" | "newSpecValue">
  ) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/produkte", {
        method: "POST",
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
        throw new Error(resData.error || "Fehler beim Erstellen");
      }

      router.push("/admin/produkte");
      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Ein Fehler ist aufgetreten"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProductForm
      title="Neues Produkt"
      submitLabel="Produkt erstellen"
      loadingLabel="Wird erstellt..."
      backHref="/admin/produkte"
      categories={categories}
      brands={brands}
      isLoading={isLoading}
      onSubmit={handleSubmit}
    />
  );
}
