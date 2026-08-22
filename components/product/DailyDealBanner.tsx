"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight, Flame } from "lucide-react";
import { formatPrice, calcDiscount } from "@/lib/utils";

interface DealProduct {
  name: string;
  slug: string;
  brand: string;
  price: number;
  originalPrice: number;
  image: string;
  tagline: string;
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
    const timer = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  const discount = calcDiscount(product.price, product.originalPrice);

  return (
    <section className="section-py bg-white">
      <div className="container-hauselio">
        <div className="bg-gradient-to-r from-[var(--color-danger)] to-red-600 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Content */}
            <div className="p-6 md:p-8 lg:p-10 flex flex-col justify-center">
              {/* Badge */}
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold text-white uppercase tracking-wider">
                  <Flame className="w-3.5 h-3.5" />
                  Angebot des Tages
                </span>
                <span className="inline-flex items-center px-2.5 py-1 bg-white text-[var(--color-danger)] text-xs font-black rounded-full">
                  -{discount}%
                </span>
              </div>

              {/* Brand */}
              <p className="text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
                {product.brand}
              </p>

              {/* Name */}
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2 leading-tight">
                {product.name}
              </h2>

              {/* Tagline */}
              <p className="text-sm text-white/80 mb-5 max-w-md">
                {product.tagline}
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-5">
                <span className="text-3xl md:text-4xl font-black text-white">
                  {formatPrice(product.price)}
                </span>
                <span className="text-lg text-white/60 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              </div>

              {/* Countdown */}
              {mounted && (
                <div className="flex items-center gap-2 mb-6">
                  <Clock className="w-4 h-4 text-white/70" />
                  <span className="text-xs text-white/70 font-medium mr-2">Endet in:</span>
                  {[
                    { value: time.hours, label: "Std" },
                    { value: time.minutes, label: "Min" },
                    { value: time.seconds, label: "Sek" },
                  ].map((unit, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <span className="inline-flex items-center justify-center min-w-[36px] h-9 px-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-black text-white tabular-nums">
                        {String(unit.value).padStart(2, "0")}
                      </span>
                      {i < 2 && <span className="text-white/50 text-xs font-bold">:</span>}
                    </div>
                  ))}
                </div>
              )}

              {/* CTA */}
              <Link
                href={`/produkt/${product.slug}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[var(--color-danger)] font-bold rounded-xl hover:bg-white/90 transition-colors transition-shadow duration-300 shadow-lg w-fit"
              >
                Jetzt sichern
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Image */}
            <div className="relative flex items-center justify-center p-6 lg:p-0 bg-white/10">
              <div className="relative w-full max-w-[280px] lg:max-w-[320px] aspect-square">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain drop-shadow-2xl"
                  sizes="(max-width: 1024px) 280px, 320px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
