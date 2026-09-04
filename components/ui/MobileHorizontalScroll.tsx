"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface MobileHorizontalScrollProps {
  children: React.ReactNode;
  className?: string;
  autoScrollInterval?: number;
}

export default function MobileHorizontalScroll({
  children,
  className = "",
  autoScrollInterval = 7000,
}: MobileHorizontalScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const scrollToNext = useCallback(() => {
    const el = scrollRef.current;
    if (!el || isPaused) return;
    const isAtEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 10;

    if (isAtEnd) {
      el.scrollTo({ left: 0, behavior: prefersReduced ? "auto" : "smooth" });
    } else {
      const items = Array.from(el.children) as HTMLElement[];
      const currentScroll = el.scrollLeft + el.clientWidth / 2;
      let nextIndex = 0;
      for (let i = 0; i < items.length; i++) {
        const item = items[i]!;
        const itemCenter = item.offsetLeft + item.offsetWidth / 2;
        if (itemCenter > currentScroll + 5) {
          nextIndex = i;
          break;
        }
      }
      const target = items[nextIndex];
      if (target) {
        const targetLeft = target.offsetLeft - (el.clientWidth - target.offsetWidth) / 2;
        el.scrollTo({ left: targetLeft, behavior: prefersReduced ? "auto" : "smooth" });
      }
    }
  }, [isPaused, prefersReduced]);

  useEffect(() => {
    if (autoScrollInterval <= 0) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    autoScrollRef.current = setInterval(scrollToNext, autoScrollInterval);
    return () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    };
  }, [scrollToNext, autoScrollInterval]);

  const handleTouchStart = () => setIsPaused(true);
  const handleTouchEnd = () => {
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => setIsPaused(false), 3000);
  };

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const items = Array.from(el.children) as HTMLElement[];
    const currentScroll = el.scrollLeft + el.clientWidth / 2;

    let targetIndex = direction === "right" ? items.length - 1 : 0;
    for (let i = 0; i < items.length; i++) {
      const item = items[i]!;
      const itemCenter = item.offsetLeft + item.offsetWidth / 2;
      if (direction === "right" && itemCenter > currentScroll + 5) {
        targetIndex = i;
        break;
      }
      if (direction === "left" && itemCenter >= currentScroll - 5 && i > 0) {
        targetIndex = i - 1;
        break;
      }
    }
    const target = items[targetIndex];
    if (target) {
      const targetLeft = target.offsetLeft - (el.clientWidth - target.offsetWidth) / 2;
      el.scrollTo({ left: targetLeft, behavior: prefersReduced ? "auto" : "smooth" });
    }
    setIsPaused(true);
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => setIsPaused(false), 5000);
  };

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Scroll hints */}
      {canScrollLeft && (
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      )}
      {canScrollRight && (
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
      )}

      {/* Scroll container */}
      <div
        ref={scrollRef}
        role="region"
        aria-label="Horizontale Produktauswahl"
        tabIndex={0}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-snap-center pb-2 pl-[calc(50vw-9rem)] pr-4 focus:outline-none"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none", scrollPaddingInline: "0" }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>

      {/* Nav arrows */}
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scroll("left")}
          className="absolute left-1 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-primary)] shadow-md border border-[var(--color-border-light)] z-20 active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
          aria-label="Zurück"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}
      {canScrollRight && (
        <button
          type="button"
          onClick={() => scroll("right")}
          className="absolute right-1 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-primary)] shadow-md border border-[var(--color-border-light)] z-20 active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
          aria-label="Weiter"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {/* Auto-scroll indicator */}
      {!isPaused && autoScrollInterval > 0 && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-[var(--color-border-light)] rounded-full overflow-hidden z-10">
          <div className={`h-full bg-[var(--color-primary)]/40 rounded-full ${prefersReduced ? "" : "animate-[shrink_7s_linear_infinite]"}`} />
        </div>
      )}
    </div>
  );
}
