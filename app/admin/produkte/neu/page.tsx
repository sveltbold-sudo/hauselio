"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";
import ImageUpload from "@/components/admin/ImageUpload";
import { useToast } from "@/components/ui/Toast";

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

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    shortDesc: "",
    price: "",
    originalPrice: "",
    categoryId: "",
    brandId: "",
    inStock: true,
    isNew: false,
    isFeatured: false,
    weight: "",
    imageUrl: "",
    features: [] as string[],
    newFeature: "",
    specs: [] as { key: string; value: string }[],
    newSpecKey: "",
    newSpecValue: "",
    seoTitle: "",
    seoDesc: "",
  });

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
    ]).then(([cats, brs]) => {
      setCategories(cats.categories || []);
      setBrands(brs.brands || []);
    }).catch(() => {});
  }, []);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[ä]/g, "ae")
      .replace(/[ö]/g, "oe")
      .replace(/[ü]/g, "ue")
      .replace(/[ß]/g, "ss")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleNameChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      name: value,
      slug: generateSlug(value),
    }));
  };

  const addFeature = () => {
    if (formData.newFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, prev.newFeature.trim()],
        newFeature: "",
      }));
    }
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const addSpec = () => {
    if (formData.newSpecKey.trim() && formData.newSpecValue.trim()) {
      setFormData((prev) => ({
        ...prev,
        specs: [
          ...prev.specs,
          { key: prev.newSpecKey.trim(), value: prev.newSpecValue.trim() },
        ],
        newSpecKey: "",
        newSpecValue: "",
      }));
    }
  };

  const removeSpec = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      specs: prev.specs.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/produkte", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
          description: formData.description,
          shortDesc: formData.shortDesc || undefined,
          price: Number(formData.price) || 0,
          originalPrice: formData.originalPrice
            ? Number(formData.originalPrice) || undefined
            : undefined,
          categoryId: formData.categoryId,
          brandId: formData.brandId || undefined,
          inStock: formData.inStock,
          isNew: formData.isNew,
          isFeatured: formData.isFeatured,
          weight: formData.weight ? Number(formData.weight) || undefined : undefined,
          features: formData.features,
          specs: formData.specs,
          imageUrl: formData.imageUrl || undefined,
          seoTitle: formData.seoTitle || undefined,
          seoDesc: formData.seoDesc || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Fehler beim Erstellen");
      }

      router.push("/admin/produkte");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        document.querySelector<HTMLFormElement>("form")?.requestSubmit();
      }
      if (e.key === "Escape") {
        router.push("/admin/produkte");
      }
    },
    [router]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/produkte"
          className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Neues Produkt
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Grundinformationen */}
            <div className="bg-white rounded-xl border border-[var(--color-border-light)] p-6">
              <h2 className="font-bold text-[var(--color-text-primary)] mb-4">
                Grundinformationen
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-text-primary)] mb-1.5">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-text-primary)] mb-1.5">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-text-primary)] mb-1.5">
                    Beschreibung *
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)] resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-text-primary)] mb-1.5">
                    Kurzbeschreibung
                  </label>
                  <textarea
                    rows={2}
                    value={formData.shortDesc}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        shortDesc: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)] resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl border border-[var(--color-border-light)] p-6">
              <h2 className="font-bold text-[var(--color-text-primary)] mb-4">
                Features
              </h2>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={formData.newFeature}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      newFeature: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                  placeholder="Neues Feature hinzufügen..."
                  className="flex-1 px-4 py-2 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)]"
                />
                <button
                  type="button"
                  onClick={addFeature}
                  aria-label="Feature hinzufügen"
                  className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-xl text-sm font-medium hover:bg-[var(--color-primary-hover)]"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.features.map((feature, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-[var(--color-primary-50)] text-[var(--color-primary)] rounded-full text-sm"
                  >
                    {feature}
                    <button
                      type="button"
                      onClick={() => removeFeature(i)}
                      className="hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Technische Daten */}
            <div className="bg-white rounded-xl border border-[var(--color-border-light)] p-6">
              <h2 className="font-bold text-[var(--color-text-primary)] mb-4">
                Technische Daten
              </h2>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={formData.newSpecKey}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      newSpecKey: e.target.value,
                    }))
                  }
                  placeholder="Key (z.B. Leistung)"
                  className="flex-1 px-4 py-2 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)]"
                />
                <input
                  type="text"
                  value={formData.newSpecValue}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      newSpecValue: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSpec())}
                  placeholder="Wert"
                  className="flex-1 px-4 py-2 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)]"
                />
                <button
                  type="button"
                  onClick={addSpec}
                  aria-label="Spezifikation hinzufügen"
                  className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-xl text-sm font-medium hover:bg-[var(--color-primary-hover)]"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {formData.specs.length > 0 && (
                <table className="w-full">
                  <tbody>
                    {formData.specs.map((spec, i) => (
                      <tr
                        key={i}
                        className="border-b border-[var(--color-border-light)] last:border-0"
                      >
                        <td className="py-2 text-sm font-medium text-[var(--color-text-primary)]">
                          {spec.key}
                        </td>
                        <td className="py-2 text-sm text-[var(--color-text-secondary)]">
                          {spec.value}
                        </td>
                        <td className="py-2 text-right">
                          <button
                            type="button"
                            onClick={() => removeSpec(i)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Preise & Verfügbarkeit */}
            <div className="bg-white rounded-xl border border-[var(--color-border-light)] p-6">
              <h2 className="font-bold text-[var(--color-text-primary)] mb-4">
                Preise & Verfügbarkeit
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-text-primary)] mb-1.5">
                    Preis (EUR) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, price: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-text-primary)] mb-1.5">
                    Originalpreis (EUR)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        originalPrice: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-text-primary)] mb-1.5">
                    Gewicht (kg)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.weight}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, weight: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.inStock}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          inStock: e.target.checked,
                        }))
                      }
                      className="rounded border-gray-300 text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
                    />
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      Verfügbar
                    </span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isNew}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          isNew: e.target.checked,
                        }))
                      }
                      className="rounded border-gray-300 text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
                    />
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      Neu
                    </span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          isFeatured: e.target.checked,
                        }))
                      }
                      className="rounded border-gray-300 text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
                    />
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      Empfohlen
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Kategorie & Marke */}
            <div className="bg-white rounded-xl border border-[var(--color-border-light)] p-6">
              <h2 className="font-bold text-[var(--color-text-primary)] mb-4">
                Kategorie & Marke
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-text-primary)] mb-1.5">
                    Kategorie *
                  </label>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        categoryId: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)]"
                  >
                    <option value="">Kategorie wählen</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-text-primary)] mb-1.5">
                    Marke
                  </label>
                  <select
                    value={formData.brandId}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        brandId: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)]"
                  >
                    <option value="">Marke wählen</option>
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Bild */}
            <div className="bg-white rounded-xl border border-[var(--color-border-light)] p-6">
              <h2 className="font-bold text-[var(--color-text-primary)] mb-4">
                Produktbild
              </h2>
              <ImageUpload
                folder="hauselio/products"
                onUpload={(url) =>
                  setFormData((prev) => ({ ...prev, imageUrl: url }))
                }
              />
            </div>

            {/* SEO */}
            <div className="bg-white rounded-xl border border-[var(--color-border-light)] p-6">
              <h2 className="font-bold text-[var(--color-text-primary)] mb-4">
                SEO
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-text-primary)] mb-1.5">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    maxLength={60}
                    value={formData.seoTitle}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        seoTitle: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-text-primary)] mb-1.5">
                    Meta Description
                  </label>
                  <textarea
                    rows={3}
                    maxLength={160}
                    value={formData.seoDesc}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        seoDesc: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)] resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[var(--color-orange)] text-white font-semibold rounded-xl hover:bg-[var(--color-orange-hover)] transition-colors disabled:opacity-50"
            >
              {isLoading ? "Wird erstellt..." : "Produkt erstellen"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
