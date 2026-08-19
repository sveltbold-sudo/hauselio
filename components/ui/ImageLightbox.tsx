"use client";

import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import ProductImage from "@/components/product/ProductImage";

interface ImageLightboxProps {
  images: string[];
  initialIndex?: number;
  productName: string;
  brand?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImageLightbox({ images, initialIndex = 0, productName, brand, isOpen, onClose }: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose, goNext, goPrev]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 animate-fade-in-up"
      onClick={onClose}
      role="dialog"
      aria-label="Bildvergrößerung"
      aria-modal="true"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-white/80 hover:text-white transition-colors z-10"
        aria-label="Schließen"
      >
        <X className="w-6 h-6" />
      </button>

      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); goPrev(); }}
          className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-10"
          aria-label="Vorheriges Bild"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      <div
        className="max-w-[90vw] max-h-[85vh] w-full aspect-square"
        onClick={(e) => e.stopPropagation()}
      >
        <ProductImage
          src={images[currentIndex]}
          alt={`${productName} – Bild ${currentIndex + 1}`}
          brand={brand}
          size="lg"
        />
      </div>

      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); goNext(); }}
          className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-10"
          aria-label="Nächstes Bild"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {images.length > 1 && (
        <div className="absolute bottom-4 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setCurrentIndex(i); }}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === currentIndex ? "bg-white" : "bg-white/40"
              }`}
              aria-label={`Bild ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
