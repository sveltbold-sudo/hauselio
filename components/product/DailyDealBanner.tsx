"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight, Flame, Star, Shield, Truck, Check } from "lucide-react";
import { formatPrice, calcDiscount } from "@/lib/utils";

interface DealReview {
  name: string;
  rating: number;
  content: string;
}

interface DealProduct {
  name: string;
  slug: string;
  brand: string;
  price: number;
  originalPrice: number;
  image: string;
  tagline: string;
  rating?: number;
  reviewCount?: number;
  reviews?: DealReview[];
}

interface DailyDealBannerProps {
  product: DealProduct;
}

function getTimeLeft() {
  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  const diff = end.getTime() - now.getTime();
  return {
    hours: Math.floor(diff / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

export default function DailyDealBanner({ product }: DailyDealBannerProps) {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTime(getTimeLeft());
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const interval = prefersReduced ? 30_000 : 1_000;
    const timer = setInterval(() => setTime(getTimeLeft()), interval);
    return () => clearInterval(timer);
  }, []);

  const discount = calcDiscount(product.price, product.originalPrice);
  const savings = product.originalPrice - product.price;

  return (
    <section className="py-6 lg:py-8" aria-label="Angebot des Tages">
      <div className="container-hausaura">
        <div className="relative bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] rounded-3xl overflow-hidden">
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Content */}
            <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
              {/* Badge row */}
              <div className="flex items-center gap-2.5 mb-5 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-danger)] rounded-full text-xs font-bold text-white uppercase tracking-wider shadow-lg shadow-[var(--color-danger)]/30">
                  <Flame className="w-3.5 h-3.5" />
                  Angebot des Tages
                </span>
                <span className="inline-flex items-center px-2.5 py-1.5 bg-white text-[var(--color-danger)] text-sm font-extrabold rounded-full shadow-sm">
                  -{discount}%
                </span>
              </div>

              {/* Brand */}
              <p className="text-xs font-bold uppercase tracking-widest text-white/50 mb-2" translate="no">
                {product.brand}
              </p>

              {/* Name */}
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-3 leading-tight">
                {product.name}
              </h2>

              {/* Tagline */}
              <p className="text-sm text-white/70 mb-5 max-w-md leading-relaxed">
                {product.tagline}
              </p>

              {/* Price block */}
              <div className="flex items-end gap-4 mb-2">
                <div>
                  <span className="block text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                    {formatPrice(product.price)}
                  </span>
                </div>
                <div className="flex flex-col items-start pb-1">
                  <span className="text-base text-white/40 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="text-xs font-bold text-[var(--color-success)]">
                    Sie sparen {formatPrice(savings)}
                  </span>
                </div>
              </div>

              {/* Trust row */}
              <div className="flex items-center gap-4 mb-5 text-xs text-white/50">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-[var(--color-success)]" />
                  Gratis Versand
                </span>
                <span className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-[var(--color-success)]" />
                  30 Tage Rückgabe
                </span>
              </div>

              {/* Countdown */}
              {mounted && (
                <div className="flex items-center gap-3 mb-6" role="timer" aria-live="polite" aria-atomic="true" aria-label="Angebot endet in">
                  <div className="flex items-center gap-1.5 text-white/60">
                    <Clock className="w-4 h-4" aria-hidden="true" />
                    <span className="text-xs font-medium">Endet in:</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {[
                      { value: time.hours, label: "Std" },
                      { value: time.minutes, label: "Min" },
                      { value: time.seconds, label: "Sek" },
                    ].map((unit, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <span className="inline-flex items-center justify-center min-w-[40px] h-10 px-2 bg-white/10 backdrop-blur-sm rounded-lg text-sm font-extrabold text-white tabular-nums border border-white/10">
                          {String(unit.value).padStart(2, "0")}
                        </span>
                        {i < 2 && <span className="text-white/30 text-xs font-bold">:</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Social proof */}
              {(product.rating || product.reviewCount) && (
                <div className="flex items-center gap-2 mb-5">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(product.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-white/20"}`} />
                    ))}
                  </div>
                  <span className="text-xs text-white/60">
                    {product.rating?.toFixed(1)} · {product.reviewCount} Bewertungen
                  </span>
                </div>
              )}

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={`/produkt/${product.slug}`}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-[#1a1a2e] font-bold rounded-xl hover:bg-white/95 active:scale-[0.98] transition-all duration-200 shadow-xl shadow-black/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a2e]"
                >
                  Jetzt sichern
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href={`/produkt/${product.slug}`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-medium text-white/70 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
                >
                  Details ansehen
                </Link>
              </div>
            </div>

            {/* Image */}
            <div className="relative flex items-center justify-center p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-white/5 to-transparent">
              <div className="relative w-full max-w-[280px] lg:max-w-[340px] aspect-square">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-danger)]/20 to-[var(--color-accent)]/10 rounded-3xl blur-3xl" />
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain drop-shadow-2xl relative z-10"
                  sizes="(max-width: 1024px) 280px, 340px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
