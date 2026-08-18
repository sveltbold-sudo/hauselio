"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight, Star, Truck, Shield, RotateCcw } from "lucide-react";
import Button from "@/components/ui/Button";
import { formatPrice, calcDiscount } from "@/lib/utils";

interface Slide {
  id: string;
  name: string;
  slug: string;
  brand: string;
  price: number;
  originalPrice: number | null;
  tagline: string;
  subtitle: string;
  image: string;
  accentColor: string;
}

const slides: Slide[] = [
  {
    id: "1",
    name: "Thermomix TM7",
    slug: "thermomix-tm7",
    brand: "Vorwerk",
    price: 1499,
    originalPrice: 1599,
    tagline: "Das ultimative Küchengerät",
    subtitle: "Über 80 Kochfunktionen in einem Gerät. Perfekt für anspruchsvolle Hobbyköche und Profis.",
    image: "/images/products/thermomix-tm7.jpg",
    accentColor: "#cc0000",
  },
  {
    id: "2",
    name: "KitchenAid Artisan",
    slug: "kitchenaid-artisan",
    brand: "KitchenAid",
    price: 449,
    originalPrice: 549,
    tagline: "Der Küchenklassiker",
    subtitle: "Premium-Standmixer mit Metallgetriebe und 5L-Schüssel. Über 100 Jahre Küchentradition.",
    image: "/images/products/kitchenaid-artisan-5ksm175pse.jpg",
    accentColor: "#cc0000",
  },
  {
    id: "3",
    name: "Jura E8 Platinum",
    slug: "jura-e8-platinum",
    brand: "Jura",
    price: 1199,
    originalPrice: 1299,
    tagline: "Premium Kaffeevollautomat",
    subtitle: "P.E.P. Technologie für perfekten Espresso und Milchschaum-System für Cappuccino.",
    image: "/images/products/jura-e8-platinum.jpg",
    accentColor: "#1a1a1a",
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const goTo = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent(index);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning]);

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, goTo]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsAutoPlaying(false);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
    }
    setIsAutoPlaying(true);
  }, [next, prev]);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, next]);

  const slide = slides[current];
  const discount = calcDiscount(slide.price, slide.originalPrice);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Produkt-Highlights"
      className="relative w-full bg-[var(--color-bg-secondary)] overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Content */}
      <div className="relative z-10" aria-live="polite">
        <div className="container-hauselio py-10 md:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Text Content */}
            <div className="animate-fade-in-up">
              {/* Brand badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-full text-xs font-bold mb-5 border border-[var(--color-border-light)] shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
                {slide.brand}
              </div>

              {/* Headline */}
              <h2 className="heading-display text-[var(--color-text-primary)] mb-4">
                {slide.name}
              </h2>

              {/* Tagline */}
              <p className="text-xl md:text-2xl font-semibold text-[var(--color-text-primary)] mb-3">
                {slide.tagline}
              </p>

              {/* Description */}
              <p className="text-base text-[var(--color-text-secondary)] max-w-lg mb-6 leading-relaxed">
                {slide.subtitle}
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-8">
                <span className="text-4xl md:text-5xl font-extrabold text-[var(--color-text-primary)] tracking-tight">
                  {formatPrice(slide.price)}
                </span>
                {slide.originalPrice && (
                  <>
                    <span className="text-lg text-[var(--color-text-muted)] line-through">
                      {formatPrice(slide.originalPrice)}
                    </span>
                    <span className="price-discount">
                      -{discount}%
                    </span>
                  </>
                )}
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 mb-8">
                <Link href={`/produkt/${slide.slug}`}>
                  <Button size="lg" className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white shadow-lg shadow-blue-900/20">
                    Jetzt bestellen
                    <ArrowRight className="w-5 h-5 ml-1" />
                  </Button>
                </Link>
                <Link href="/shop">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                  >
                    Alle Produkte
                  </Button>
                </Link>
              </div>

              {/* Trust Signals */}
              <div className="flex flex-wrap gap-4 text-xs text-[var(--color-text-muted)]">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[var(--color-success)]" />
                  Kostenloser Versand
                </span>
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[var(--color-success)]" />
                  Bis zu 5 Jahre Garantie
                </span>
                <span className="flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-[var(--color-success)]" />
                  30 Tage Rückgabe
                </span>
              </div>
            </div>

            {/* Product Image */}
            <div className="relative flex items-center justify-center animate-fade-in-up delay-200">
              <div className="relative w-full max-w-[420px] aspect-square">
                {/* Background circle */}
                <div className="absolute inset-4 rounded-full bg-white border border-[var(--color-border-light)] shadow-[var(--shadow-sm)]" />
                
                {/* Product Image */}
                <div className="relative z-10 w-full h-full flex items-center justify-center p-8">
                  <Image
                    src={slide.image}
                    alt={slide.name}
                    width={380}
                    height={380}
                    className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.12)] transition-transform duration-700 hover:scale-105"
                    priority
                    sizes="(max-width: 768px) 80vw, 420px"
                  />
                </div>

                {/* Floating price tag */}
                <div className="absolute -bottom-2 -right-2 lg:bottom-4 lg:-right-4 bg-white rounded-2xl px-5 py-3 shadow-[var(--shadow-xl)] border border-[var(--color-border-light)] animate-float z-20">
                  <div className="flex items-baseline gap-2">
                    <p className="text-xl font-extrabold text-[var(--color-text-primary)]">
                      {formatPrice(slide.price)}
                    </p>
                    {slide.originalPrice && (
                      <p className="text-sm text-[var(--color-text-muted)] line-through">
                        {formatPrice(slide.originalPrice)}
                      </p>
                    )}
                  </div>
                  {discount > 0 && (
                    <p className="text-xs text-[var(--color-success)] font-bold mt-0.5">
                      Sie sparen {formatPrice(slide.originalPrice! - slide.price)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 glass-premium rounded-full flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:shadow-lg transition-all duration-300 z-20 focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
        aria-label="Vorherige Folie"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 glass-premium rounded-full flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:shadow-lg transition-all duration-300 z-20 focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
        aria-label="Nächste Folie"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Progress Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-current={i === current ? "true" : undefined}
            aria-label={`Folie ${i + 1}`}
            className="flex items-center justify-center min-w-[44px] h-[44px]"
          >
            <span
              className={`block h-1.5 rounded-full transition-all duration-500 ${
                i === current
                  ? "w-8 bg-[var(--color-primary)]"
                  : "w-3 bg-[var(--color-border)] hover:bg-[var(--color-text-muted)]"
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
