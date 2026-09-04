"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";
import ImageUpload from "@/components/admin/ImageUpload";
import Button from "@/components/ui/Button";
import { slugify } from "@/lib/utils";
import type { Category, Brand, ProductFormData } from "@/lib/admin-product-types";
import { emptyFormData } from "@/lib/admin-product-types";

export type { ProductFormData, Category, Brand };

interface ProductFormProps {
  title: string;
  submitLabel: string;
  loadingLabel?: string;
  backHref: string;
  categories: Category[];
  brands: Brand[];
  initialData?: Partial<ProductFormData>;
  isLoading?: boolean;
  onSubmit: (
    data: Omit<ProductFormData, "newFeature" | "newSpecKey" | "newSpecValue">
  ) => Promise<void>;
}

export type { ProductFormProps };

export default function ProductForm({
  title,
  submitLabel,
  loadingLabel = "Wird gespeichert…",
  backHref,
  categories,
  brands,
  initialData,
  isLoading = false,
  onSubmit,
}: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    ...emptyFormData,
    ...initialData,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSavedHint, setShowSavedHint] = useState(false);
  const isDirty = useRef(false);
  const initialDataRef = useRef(initialData);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty.current) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const initialLoadDone = useRef(false);

  useEffect(() => {
    if (isSubmitting) return;
    if (!initialLoadDone.current) return;
    isDirty.current = true;
  }, [formData, isSubmitting]);

  useEffect(() => {
    if (initialData) {
       
      setFormData((prev) => ({ ...prev, ...initialData }));
      initialDataRef.current = initialData;
      requestAnimationFrame(() => {
        initialLoadDone.current = true;
      });
    } else {
      requestAnimationFrame(() => {
        initialLoadDone.current = true;
      });
    }
  }, [initialData]);

  const handleNameChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      name: value,
      slug: slugify(value),
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

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim() || formData.name.trim().length < 3) {
      newErrors.name = "Name muss mindestens 3 Zeichen lang sein.";
    }
    if (!formData.slug.trim() || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(formData.slug)) {
      newErrors.slug = "Slug darf nur Kleinbuchstaben, Zahlen und Bindestriche enthalten.";
    }
    if (!formData.description.trim() || formData.description.trim().length < 10) {
      newErrors.description = "Beschreibung muss mindestens 10 Zeichen lang sein.";
    }
    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      newErrors.price = "Der Preis muss größer als 0 sein.";
    }
    if (formData.originalPrice) {
      const orig = parseFloat(formData.originalPrice);
      if (!isNaN(orig) && orig <= price) {
        newErrors.originalPrice = "Der Originalpreis muss höher als der Verkaufspreis sein.";
      }
    }
    if (!formData.categoryId) {
      newErrors.categoryId = "Bitte wählen Sie eine Kategorie.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars -- exclude UI-only fields from submission
      const { newFeature, newSpecKey, newSpecValue, ...submitData } = formData;
      await onSubmit(submitData);
      isDirty.current = false;
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = useCallback(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        formRef.current?.requestSubmit();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    const cleanup = handleKeyDown();
    return cleanup;
  }, [handleKeyDown]);

  useEffect(() => {
    if (!isSubmitting && !showSavedHint) return;
    if (showSavedHint) {
      const timer = setTimeout(() => setShowSavedHint(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isSubmitting, showSavedHint]);

  const isDisabled = isLoading || isSubmitting;

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          href={backHref}
          aria-label="Zurück"
          className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
          {title}
        </h1>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} aria-label="Produkt bearbeiten">
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
                  <label htmlFor="product-name" className="block text-sm font-semibold text-[var(--color-text-primary)] mb-1.5">
                    Name *
                  </label>
                  <input
                    id="product-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20 ${
                      errors.name ? "border-[var(--color-danger)]" : "border-[var(--color-border)] focus:border-[var(--color-primary)]"
                    }`}
                  />
                  {errors.name && <p className="mt-1 text-xs text-[var(--color-danger)]">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="product-slug" className="block text-sm font-semibold text-[var(--color-text-primary)] mb-1.5">
                    Slug
                  </label>
                  <input
                    id="product-slug"
                    type="text"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
                  />
                </div>
                <div>
                  <label htmlFor="product-desc" className="block text-sm font-semibold text-[var(--color-text-primary)] mb-1.5">
                    Beschreibung *
                  </label>
                  <textarea
                    id="product-desc"
                    required
                    rows={6}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className={`w-full px-4 py-2.5 border rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20 resize-y ${
                      errors.description ? "border-[var(--color-danger)]" : "border-[var(--color-border)] focus:border-[var(--color-primary)]"
                    }`}
                  />
                  {errors.description && <p className="mt-1 text-xs text-[var(--color-danger)]">{errors.description}</p>}
                </div>
                <div>
                  <label htmlFor="product-shortdesc" className="block text-sm font-semibold text-[var(--color-text-primary)] mb-1.5">
                    Kurzbeschreibung
                  </label>
                  <textarea
                    id="product-shortdesc"
                    rows={2}
                    value={formData.shortDesc}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        shortDesc: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] resize-none"
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
                <label htmlFor="new-feature" className="sr-only">Neues Feature</label>
                <input
                  id="new-feature"
                  type="text"
                  value={formData.newFeature}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      newFeature: e.target.value,
                    }))
                  }
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addFeature())
                  }
                  placeholder="Neues Feature hinzufügen…"
                  className="flex-1 px-4 py-3 border border-[var(--color-border)] rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
                />
                <button
                  type="button"
                  onClick={addFeature}
                  aria-label="Feature hinzufügen"
                  className="px-4 py-3 bg-[var(--color-primary)] text-white rounded-xl text-sm font-medium hover:bg-[var(--color-primary-hover)]"
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
                      aria-label={`Feature "${feature}" entfernen`}
                      className="min-w-[28px] min-h-[28px] flex items-center justify-center rounded hover:text-[var(--color-danger-hover)]"
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
                <div className="flex-1">
                  <label htmlFor="spec-key" className="sr-only">Spezifikation Key</label>
                  <input
                    id="spec-key"
                    type="text"
                    value={formData.newSpecKey}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        newSpecKey: e.target.value,
                      }))
                    }
                    placeholder="Key (z.B. Leistung)"
                    className="w-full px-4 py-3 border border-[var(--color-border)] rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="spec-value" className="sr-only">Spezifikation Wert</label>
                  <input
                    id="spec-value"
                    type="text"
                    value={formData.newSpecValue}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        newSpecValue: e.target.value,
                      }))
                    }
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addSpec())
                    }
                    placeholder="Wert"
                    className="w-full px-4 py-3 border border-[var(--color-border)] rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
                  />
                </div>
                <button
                  type="button"
                  onClick={addSpec}
                  aria-label="Spezifikation hinzufügen"
                  className="px-4 py-3 bg-[var(--color-primary)] text-white rounded-xl text-sm font-medium hover:bg-[var(--color-primary-hover)]"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {formData.specs.length > 0 && (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--color-border-light)]">
                      <th className="py-2 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Eigenschaft</th>
                      <th className="py-2 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Wert</th>
                      <th className="py-2 w-10"><span className="sr-only">Aktionen</span></th>
                    </tr>
                  </thead>
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
                            aria-label={`Spezifikation "${spec.key}" entfernen`}
                            className="min-w-[28px] min-h-[28px] flex items-center justify-center rounded text-[var(--color-danger)] hover:text-[var(--color-danger)]"
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
                  <label htmlFor="product-price" className="block text-sm font-semibold text-[var(--color-text-primary)] mb-1.5">
                    Preis (EUR) *
                  </label>
                  <input
                    id="product-price"
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={formData.price}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        price: e.target.value,
                      }))
                    }
                    className={`w-full px-4 py-2.5 border rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20 ${
                      errors.price ? "border-[var(--color-danger)]" : "border-[var(--color-border)] focus:border-[var(--color-primary)]"
                    }`}
                  />
                  {errors.price && <p className="mt-1 text-xs text-[var(--color-danger)]">{errors.price}</p>}
                </div>
                <div>
                  <label htmlFor="product-original-price" className="block text-sm font-semibold text-[var(--color-text-primary)] mb-1.5">
                    Originalpreis (EUR)
                  </label>
                  <input
                    id="product-original-price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.originalPrice}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        originalPrice: e.target.value,
                      }))
                    }
                    className={`w-full px-4 py-2.5 border rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20 ${
                      errors.originalPrice ? "border-[var(--color-danger)]" : "border-[var(--color-border)] focus:border-[var(--color-primary)]"
                    }`}
                  />
                  {errors.originalPrice && <p className="mt-1 text-xs text-[var(--color-danger)]">{errors.originalPrice}</p>}
                </div>
                <div>
                  <label htmlFor="weight" className="block text-sm font-semibold text-[var(--color-text-primary)] mb-1.5">
                    Gewicht (kg)
                  </label>
                  <input
                    id="weight"
                    type="number"
                    step="0.01"
                    value={formData.weight}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        weight: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
                  />
                </div>
                <div className="space-y-2">
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
                      className="rounded border-[var(--color-border)] text-[var(--color-accent)] focus:ring-[var(--color-primary)]"
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
                      className="rounded border-[var(--color-border)] text-[var(--color-accent)] focus:ring-[var(--color-primary)]"
                    />
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      Empfohlen
                    </span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isPromo}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          isPromo: e.target.checked,
                        }))
                      }
                      className="rounded border-[var(--color-border)] text-[var(--color-accent)] focus:ring-[var(--color-primary)]"
                    />
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      Aktion
                    </span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isDailyDeal}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          isDailyDeal: e.target.checked,
                        }))
                      }
                      className="rounded border-[var(--color-border)] text-[var(--color-danger)] focus:ring-[var(--color-danger)]"
                    />
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      Angebot des Tages
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
                  <label htmlFor="categoryId" className="block text-sm font-semibold text-[var(--color-text-primary)] mb-1.5">
                    Kategorie *
                  </label>
                  <select
                    id="categoryId"
                    required
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        categoryId: e.target.value,
                      }))
                    }
                    className={`w-full px-4 py-2.5 border rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20 ${
                      errors.categoryId ? "border-[var(--color-danger)]" : "border-[var(--color-border)] focus:border-[var(--color-primary)]"
                    }`}
                  >
                    <option value="">Kategorie waehlen</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && <p className="mt-1 text-xs text-[var(--color-danger)]">{errors.categoryId}</p>}
                </div>
                <div>
                  <label htmlFor="brandId" className="block text-sm font-semibold text-[var(--color-text-primary)] mb-1.5">
                    Marke
                  </label>
                  <select
                    id="brandId"
                    value={formData.brandId}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        brandId: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
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
                currentImage={formData.imageUrl || undefined}
                folder="HAUSAURA/products"
                onUpload={(url, publicId) =>
                  setFormData((prev) => ({ ...prev, imageUrl: url, imagePublicId: publicId }))
                }
                onRemove={() =>
                  setFormData((prev) => ({ ...prev, imageUrl: "", imagePublicId: "" }))
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
                  <label htmlFor="metaTitle" className="block text-sm font-semibold text-[var(--color-text-primary)] mb-1.5">
                    Meta Title
                  </label>
                  <input
                    id="metaTitle"
                    type="text"
                    maxLength={60}
                    value={formData.seoTitle}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        seoTitle: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
                  />
                  <p className={`mt-1 text-xs ${formData.seoTitle.length > 55 ? "text-[var(--color-accent)]" : "text-[var(--color-text-muted)]"}`}>
                    {formData.seoTitle.length}/60 Zeichen
                  </p>
                </div>
                <div>
                  <label htmlFor="metaDescription" className="block text-sm font-semibold text-[var(--color-text-primary)] mb-1.5">
                    Meta Description
                  </label>
                  <textarea
                    id="metaDescription"
                    rows={3}
                    maxLength={160}
                    value={formData.seoDesc}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        seoDesc: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] resize-none"
                  />
                  <p className={`mt-1 text-xs ${formData.seoDesc.length > 150 ? "text-[var(--color-accent)]" : "text-[var(--color-text-muted)]"}`}>
                    {formData.seoDesc.length}/160 Zeichen
                  </p>
                </div>
              </div>
            </div>

            {/* Submit */}
            {submitError && (
              <div className="p-3 bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/20 rounded-xl text-sm text-[var(--color-danger)]">
                {submitError}
              </div>
            )}
            <Button
              type="submit"
              disabled={isDisabled}
              className="w-full"
            >
              {isDisabled ? loadingLabel : submitLabel}
            </Button>
            <p className="text-xs text-[var(--color-text-muted)] text-center mt-2">
              Tastenkürzel: <kbd className="px-1.5 py-0.5 bg-[var(--color-bg)] rounded border border-[var(--color-border-light)] text-[var(--color-text-secondary)] font-mono">Strg</kbd> + <kbd className="px-1.5 py-0.5 bg-[var(--color-bg)] rounded border border-[var(--color-border-light)] text-[var(--color-text-secondary)] font-mono">S</kbd> zum Speichern
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
