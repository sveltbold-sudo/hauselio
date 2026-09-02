"use client";

import { ArrowUp } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function ScrollToTop() {
  const prefersReduced = useReducedMotion();

  return (
    <button
      type="button"
      onClick={() => {
        window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
      }}
      aria-label="Nach oben scrollen"
      className="flex items-center gap-2 px-3 py-2.5 min-h-[44px] text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors duration-300 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
    >
      Nach oben
      <ArrowUp className={`w-4 h-4 transition-transform duration-300 ${prefersReduced ? "" : "group-hover:-translate-y-1"}`} />
    </button>
  );
}
