"use client";

import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Nach oben scrollen"
      className="flex items-center gap-2 px-3 py-2.5 min-h-[44px] text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors duration-300 group"
    >
      Nach oben
      <ArrowUp className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-1" />
    </button>
  );
}
