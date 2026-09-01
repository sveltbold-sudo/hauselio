"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

interface MobileShopBarProps {
  onScrollToTop?: () => void;
}

export default function MobileShopBar({ onScrollToTop }: MobileShopBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-white border-t border-[var(--color-border-light)] shadow-lg animate-slide-up safe-area-bottom" role="complementary" aria-label="Produktübersicht" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={onScrollToTop || (() => {
            const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
          })}
          className="flex items-center gap-2 px-4 py-2.5 min-h-[44px] bg-[var(--color-bg-secondary)] rounded-xl text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-primary)]/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
        >
          <ArrowUp className="w-4 h-4" />
          Nach oben
        </button>


      </div>
    </div>
  );
}
