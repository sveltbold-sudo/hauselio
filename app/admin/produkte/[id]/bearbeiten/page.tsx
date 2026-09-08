"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { useToast } from "@/components/ui/Toast";
import { serializeProductBody } from "@/lib/admin-product-helpers";
import type { AdminCategory, AdminBrand } from "@/lib/admin-types";

interface ProductSpec {
  key: string;
  value: string;
}

interface ProductImage {
  url: string;
  publicId: string | null;
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
  sku: string | null;
  barcode: string | null;
  categoryId: string;
  brandId: string | null;
  isNew: boolean;
  isFeatured: boolean;
  isPromo: boolean;
  isDailyDeal: boolean;
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
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [brands, setBrands] = useState<AdminBrand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [initialData, setInitialData] = useState<
    Record<string, unknown> | null
  >(null);

  const [loadKey, setLoadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    async function load() {
      setIsLoading(true);
      try {
        const [idResolved, catsRes, brsRes] = await Promise.all([
          params,
          fetch("/api/admin/kategorien", { signal: controller.signal }),
          fetch("/api/admin/marken", { signal: controller.signal }),
        ]);

        const catsData = catsRes.ok ? await catsRes.json() : { categories: [] };
        const brsData = brsRes.ok ? await brsRes.json() : { brands: [] };

        if (!cancelled) {
          setCategories(catsData.categories || []);
          setBrands(brsData.brands || []);
        }

        const res = await fetch(`/api/admin/produkte/${idResolved.id}`, { signal: controller.signal });
        if (!res.ok) throw new Error("Produkt nicht gefunden");

        const data = await res.json();
        const p: Product = data.product;

        if (!cancelled) {
          setInitialData({
            name: p.name,
            slug: p.slug,
            description: p.description,
            shortDesc: p.shortDesc || "",
            price: String(p.price),
            originalPrice: p.originalPrice ? String(p.originalPrice) : "",
            sku: p.sku || "",
            barcode: p.barcode || "",
            categoryId: p.categoryId,
            brandId: p.brandId || "",
            isNew: p.isNew,
            isFeatured: p.isFeatured,
            isPromo: p.isPromo,
            isDailyDeal: p.isDailyDeal,
            weight: p.weight ? String(p.weight) : "",
            imageUrl: p.images[0]?.url || "",
            imagePublicId: p.images[0]?.publicId || "",
            images: p.images.slice(1).map((img, idx) => ({
              url: img.url,
              publicId: img.publicId || "",
              position: idx + 1,
            })),
            features: p.features || [],
            specs: p.specs || [],
            seoTitle: p.seoTitle || "",
            seoDesc: p.seoDesc || "",
          });
        }
      } catch (err) {
        if (!cancelled) {
          toast.error(
            err instanceof Error ? err.message : "Fehler beim Laden"
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    load();
    return () => { cancelled = true; controller.abort(); };
  }, [params, toast, loadKey]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]" />
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="text-center py-20">
        <p className="text-[var(--color-text-muted)] mb-4">Produkt konnte nicht geladen werden.</p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setLoadKey((k) => k + 1)}
            className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
          >
            Erneut versuchen
          </button>
          <a href="/admin/produkte" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2">
            Zurück zur Produktliste
          </a>
        </div>
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
    sku: string;
    barcode: string;
    categoryId: string;
    brandId: string;
    isNew: boolean;
    isFeatured: boolean;
    isPromo: boolean;
    isDailyDeal: boolean;
    weight: string;
    imageUrl: string;
    imagePublicId: string;
    images: { url: string; publicId: string; position: number }[];
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
        body: JSON.stringify(serializeProductBody(data)),
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
      loadingLabel="Wird gespeichert…"
      backHref="/admin/produkte"
      categories={categories}
      brands={brands}
      initialData={initialData || undefined}
      isLoading={isSaving}
      onSubmit={handleSubmit}
    />
  );
}
