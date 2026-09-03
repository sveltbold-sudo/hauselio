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
  returnFocusRef?: React.RefObject<HTMLElement | null>;
}

export default function ImageLightbox({ images, initialIndex = 0, productName, brand, isOpen, onClose, returnFocusRef }: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [scale, setScale] = useState(1);
  const lastTouchDistance = useRef<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
     
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setScale(1);
  }, [images.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setScale(1);
  }, [images.length]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll('[role="dialog"] button, [role="dialog"] a') || document.querySelectorAll('[role="dialog"] button, [role="dialog"] a');
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
    const focusTarget = returnFocusRef?.current;
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
      if (focusTarget) {
        focusTarget.focus();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, onClose, goNext, goPrev]);

  if (!isOpen) return null;

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 animate-fade-in-up"
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
        role="group"
        aria-live="polite"
        aria-atomic="true"
        onTouchStart={(e) => {
          if (e.touches.length === 2) {
            const dx = e.touches[0]!.clientX - e.touches[1]!.clientX;
            const dy = e.touches[0]!.clientY - e.touches[1]!.clientY;
            lastTouchDistance.current = Math.sqrt(dx * dx + dy * dy);
          } else {
            setTouchStart({ x: e.touches[0]!.clientX, y: e.touches[0]!.clientY });
          }
        }}
        onTouchMove={(e) => {
          if (e.touches.length === 2 && lastTouchDistance.current !== null) {
            e.preventDefault();
            const dx = e.touches[0]!.clientX - e.touches[1]!.clientX;
            const dy = e.touches[0]!.clientY - e.touches[1]!.clientY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const newScale = Math.min(3, Math.max(1, scale * (distance / lastTouchDistance.current)));
            setScale(newScale);
            lastTouchDistance.current = distance;
          }
        }}
        onTouchEnd={(e) => {
          if (e.touches.length < 2) {
            lastTouchDistance.current = null;
          }
          if (touchStart === null || e.changedTouches.length !== 1) return;
          const dx = touchStart.x - e.changedTouches[0]!.clientX;
          const dy = touchStart.y - e.changedTouches[0]!.clientY;
          if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0) goNext();
            else if (dx < 0) goPrev();
          }
          setTouchStart(null);
        }}
      >
        <div style={{ transform: `scale(${scale})`, transition: "transform 0.1s ease-out" }}>
          <ProductImage
            src={images[currentIndex]}
            alt={`${productName} – Bild ${currentIndex + 1}`}
            brand={brand}
            size="lg"
          />
        </div>
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
              className="min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label={`Bild ${i + 1}`}
            >
              <span className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i === currentIndex ? "bg-white" : "bg-white/40"
              }`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
