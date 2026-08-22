import { Zap, Check } from "lucide-react";

export default function ProductPaymentInfo() {
  return (
    <div className="bg-[var(--color-bg-secondary)] rounded-xl p-4 text-xs text-[var(--color-text-muted)] space-y-1.5">
      <div className="flex items-center gap-2">
        <Zap className="w-3.5 h-3.5 text-[var(--color-accent)]" />
        <span>Sichere Bezahlung per Überweisung (SEPA)</span>
      </div>
      <div className="flex items-center gap-2">
        <Check className="w-3.5 h-3.5 text-[var(--color-success)]" />
        <span>Artikel geprüft und versandfertig</span>
      </div>
    </div>
  );
}
