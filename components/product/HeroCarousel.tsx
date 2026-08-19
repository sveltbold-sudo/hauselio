"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight, Truck, Shield, RotateCcw } from "lucide-react";
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
  cta?: string;
}

interface HeroCarouselProps {
  slides?: Slide[];
}

const defaultSlides: Slide[] = [
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
    cta: "Jetzt bestellen",
  },
  {
    id: "2",
    name: "KitchenAid Artisan",
    slug: "kitchenaid-artisan-5ksm175pse",
    brand: "KitchenAid",
    price: 449,
    originalPrice: 549,
    tagline: "Der Küchenklassiker",
    subtitle: "Premium-Standmixer mit Metallgetriebe und 5L-Schüssel. Über 100 Jahre Küchentradition.",
    image: "/images/products/kitchenaid-artisan-5ksm175pse.jpg",
    cta: "Jetzt entdecken",
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
    cta: "Jetzt ansehen",
  },
];

export default function HeroCarousel({ slides: propSlides }: HeroCarouselProps) {
  const slides = propSlides && propSlides.length > 0 ? propSlides : defaultSlides;
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const TRANSITION_MS = 600;

  const goTo = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent(index);
    setTimeout(() => setIsTransitioning(false), TRANSITION_MS);
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
      className="relative w-full bg-white overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Content */}
      <div className="relative z-10" aria-live="polite">
        <div className="container-hauselio py-8 md:py-14 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Text Content */}
            <div className="animate-fade-in-up order-2 lg:order-1">
              {/* Brand badge */}
              <span className="inline-block px-3 py-1 bg-[var(--color-bg-secondary)] rounded-md text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-4">
                {slide.brand}
              </span>

              {/* Headline */}
              <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold text-[var(--color-text-primary)] mb-3 leading-[1.1] tracking-tight">
                {slide.name}
              </h2>

              {/* Tagline */}
              <p className="text-lg md:text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                {slide.tagline}
              </p>

              {/* Description */}
              <p className="text-sm md:text-base text-[var(--color-text-secondary)] max-w-md mb-5 leading-relaxed">
                {slide.subtitle}
              </p>

              {/* Price — inline like Coolblue/AO */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl md:text-4xl font-extrabold text-[var(--color-text-primary)] tracking-tight">
                  {formatPrice(slide.price)}
                </span>
                {slide.originalPrice && (
                  <>
                    <span className="text-base text-[var(--color-text-muted)] line-through">
                      {formatPrice(slide.originalPrice)}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 bg-[var(--color-danger-light)] text-[var(--color-danger)] text-xs font-bold rounded">
                      -{discount}%
                    </span>
                  </>
                )}
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 mb-6">
                <Link href={`/produkt/${slide.slug}`}>
                  <Button size="lg" className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold shadow-lg shadow-[var(--color-primary)]/15">
                    {slide.cta || "Jetzt bestellen"}
                    <ArrowRight className="w-4 h-4 ml-1.5" />
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

              {/* Trust Signals — like Coolblue/AO, compact row */}
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-[var(--color-text-muted)]">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[var(--color-success)]" />
                  Kostenloser Versand
                </span>
                <span className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-[var(--color-success)]" />
                  Garantie bis 5 Jahre
                </span>
                <span className="flex items-center gap-1.5">
                  <RotateCcw className="w-4 h-4 text-[var(--color-success)]" />
                  30 Tage Rückgabe
                </span>
              </div>
            </div>

            {/* Product Image — full clean like AO/Coolblue, no circle */}
            <div className="relative flex items-center justify-center animate-fade-in-up delay-200 order-1 lg:order-2">
              <div className="relative w-full max-w-[400px] lg:max-w-[440px] aspect-square bg-[var(--color-bg-secondary)] rounded-2xl overflow-hidden">
                <Image
                  src={slide.image}
                  alt={slide.name}
                  fill
                  className="object-contain p-6 md:p-10 transition-transform duration-700 hover:scale-105"
                  priority
                  sizes="(max-width: 768px) 100vw, 440px"
                />
                {/* Discount badge — top left like Coolblue */}
                {discount > 0 && (
                  <span className="absolute top-4 left-4 inline-flex items-center px-2.5 py-1 bg-[var(--color-danger)] text-white text-xs font-bold rounded-md shadow-sm">
                    -{discount}%
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows — minimal like MediaMarkt */}
      <button
        onClick={prev}
        className="absolute left-2 md:left-5 top-1/2 -translate-y-1/2 w-9 h-9 md:w-10 md:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:shadow-md transition-all duration-200 z-20 border border-[var(--color-border-light)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
        aria-label="Vorherige Folie"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={next}
        className="absolute right-2 md:right-5 top-1/2 -translate-y-1/2 w-9 h-9 md:w-10 md:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:shadow-md transition-all duration-200 z-20 border border-[var(--color-border-light)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
        aria-label="Nächste Folie"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Progress Indicators — dots like Coolblue */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-current={i === current ? "true" : undefined}
            aria-label={`Folie ${i + 1}`}
            className="flex items-center justify-center min-w-[36px] h-[36px]"
          >
            <span
              className={`block h-1.5 rounded-full transition-all duration-400 ${
                i === current
                  ? "w-7 bg-[var(--color-primary)]"
                  : "w-2.5 bg-[var(--color-border)] hover:bg-[var(--color-text-muted)]"
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
