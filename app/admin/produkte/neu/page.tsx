"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductForm, { type ProductFormProps } from "@/components/admin/ProductForm";
import { useToast } from "@/components/ui/Toast";
import { serializeProductBody } from "@/lib/admin-product-helpers";
import type { AdminCategory, AdminBrand } from "@/lib/admin-types";
import type { AdminCategory, AdminBrand } from "@/lib/admin-types";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export default function NewProductPage() {
  const router = useRouter();
  const toast = useToast();
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [brands, setBrands] = useState<AdminBrand[]>([]);
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
      .catch((err) => {
        logger.error("Failed to load data", { error: err });
        toast.error("Kategorien oder Marken konnten nicht geladen werden.");
      });
  }, []);

  const handleSubmit = async (
    data: Parameters<ProductFormProps["onSubmit"]>[0]
  ) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/produkte", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serializeProductBody(data)),
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
