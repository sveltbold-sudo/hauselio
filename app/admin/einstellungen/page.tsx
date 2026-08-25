"use client";

import { useEffect, useState, useTransition } from "react";
import { Save, Building2, Truck, Globe } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

interface Settings {
  bankIban: string;
  bankBic: string;
  bankAccountName: string;
  bankName: string;
  shippingInfo: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
}

export default function EinstellungenPage() {
  const toast = useToast();
  const [settings, setSettings] = useState<Settings>({
    bankIban: "",
    bankBic: "",
    bankAccountName: "",
    bankName: "",
    shippingInfo: "",
    contactEmail: "",
    contactPhone: "",
    contactAddress: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    fetch("/api/admin/einstellungen")
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) startTransition(() => setSettings(data.settings));
      })
      .catch((err) => logger.error("Failed to load data", { error: err }))
      .finally(() => setLoading(false));
  }, [startTransition]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/einstellungen", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("Fehler beim Speichern");
      toast.success("Einstellungen gespeichert!");
    } catch {
      toast.error("Fehler beim Speichern.");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof Settings, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return <main className="p-8 text-center text-[var(--color-text-muted)]">Laden…</main>;
  }

  return (
    <main className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Einstellungen</h1>
        <p className="text-[var(--color-text-secondary)] mt-1">Konfigurieren Sie Ihre Shop-Daten</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Bank Details */}
        <div className="bg-white rounded-xl border border-[var(--color-border-light)] p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-[var(--color-primary)]" />
            </div>
            <div>
              <h2 className="font-bold text-[var(--color-text-primary)]">Bankverbindung</h2>
              <p className="text-xs text-[var(--color-text-muted)]">SEPA-Überweisungsinformationen</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="bankAccountName" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Kontoinhaber</label>
              <input
                id="bankAccountName"
                type="text"
                value={settings.bankAccountName}
                onChange={(e) => handleChange("bankAccountName", e.target.value)}
                className="w-full px-3 py-3 border border-[var(--color-border)] rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20"
              />
            </div>
            <div>
              <label htmlFor="bankName" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Bank</label>
              <input
                id="bankName"
                type="text"
                value={settings.bankName}
                onChange={(e) => handleChange("bankName", e.target.value)}
                className="w-full px-3 py-3 border border-[var(--color-border)] rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20"
              />
            </div>
            <div>
              <label htmlFor="bankIban" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">IBAN</label>
              <input
                id="bankIban"
                type="text"
                value={settings.bankIban}
                onChange={(e) => handleChange("bankIban", e.target.value)}
                className="w-full px-3 py-3 border border-[var(--color-border)] rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20"
              />
            </div>
            <div>
              <label htmlFor="bankBic" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">BIC</label>
              <input
                id="bankBic"
                type="text"
                value={settings.bankBic}
                onChange={(e) => handleChange("bankBic", e.target.value)}
                className="w-full px-3 py-3 border border-[var(--color-border)] rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20"
              />
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-xl border border-[var(--color-border-light)] p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-orange)]/10 flex items-center justify-center">
              <Globe className="w-5 h-5 text-[var(--color-orange)]" />
            </div>
            <div>
              <h2 className="font-bold text-[var(--color-text-primary)]">Kontaktdaten</h2>
              <p className="text-xs text-[var(--color-text-muted)]">Öffentliche Kontaktinformationen</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">E-Mail</label>
              <input
                id="contactEmail"
                type="email"
                value={settings.contactEmail}
                onChange={(e) => handleChange("contactEmail", e.target.value)}
                className="w-full px-3 py-3 border border-[var(--color-border)] rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20"
              />
            </div>
            <div>
              <label htmlFor="contactPhone" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Telefon</label>
              <input
                id="contactPhone"
                type="tel"
                value={settings.contactPhone}
                onChange={(e) => handleChange("contactPhone", e.target.value)}
                className="w-full px-3 py-3 border border-[var(--color-border)] rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="contactAddress" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Adresse</label>
              <input
                id="contactAddress"
                type="text"
                value={settings.contactAddress}
                onChange={(e) => handleChange("contactAddress", e.target.value)}
                className="w-full px-3 py-3 border border-[var(--color-border)] rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20"
              />
            </div>
          </div>
        </div>

        {/* Shipping */}
        <div className="bg-white rounded-xl border border-[var(--color-border-light)] p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-success)]/10 flex items-center justify-center">
              <Truck className="w-5 h-5 text-[var(--color-success)]" />
            </div>
            <div>
              <h2 className="font-bold text-[var(--color-text-primary)]">Versandinformationen</h2>
              <p className="text-xs text-[var(--color-text-muted)]">Text für Versandkonditionen</p>
            </div>
          </div>
          <label htmlFor="shippingInfo" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Versandinformationen</label>
          <textarea
            id="shippingInfo"
            value={settings.shippingInfo}
            onChange={(e) => handleChange("shippingInfo", e.target.value)}
            className="w-full px-3 py-3 border border-[var(--color-border)] rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20"
            rows={3}
          />
        </div>

        {/* Save */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-[var(--color-orange)] text-white rounded-xl text-sm font-semibold hover:bg-[var(--color-orange-hover)] transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "Speichern…" : "Einstellungen speichern"}
          </button>
        </div>
      </form>
    </main>
  );
}
