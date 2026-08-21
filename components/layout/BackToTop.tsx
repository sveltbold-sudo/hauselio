"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  const scrollToTop = () => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-40 w-12 h-12 bg-[var(--color-primary)] text-white rounded-full shadow-lg hover:bg-[var(--color-primary-hover)] transition-colors transition-transform duration-300 flex items-center justify-center animate-fade-in-up hover:scale-110"
      aria-label="Nach oben scrollen"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}
