"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
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
  color: string;
  bgGradient: string;
  accentColor: string;
}

const slides: Slide[] = [
  {
    id: "1",
    name: "Thermomix TM7",
    slug: "thermomix-tm7",
    brand: "KitchenAid",
    price: 1499,
    originalPrice: 1599,
    tagline: "Das ultimative Küchengerät",
    subtitle: "Über 80 Kochfunktionen in einem Gerät. Perfekt für anspruchsvolle Hobbyköche und Profis.",
    color: "#cc0000",
    bgGradient: "from-[#0a0a0a] via-[#1a0505] to-[#0a0a0a]",
    accentColor: "#ff3333",
  },
  {
    id: "2",
    name: "Dyson V15 Detect",
    slug: "dyson-v15-detect-absolute",
    brand: "Dyson",
    price: 749,
    originalPrice: null,
    tagline: "Laser-Technologie für unsichtbaren Schmutz",
    subtitle: "Der leistungsstärkste kabellose Staubsauger mit LCD-Display für Echtzeit-Feedback.",
    color: "#cc0033",
    bgGradient: "from-[#0a0a0a] via-[#150508] to-[#0a0a0a]",
    accentColor: "#ff1a53",
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
    color: "#1a1a1a",
    bgGradient: "from-[#0a0a0a] via-[#111111] to-[#0a0a0a]",
    accentColor: "#C9A96E",
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent(index);
    setTimeout(() => setIsTransitioning(false), 700);
  }, [isTransitioning]);

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, goTo]);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, next]);

  const slide = slides[current];
  const discount = calcDiscount(slide.price, slide.originalPrice);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Produkt-Highlights"
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${slide.bgGradient} transition-all duration-1000`}>
        {/* Ambient light effects */}
        <div
          className="absolute top-0 right-[15%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 transition-all duration-1000"
          style={{ backgroundColor: slide.accentColor }}
        />
        <div
          className="absolute bottom-0 left-[5%] w-[300px] h-[300px] rounded-full blur-[100px] opacity-10 transition-all duration-1000"
          style={{ backgroundColor: slide.accentColor }}
        />
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10" aria-live="polite">
        <div className="container-hauselio py-20 md:py-28 lg:py-36">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text Content */}
            <div className="text-white">
              {/* Brand badge */}
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-8 animate-fade-in-up"
                style={{
                  backgroundColor: `${slide.accentColor}15`,
                  color: slide.accentColor,
                  border: `1px solid ${slide.accentColor}30`,
                }}
              >
                <span
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: slide.accentColor }}
                />
                {slide.brand}
              </div>

              {/* Headline */}
              <p className="heading-display text-white mb-5 animate-fade-in-up delay-100">
                {slide.name}
              </p>

              {/* Tagline */}
              <p className="text-xl md:text-2xl font-semibold text-white/90 mb-3 animate-fade-in-up delay-150">
                {slide.tagline}
              </p>

              {/* Description */}
              <p className="text-base text-white/80 max-w-lg mb-8 leading-relaxed animate-fade-in-up delay-200">
                {slide.subtitle}
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-10 animate-fade-in-up delay-250">
                <span className="text-4xl md:text-5xl font-bold text-white">
                  {formatPrice(slide.price)}
                </span>
                {slide.originalPrice && (
                  <>
                    <span className="text-lg text-white/70 line-through">
                      {formatPrice(slide.originalPrice)}
                    </span>
                    <span
                      className="px-3 py-1 rounded-lg text-sm font-bold"
                      style={{
                        backgroundColor: slide.accentColor,
                        color: "white",
                      }}
                    >
                      -{discount}%
                    </span>
                  </>
                )}
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 animate-fade-in-up delay-300">
                <Link href={`/produkt/${slide.slug}`}>
                  <Button size="lg" variant="gradient" className="shadow-lg shadow-blue-500/25">
                    Jetzt bestellen
                    <ArrowRight className="w-5 h-5 ml-1" />
                  </Button>
                </Link>
                <Link href="/shop">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/20 text-white hover:bg-white hover:text-[var(--color-text-primary)]"
                  >
                    Alle Produkte
                  </Button>
                </Link>
              </div>
            </div>

            {/* Product Visual */}
            <div className="hidden lg:flex items-center justify-center relative animate-fade-in-up delay-200">
              <div className="relative">
                {/* Outer ring */}
                <div
                  className="w-[340px] h-[340px] xl:w-[400px] xl:h-[400px] rounded-full flex items-center justify-center transition-all duration-1000"
                  style={{
                    background: `radial-gradient(circle, ${slide.accentColor}08 0%, transparent 70%)`,
                    border: `1px solid ${slide.accentColor}15`,
                  }}
                >
                  {/* Inner circle */}
                  <div
                    className="w-56 h-56 xl:w-64 xl:h-64 rounded-full flex items-center justify-center transition-all duration-1000"
                    style={{
                      background: `radial-gradient(circle, ${slide.accentColor}12 0%, transparent 70%)`,
                    }}
                  >
                    <div className="text-center">
                      <div
                        className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-2xl transition-all duration-700"
                        style={{ backgroundColor: slide.accentColor }}
                      >
                        <span className="text-white font-bold text-3xl">
                          {slide.brand[0]}
                        </span>
                      </div>
                      <p className="text-white font-bold text-lg">{slide.name}</p>
                      <p className="text-white/50 text-sm mt-1">{slide.brand}</p>
                    </div>
                  </div>
                </div>

                {/* Floating price tag */}
                <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl px-6 py-4 shadow-[var(--shadow-2xl)] animate-float">
                  <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                    {formatPrice(slide.price)}
                  </p>
                  {discount > 0 && (
                    <p className="text-xs text-[var(--color-success)] font-semibold mt-0.5">
                      -{discount}% Ersparnis
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
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 z-20 border border-white/10"
        aria-label="Vorherige Folie"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 z-20 border border-white/10"
        aria-label="Nächste Folie"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Progress Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-current={i === current ? "true" : undefined}
            aria-label={`Folie ${i + 1}`}
            className={`flex items-center justify-center min-w-[44px] h-[44px] transition-all duration-500 ${
              i === current ? "" : ""
            }`}
          >
            <span
              className={`block h-1 rounded-full transition-all duration-500 ${
                i === current
                  ? "w-10 bg-white"
                  : "w-3 bg-white/30 hover:bg-white/50"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10 z-20">
        <div
          className="h-full transition-all duration-700 ease-linear"
          style={{
            width: `${((current + 1) / slides.length) * 100}%`,
            background: slide.accentColor,
          }}
        />
      </div>
    </section>
  );
}
