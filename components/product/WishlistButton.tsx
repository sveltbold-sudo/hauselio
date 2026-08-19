"use client";

import { Heart } from "lucide-react";
import { useWishlistStore, type WishlistItem } from "@/lib/wishlist";

interface WishlistButtonProps {
  item: WishlistItem;
  size?: "sm" | "md";
  className?: string;
}

export default function WishlistButton({ item, size = "sm", className = "" }: WishlistButtonProps) {
  const { toggleItem, isInWishlist } = useWishlistStore();
  const isWishlisted = isInWishlist(item.id);

  const sizeClasses = size === "sm" ? "w-8 h-8" : "w-10 h-10";
  const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";

  return (
    <button
      className={`${sizeClasses} bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 shadow-sm ${isWishlisted ? "text-[var(--color-danger)]" : "text-[var(--color-text-muted)] hover:text-[var(--color-danger)]"} ${className}`}
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
