"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MobileHorizontalScrollProps {
  children: React.ReactNode;
  className?: string;
  autoScrollInterval?: number;
}

export default function MobileHorizontalScroll({
  children,
  className = "",
  autoScrollInterval = 8000,
}: MobileHorizontalScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
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
    const cardWidth = el.children[0]?.getBoundingClientRect().width || 280;
    const gap = 16;
    const isAtEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 10;

    if (isAtEnd) {
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      el.scrollBy({ left: cardWidth + gap, behavior: "smooth" });
    }
  }, [isPaused]);

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
    const cardWidth = el.children[0]?.getBoundingClientRect().width || 280;
    el.scrollBy({
      left: direction === "left" ? -cardWidth - 16 : cardWidth + 16,
      behavior: "smooth",
    });
    setIsPaused(true);
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => setIsPaused(false), 5000);
  };

  return (
    <div
      className={`relative ${className}`}
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
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 -mx-5 px-5"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>

      {/* Nav arrows */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-primary)] shadow-md border border-[var(--color-border-light)] z-20 active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
          aria-label="Zurück"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-primary)] shadow-md border border-[var(--color-border-light)] z-20 active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
          aria-label="Weiter"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {/* Auto-scroll indicator */}
      {!isPaused && autoScrollInterval > 0 && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-[var(--color-border-light)] rounded-full overflow-hidden z-10">
          <div className="h-full bg-[var(--color-primary)]/40 rounded-full animate-[shrink_8s_linear_infinite]" />
        </div>
      )}
    </div>
  );
}
