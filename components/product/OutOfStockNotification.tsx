"use client";

import { useState } from "react";
import { Bell, Check, AlertCircle } from "lucide-react";
import Button from "@/components/ui/Button";

interface OutOfStockNotificationProps {
  productName: string;
}

export default function OutOfStockNotification({ productName }: OutOfStockNotificationProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/out-of-stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("API error");
      setSubmitted(true);
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (error) {
    return (
      <div role="alert" className="flex items-center gap-2 px-4 py-3 bg-[var(--color-danger)]/5 border border-[var(--color-danger)]/20 rounded-xl text-sm text-[var(--color-danger)]">
        <AlertCircle className="w-4 h-4" />
        <span>Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.</span>
      </div>
    );
  }

  if (submitted) {
    return (
      <div role="status" className="flex items-center gap-2 p-3 bg-[var(--color-success-light)] rounded-xl text-sm text-[var(--color-success)]">
        <Check className="w-4 h-4" />
        <span>Sie werden benachrichtigt, sobald <strong>{productName}</strong> wieder verfügbar ist.</span>
      </div>
    );
  }

  return (
    <div className="p-4 bg-[var(--color-bg-secondary)] rounded-xl">
      <div className="flex items-center gap-2 mb-2">
        <Bell className="w-4 h-4 text-[var(--color-primary)]" />
        <span className="text-sm font-semibold text-[var(--color-text-primary)]">Benachrichtigen, wenn verfügbar</span>
      </div>
      <p className="text-xs text-[var(--color-text-muted)] mb-3">
        Tragen Sie Ihre E-Mail ein und erfahren Sie es als Erster, wenn dieses Produkt wieder da ist.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2" aria-label="Benachrichtigung bei Verfügbarkeit">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ihre@email.de"
          aria-label="E-Mail-Adresse für Benachrichtigung"
          autoComplete="email"
          required
          className="flex-1 px-4 py-3 text-sm border border-[var(--color-border)] rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
        />
        <Button type="submit" size="sm" disabled={submitting}>
          {submitting ? "Wird gesendet…" : "Benachrichtigen"}
        </Button>
      </form>
    </div>
  );
}
