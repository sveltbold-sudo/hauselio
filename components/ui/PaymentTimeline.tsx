"use client";

import { Check, Clock, CreditCard, Truck, Package } from "lucide-react";

interface PaymentTimelineProps {
  currentStep: "ordered" | "payment-pending" | "payment-received" | "shipped" | "delivered";
}

const steps = [
  { key: "ordered", label: "Bestellung", icon: Check, description: "Erfolgreich aufgegeben" },
  { key: "payment-pending", label: "Zahlung", icon: CreditCard, description: "Überweisung ausstehend" },
  { key: "payment-received", label: "Eingang", icon: Package, description: "Zahlungseingang bestätigt" },
  { key: "shipped", label: "Versand", icon: Truck, description: "Paket unterwegs" },
  { key: "delivered", label: "Lieferung", icon: Package, description: "Zugestellt" },
] as const;

export default function PaymentTimeline({ currentStep }: PaymentTimelineProps) {
  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <div className="w-full">
      {/* Desktop: horizontal */}
      <div className="hidden sm:flex items-start justify-between relative">
        {/* Connector line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-[var(--color-border)]" />
        <div
          className="absolute top-5 left-0 h-0.5 bg-[var(--color-success)] transition-all duration-500"
          style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, i) => {
          const isCompleted = i < currentIndex;
          const isCurrent = i === currentIndex;
          const Icon = step.icon;

          return (
            <div key={step.key} className="flex flex-col items-center relative z-10 flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isCompleted
                    ? "bg-[var(--color-success)] border-[var(--color-success)] text-white"
                    : isCurrent
                    ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/30"
                    : "bg-white border-[var(--color-border)] text-[var(--color-text-muted)]"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <p className={`text-xs font-semibold mt-2 text-center ${isCurrent ? "text-[var(--color-primary)]" : isCompleted ? "text-[var(--color-success)]" : "text-[var(--color-text-muted)]"}`}>
                {step.label}
              </p>
              <p className="text-[10px] text-[var(--color-text-muted)] text-center mt-0.5">
                {step.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Mobile: vertical */}
      <div className="sm:hidden space-y-0">
        {steps.map((step, i) => {
          const isCompleted = i < currentIndex;
          const isCurrent = i === currentIndex;
          const Icon = step.icon;
          const isLast = i === steps.length - 1;

          return (
            <div key={step.key} className="flex gap-3">
              {/* Icon + line */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 shrink-0 ${
                    isCompleted
                      ? "bg-[var(--color-success)] border-[var(--color-success)] text-white"
                      : isCurrent
                      ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white"
                      : "bg-white border-[var(--color-border)] text-[var(--color-text-muted)]"
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                {!isLast && (
                  <div className={`w-0.5 flex-1 min-h-[24px] ${isCompleted ? "bg-[var(--color-success)]" : "bg-[var(--color-border)]"}`} />
                )}
              </div>
              {/* Text */}
              <div className={`pb-4 ${!isCurrent && !isCompleted ? "opacity-50" : ""}`}>
                <p className={`text-sm font-semibold ${isCurrent ? "text-[var(--color-primary)]" : isCompleted ? "text-[var(--color-success)]" : "text-[var(--color-text-muted)]"}`}>
                  {step.label}
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
