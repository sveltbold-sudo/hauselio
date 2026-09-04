"use client";

import { BarChart3, Plus } from "lucide-react";
import { useComparisonStore } from "@/lib/comparison";
import { useToast } from "@/components/ui/Toast";

interface CompareButtonProps {
  product: {
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
    specs?: { key: string; value: string }[];
  };
}

export default function CompareButton({ product }: CompareButtonProps) {
  const isComparing = useComparisonStore((s) => s.isComparing(product.id));
  const toggleItem = useComparisonStore((s) => s.toggleItem);
  const canAdd = useComparisonStore((s) => s.canAdd);
  const toast = useToast();

  const toggleCompare = () => {
    if (!isComparing && !canAdd()) {
      toast.info("Maximal 4 Produkte zum Vergleich");
      return;
    }
    toggleItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      originalPrice: product.originalPrice,
      isPromo: product.isPromo,
      image: product.image,
      brand: product.brand,
      rating: product.rating,
      reviewCount: product.reviewCount,
      specs: product.specs,
    });
  };

  return (
    <button
      onClick={toggleCompare}
      aria-pressed={isComparing}
      className={`flex items-center gap-1.5 min-h-[44px] px-3 py-2 text-sm font-medium transition-colors transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 ${
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
