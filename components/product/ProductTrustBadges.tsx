import { Truck, Shield, RotateCcw } from "lucide-react";

export default function ProductTrustBadges() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-[var(--color-bg-secondary)] rounded-xl mb-5">
      <button
        type="button"
        onClick={() => document.getElementById("tab-shipping")?.click()}
        className="flex flex-col items-center gap-1.5 text-center group min-h-[44px] py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-xl"
      >
        <Truck className="w-5 h-5 text-[var(--color-success)]" aria-hidden="true" />
        <span className="text-xs font-semibold text-[var(--color-text-primary)]">Versand gratis ab 50€</span>
      </button>
      <button
        type="button"
        onClick={() => document.getElementById("tab-shipping")?.click()}
        className="flex flex-col items-center gap-1.5 text-center group min-h-[44px] py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-xl"
      >
        <RotateCcw className="w-5 h-5 text-[var(--color-success)]" aria-hidden="true" />
        <span className="text-xs font-semibold text-[var(--color-text-primary)]">30 Tage Rückgabe</span>
      </button>
      <button
        type="button"
        onClick={() => document.getElementById("tab-shipping")?.click()}
        className="flex flex-col items-center gap-1.5 text-center group min-h-[44px] py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-xl"
      >
        <Shield className="w-5 h-5 text-[var(--color-success)]" aria-hidden="true" />
        <span className="text-xs font-semibold text-[var(--color-text-primary)]">Garantie bis 5 J.</span>
      </button>
    </div>
  );
}
