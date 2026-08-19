"use client";

import { useState } from "react";
import { Bell, Check } from "lucide-react";
import Button from "@/components/ui/Button";

interface OutOfStockNotificationProps {
  productName: string;
}

export default function OutOfStockNotification({ productName }: OutOfStockNotificationProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // In production, this would send to an API endpoint
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-2 p-3 bg-[var(--color-success-light)] rounded-xl text-sm text-[var(--color-success)]">
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
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ihre@email.de"
          required
          className="flex-1 px-3 py-2 text-sm border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
        />
        <Button type="submit" size="sm">
          Benachrichtigen
        </Button>
      </form>
    </div>
  );
}
