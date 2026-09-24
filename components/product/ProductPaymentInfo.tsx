import { Landmark, Shield, RotateCcw, Lock } from "lucide-react";

const STEPS = [
  "Jetzt bestellen \u2013 per Karte oder \u00dcberweisung",
  "Bei Karte: sofortige Zahlung & schnellster Versand",
  "Bei Vorkasse: Bankdaten per E-Mail & \u00fcberweisen",
];

export default function ProductPaymentInfo() {
  return (
    <div className="rounded-xl border border-[var(--color-primary)]/20 bg-[var(--color-primary-50)] p-4 mb-5">
      <div className="flex items-center gap-2 mb-3">
        <Landmark className="w-4 h-4 text-[var(--color-primary)]" aria-hidden="true" />
        <p className="text-sm font-bold text-[var(--color-text-primary)]">
          Sicher kaufen: Karte oder \u00DCberweisung
        </p>
      </div>
      <ol className="space-y-2 mb-3 list-none">
        {STEPS.map((text, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-[var(--color-text-secondary)]">
            <span className="w-4 h-4 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5" aria-hidden="true">
              {i + 1}
            </span>
            {text}
          </li>
        ))}
      </ol>
      <ul className="space-y-1.5 pt-3 border-t border-[var(--color-primary)]/15 text-xs text-[var(--color-text-muted)] list-none">
        <li className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-[var(--color-success)]" aria-hidden="true" />
          <span>Geld-zur\u00fcck bei Nicht-Lieferung</span>
        </li>
        <li className="flex items-center gap-2">
          <RotateCcw className="w-3.5 h-3.5 text-[var(--color-success)]" aria-hidden="true" />
          <span>30 Tage R\u00fcckgaberecht</span>
        </li>
        <li className="flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-[var(--color-success)]" aria-hidden="true" />
          <span>SSL-verschl\u00fcsselt \u00b7 Keine sensiblen Daten n\u00f6tig</span>
        </li>
      </ul>
    </div>
  );
}
