import { Truck, Shield, RotateCcw } from "lucide-react";

export default function ProductTrustBadges() {
  return (
    <div className="grid grid-cols-3 gap-3 p-4 bg-[var(--color-bg-secondary)] rounded-xl mb-5">
      <div className="flex flex-col items-center gap-1.5 text-center">
        <Truck className="w-5 h-5 text-[var(--color-success)]" aria-hidden="true" />
        <span className="text-xs font-semibold text-[var(--color-text-primary)]">Kostenloser Versand</span>
      </div>
      <div className="flex flex-col items-center gap-1.5 text-center">
        <RotateCcw className="w-5 h-5 text-[var(--color-success)]" aria-hidden="true" />
        <span className="text-xs font-semibold text-[var(--color-text-primary)]">30 Tage Rückgabe</span>
      </div>
      <div className="flex flex-col items-center gap-1.5 text-center">
        <Shield className="w-5 h-5 text-[var(--color-success)]" aria-hidden="true" />
        <span className="text-xs font-semibold text-[var(--color-text-primary)]">Garantie bis 5 J.</span>
      </div>
    </div>
  );
}
