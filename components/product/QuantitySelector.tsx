"use client";

import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  onChange: (q: number) => void;
}

export default function QuantitySelector({ quantity, onChange }: QuantitySelectorProps) {
  return (
    <div className="flex items-center border border-[var(--color-border-light)] rounded-xl bg-[var(--color-bg-secondary)]" role="group" aria-label="Artikelmenge">
      <button
        onClick={() => onChange(Math.max(1, quantity - 1))}
        aria-label="Menge verringern"
        className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors rounded-l-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
      >
        <Minus className="w-4 h-4" />
      </button>
      <input
        type="number"
        min={1}
        max={99}
        value={quantity}
        onChange={(e) => {
          const v = parseInt(e.target.value, 10);
          if (!isNaN(v) && v >= 1 && v <= 99) onChange(v);
        }}
        className="px-3 sm:px-4 py-2.5 sm:py-3 font-bold tabular-nums min-w-[48px] text-center text-sm bg-transparent border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-lg [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        aria-label="Artikelmenge"
        aria-valuenow={quantity}
        aria-valuemin={1}
        aria-valuemax={99}
      />
      <button
        onClick={() => onChange(Math.min(99, quantity + 1))}
        aria-label="Menge erhöhen"
        className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors rounded-r-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
