"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight, Truck, Shield, RotateCcw } from "lucide-react";
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
  bgImage?: string;
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
    bgImage: "/images/hero-kitchen.jpg",
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
    bgImage: "/images/hero-kitchen.jpg",
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
    bgImage: "/images/hero-coffee.jpg",
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
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const TRANSITION_MS = 600;

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  const goTo = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent(index);
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }
    transitionTimeoutRef.current = setTimeout(() => setIsTransitioning(false), TRANSITION_MS);
  }, [isTransitioning]);

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, goTo, slides.length]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, goTo, slides.length]);

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
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;
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
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") next();
        if (e.key === "ArrowLeft") prev();
      }}
    >
      {/* ── MOBILE LAYOUT ── */}
      <div className="lg:hidden relative" aria-live="polite">
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[var(--color-primary-50)] via-white to-white" />

        <div key={current} className="relative z-10 animate-fade-in-up">
          {/* Product image */}
          <div className="relative mx-auto w-full max-w-[280px] aspect-square pt-6 pb-2">
            <Image
              src={slide.image}
              alt={slide.name}
              fill
              className="object-contain p-4"
              priority
              sizes="280px"
            />
            {discount > 0 && (
              <span className="absolute top-6 left-2 inline-flex items-center px-2 py-0.5 bg-[var(--color-danger)] text-white text-[11px] font-bold rounded-md shadow-sm">
                -{discount}%
              </span>
            )}
          </div>

          {/* Text content */}
          <div className="px-5 pb-6 text-center">
            <span className="inline-block px-2.5 py-0.5 bg-[var(--color-bg-secondary)] rounded text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-2" translate="no">
              {slide.brand}
            </span>
            <h2 className="text-xl font-extrabold text-[var(--color-text-primary)] mb-1 leading-tight">
              {slide.name}
            </h2>
            <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">
              {slide.tagline}
            </p>
            <p className="text-xs text-[var(--color-text-secondary)] mb-4 line-clamp-2 max-w-sm mx-auto">
              {slide.subtitle}
            </p>
            <div className="flex items-baseline justify-center gap-2 mb-4">
              <span className="text-2xl font-extrabold text-[var(--color-text-primary)] tabular-nums">
                {formatPrice(slide.price)}
              </span>
              {slide.originalPrice && (
                <>
                  <span className="text-sm text-[var(--color-text-muted)] line-through tabular-nums">
                    {formatPrice(slide.originalPrice)}
                  </span>
                  <span className="inline-flex items-center px-1.5 py-0.5 bg-[var(--color-danger-light)] text-[var(--color-danger)] text-[10px] font-bold rounded">
                    -{discount}%
                  </span>
                </>
              )}
            </div>
            <Link
              href={`/produkt/${slide.slug}`}
              className="flex items-center justify-center w-full px-6 py-3.5 text-sm font-bold rounded-xl bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] shadow-lg shadow-blue-500/20 active:scale-[0.97] transition-all duration-200"
            >
              {slide.cta || "Jetzt bestellen"}
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
            <div className="flex items-center justify-center gap-4 mt-3 text-[10px] text-[var(--color-text-muted)]">
              <span className="flex items-center gap-1">
                <Truck className="w-3 h-3 text-[var(--color-success)]" />
                Versand gratis
              </span>
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-[var(--color-success)]" />
                5 J. Garantie
              </span>
              <span className="flex items-center gap-1">
                <RotateCcw className="w-3 h-3 text-[var(--color-success)]" />
                30 Tage
              </span>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="relative z-10 flex items-center justify-center gap-2 pb-4">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-current={i === current ? "true" : undefined}
              aria-label={`Folie ${i + 1}`}
              className="flex items-center justify-center min-w-[44px] h-[44px]"
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

        {/* Nav arrows */}
        <button
          onClick={prev}
          className="absolute left-2 bottom-16 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-primary)] shadow-md border border-[var(--color-border-light)] z-20 active:scale-95 transition-all duration-200"
          aria-label="Vorherige Folie"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={next}
          className="absolute right-2 bottom-16 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-primary)] shadow-md border border-[var(--color-border-light)] z-20 active:scale-95 transition-all duration-200"
          aria-label="Nächste Folie"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* ── DESKTOP LAYOUT ── */}
      <div className="hidden lg:block relative" aria-live="polite">
        <div className="absolute inset-0 z-0">
          <Image
            src={slide.bgImage || "/images/hero-kitchen.jpg"}
            alt=""
            fill
            className="object-cover"
            loading="lazy"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/30" />
        </div>

        <div className="relative z-10 container-hauselio py-14 lg:py-16 xl:py-20">
          <div key={current} className="grid grid-cols-2 gap-12 xl:gap-16 items-center animate-fade-in-up">
            {/* Text */}
            <div>
              <span className="inline-block px-3 py-1 bg-[var(--color-bg-secondary)] rounded-md text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-5" translate="no">
                {slide.brand}
              </span>
              <h2 className="text-4xl xl:text-5xl font-extrabold text-[var(--color-text-primary)] mb-4 leading-[1.05] tracking-tight">
                {slide.name}
              </h2>
              <p className="text-lg xl:text-xl font-semibold text-[var(--color-text-primary)] mb-3">
                {slide.tagline}
              </p>
              <p className="text-sm xl:text-base text-[var(--color-text-secondary)] max-w-md mb-6 leading-relaxed">
                {slide.subtitle}
              </p>
              <div className="flex items-baseline gap-3 mb-7">
                <span className="text-3xl xl:text-4xl font-extrabold text-[var(--color-text-primary)] tracking-tight tabular-nums">
                  {formatPrice(slide.price)}
                </span>
                {slide.originalPrice && (
                  <>
                    <span className="text-base text-[var(--color-text-muted)] line-through tabular-nums">
                      {formatPrice(slide.originalPrice)}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 bg-[var(--color-danger-light)] text-[var(--color-danger)] text-xs font-bold rounded">
                      -{discount}%
                    </span>
                  </>
                )}
              </div>
              <div className="flex flex-wrap gap-3 mb-7">
                <Link
                  href={`/produkt/${slide.slug}`}
                  className="inline-flex items-center justify-center px-7 py-3.5 text-base font-semibold rounded-xl bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:shadow-xl active:scale-[0.97] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-primary)]"
                >
                  {slide.cta || "Jetzt bestellen"}
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center px-7 py-3.5 text-base font-semibold rounded-xl border-2 border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] active:scale-[0.97] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-primary)]"
                >
                  Alle Produkte
                </Link>
              </div>
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

            {/* Product Image */}
            <div className="relative flex items-center justify-center">
              <div className="relative w-full max-w-[440px] xl:max-w-[480px] aspect-square bg-white rounded-3xl shadow-2xl shadow-black/5 overflow-hidden">
                <Image
                  src={slide.image}
                  alt={slide.name}
                  fill
                  className="object-contain p-8 xl:p-10 transition-transform duration-700 hover:scale-105"
                  priority
                  sizes="480px"
                />
                {discount > 0 && (
                  <span className="absolute top-5 left-5 inline-flex items-center px-3 py-1 bg-[var(--color-danger)] text-white text-sm font-bold rounded-lg shadow-sm">
                    -{discount}%
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Nav arrows */}
        <button
          onClick={prev}
          className="absolute left-5 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:shadow-md active:scale-95 transition-all duration-200 z-20 border border-[var(--color-border-light)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
          aria-label="Vorherige Folie"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={next}
          className="absolute right-5 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:shadow-md active:scale-95 transition-all duration-200 z-20 border border-[var(--color-border-light)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
          aria-label="Nächste Folie"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dots */}
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
                className={`block h-1.5 rounded-full transition-all duration-400 ${
                  i === current
                    ? "w-7 bg-[var(--color-primary)]"
                    : "w-2.5 bg-[var(--color-border)] hover:bg-[var(--color-text-muted)]"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
