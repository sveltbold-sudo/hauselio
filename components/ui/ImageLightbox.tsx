"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  const closeRef = useRef<HTMLButtonElement>(null);

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
      if (e.key === "Tab") {
        const focusable = document.querySelectorAll('[role="dialog"] button, [role="dialog"] a');
        if (focusable.length === 0) return;
        const first = focusable[0] as HTMLElement;
        const last = focusable[focusable.length - 1] as HTMLElement;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
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
        ref={closeRef}
        onClick={onClose}
        className="absolute top-4 right-4 min-w-[44px] min-h-[44px] flex items-center justify-center text-white/80 hover:text-white transition-colors z-10"
        aria-label="Schließen"
      >
        <X className="w-6 h-6" />
      </button>

      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); goPrev(); }}
          className="absolute left-4 min-w-[44px] min-h-[44px] flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-10"
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
          className="absolute right-4 min-w-[44px] min-h-[44px] flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-10"
          aria-label="Nächstes Bild"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {images.length > 1 && (
        <div className="absolute bottom-4 flex gap-3">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setCurrentIndex(i); }}
              className={`w-3 h-3 rounded-full transition-colors ${
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
