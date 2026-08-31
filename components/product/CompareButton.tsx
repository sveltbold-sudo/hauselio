"use client";

import { BarChart3, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/Toast";

interface CompareButtonProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    originalPrice?: number | null;
    image: string;
    brand: string;
    rating: number;
    reviewCount: number;
    specs?: { key: string; value: string }[];
  };
}

export default function CompareButton({ product }: CompareButtonProps) {
  const [isComparing, setIsComparing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const toast = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const stored = localStorage.getItem("hauselio-comparison");
    if (stored) {
      try {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setIsComparing(parsed.some((p: { id: string }) => p.id === product.id));
        }
      } catch {}
    }
  }, [product.id, mounted]);

  const toggleCompare = () => {
    const stored = localStorage.getItem("hauselio-comparison");
    let items: CompareButtonProps["product"][] = [];
    try {
      const parsed: unknown = stored ? JSON.parse(stored) : [];
      if (Array.isArray(parsed)) items = parsed;
    } catch {}

    if (isComparing) {
      items = items.filter((p) => p.id !== product.id);
    } else {
      if (items.length >= 4) {
        toast.info("Maximal 4 Produkte zum Vergleich");
        return;
      }
      items.push({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        brand: product.brand,
        rating: product.rating,
        reviewCount: product.reviewCount,
        specs: product.specs,
      });
    }

    localStorage.setItem("hauselio-comparison", JSON.stringify(items));
    setIsComparing(!isComparing);
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new CustomEvent("comparison-updated"));
  };

  if (!mounted) return <div className="w-20 h-5" />;

  return (
    <button
      onClick={toggleCompare}
      className={`flex items-center gap-1.5 min-h-[44px] px-3 py-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 ${
        isComparing
          ? "text-[var(--color-primary)]"
          : "text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
      }`}
      aria-label={isComparing ? "Vom Vergleich entfernen" : "Zum Vergleich hinzufügen"}
    >
      {isComparing ? (
        <BarChart3 className="w-4 h-4 fill-current" />
      ) : (
        <Plus className="w-4 h-4" />
      )}
      {isComparing ? "Aktiviert" : "Vergleichen"}
    </button>
  );
}
