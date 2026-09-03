"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useWishlistStore, type WishlistItem } from "@/lib/wishlist";

interface WishlistButtonProps {
  item: WishlistItem;
  size?: "sm" | "md";
  className?: string;
}

export default function WishlistButton({ item, size = "sm", className = "" }: WishlistButtonProps) {
  const [mounted, setMounted] = useState(false);
  const toggleItem = useWishlistStore((s) => s.toggleItem);
  const inList = useWishlistStore((s) => s.items.some((i) => i.id === item.id));
  const isWishlisted = mounted && inList;

  useEffect(() => {
    setMounted(true);
  }, []);

  const sizeClasses = size === "sm" ? "w-11 h-11" : "w-12 h-12";
  const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";

  return (
    <button
      type="button"
      className={`${sizeClasses} bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors transition-transform duration-200 shadow-sm ${isWishlisted ? "text-[var(--color-danger)]" : "text-[var(--color-text-muted)] hover:text-[var(--color-danger)]"} ${className}`}
      aria-pressed={isWishlisted}
      aria-label={isWishlisted ? "Von Wunschliste entfernen" : "Zur Wunschliste hinzufügen"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleItem(item);
      }}
    >
      <Heart className={`${iconSize} ${isWishlisted ? "fill-current" : ""}`} />
    </button>
  );
}
