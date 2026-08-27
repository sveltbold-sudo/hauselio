"use client";

import { useState } from "react";
import { Truck, Shield, RotateCcw } from "lucide-react";

interface ProductSpec {
  key: string;
  value: string;
}

interface ProductTabsProps {
  description: string;
  specs: ProductSpec[];
}

type TabKey = "description" | "specs" | "shipping";

export default function ProductTabs({ description, specs }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("description");

  return (
    <div className="mt-12 lg:mt-16">
      <div
        role="tablist"
        className="flex overflow-x-auto border-b border-[var(--color-border-light)] scrollbar-hide"
        onKeyDown={(e) => {
          const tabs: TabKey[] = ["description", "specs", "shipping"];
          const currentIndex = tabs.indexOf(activeTab);
          if (e.key === "ArrowRight") {
            e.preventDefault();
            setActiveTab(tabs[(currentIndex + 1) % tabs.length]);
          } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            setActiveTab(tabs[(currentIndex - 1 + tabs.length) % tabs.length]);
          }
        }}
      >
        {[
          { key: "description" as const, label: "Beschreibung" },
          { key: "specs" as const, label: "Technische Daten" },
          { key: "shipping" as const, label: "Versand & Zahlung" },
        ].map((tab) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={activeTab === tab.key}
            aria-controls={`tabpanel-${tab.key}`}
            id={`tab-${tab.key}`}
            tabIndex={activeTab === tab.key ? 0 : -1}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-3.5 text-sm font-semibold border-b-2 transition-[border-color,color] duration-200 whitespace-nowrap ${
              activeTab === tab.key
                ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                : "border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`tabpanel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
        className="py-8"
      >
        {activeTab === "description" && (
          <div className="max-w-3xl">
            <p className="text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-line">
              {description}
            </p>
          </div>
        )}

        {activeTab === "specs" && (
          <div className="max-w-3xl">
            {specs.length > 0 ? (
              <div className="bg-white rounded-2xl border border-[var(--color-border-light)] overflow-hidden">
                {specs.map((spec, i) => (
                  <div
                    key={spec.key}
                    className={`flex items-center px-5 py-3.5 ${
                      i % 2 === 0 ? "spec-row-even" : "spec-row-odd"
                    } ${i < specs.length - 1 ? "border-b border-[var(--color-border-light)]" : ""}`}
                  >
                    <span className="min-w-[100px] max-w-[40%] text-sm font-semibold text-[var(--color-text-primary)] break-words">
                      {spec.key}
                    </span>
                    <span className="min-w-0 flex-1 text-sm text-[var(--color-text-secondary)] break-words">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[var(--color-text-muted)]">
                Keine technischen Daten verfügbar.
              </p>
            )}
          </div>
        )}

        {activeTab === "shipping" && (
          <div className="max-w-3xl space-y-6">
            <div className="bg-white rounded-2xl border border-[var(--color-border-light)] p-6">
              <h3 className="font-bold text-[var(--color-text-primary)] mb-2 flex items-center gap-2">
                <Truck className="w-4 h-4 text-[var(--color-primary)]" />
                Versand
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                Kostenloser Versand innerhalb Deutschlands ab einem
                Bestellwert von 50€. Unterhalb dieses Bestellwerts betragen
                die Versandkosten 4,99€.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-[var(--color-border-light)] p-6">
              <h3 className="font-bold text-[var(--color-text-primary)] mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-[var(--color-primary)]" />
                Zahlung
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                Die Zahlung erfolgt ausschließlich per Überweisung (SEPA). Nach
                Ihrer Bestellung erhalten Sie eine E-Mail mit den
                Bankverbindungen.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-[var(--color-border-light)] p-6">
              <h3 className="font-bold text-[var(--color-text-primary)] mb-2 flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[var(--color-primary)]" />
                Lieferzeit
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                Die Lieferzeit beträgt in der Regel 2-5 Werktage nach Eingang
                der Zahlung.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
