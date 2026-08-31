"use client";

import { useState } from "react";
import Image from "next/image";
import Badge from "@/components/ui/Badge";
import ProductImage from "@/components/product/ProductImage";
import WishlistButton from "@/components/product/WishlistButton";

interface ProductImageGalleryProps {
  images: string[];
  name: string;
  brand: string | null;
  isNew: boolean;
  discount: number;
  price: number;
  originalPrice: number | null;
  rating: number;
  reviewCount: number;
  id: string;
  slug: string;
  activeImageIndex: number;
  onImageSelect: (index: number) => void;
  onImageClick: () => void;
}

export default function ProductImageGallery({
  images,
  name,
  brand,
  isNew,
  discount,
  price,
  originalPrice,
  rating,
  reviewCount,
  id,
  slug,
  activeImageIndex,
  onImageSelect,
  onImageClick,
}: ProductImageGalleryProps) {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);

  return (
    <div className="animate-fade-in-up">
      {/* Main image */}
      <button
        type="button"
        onClick={onImageClick}
        aria-label="Bild vergrößern"
        className="aspect-square bg-[var(--color-bg-secondary)] rounded-2xl overflow-hidden mb-4 border border-[var(--color-border-light)] relative group cursor-zoom-in w-full text-left"
        onTouchStart={(e) => setTouchStart({ x: e.touches[0]!.clientX, y: e.touches[0]!.clientY })}
        onTouchEnd={(e) => {
          if (touchStart === null) return;
          const diffX = touchStart.x - e.changedTouches[0]!.clientX;
          const diffY = touchStart.y - e.changedTouches[0]!.clientY;
          if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX > 0 && activeImageIndex < images.length - 1) onImageSelect(activeImageIndex + 1);
            else if (diffX < 0 && activeImageIndex > 0) onImageSelect(activeImageIndex - 1);
          }
          setTouchStart(null);
        }}
      >
        <div className="w-full h-full">
          <ProductImage
            src={images[activeImageIndex] || images[0]}
            alt={name}
            brand={brand}
            size="lg"
            priority
          />
        </div>
        {/* Floating badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {isNew && <Badge variant="primary">Neu</Badge>}
          {discount > 0 && <Badge variant="promo">-{discount}%</Badge>}
        </div>
        {/* Wishlist button */}
        <div className="absolute top-4 right-4 transition-opacity duration-300">
          <WishlistButton
            item={{
              id,
              name,
              slug,
              price,
              originalPrice: originalPrice ?? undefined,
              image: images[0] || "/images/placeholder-product.svg",
              brand: brand ?? "",
              rating,
              reviewCount,
            }}
            size="md"
          />
        </div>
      </button>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin" role="list">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => onImageSelect(i)}
              aria-label={`${name} Bild ${i + 1} anzeigen`}
              className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-[var(--color-bg-secondary)] rounded-xl flex items-center border-2 overflow-hidden transition-colors transition-shadow duration-200 relative ${
                activeImageIndex === i
                  ? "border-[var(--color-primary)] shadow-sm"
                  : "border-transparent hover:border-[var(--color-border)]"
              }`}
            >
              <Image
                src={img}
                alt={`${name} ${i + 1}`}
                width={80}
                height={80}
                sizes="80px"
                className="w-full h-full object-contain p-1.5"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
