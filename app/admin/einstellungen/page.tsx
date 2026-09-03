"use client";

import { useEffect, useState, useTransition, useRef } from "react";
import { Save, Building2, Truck, Globe, FileText } from "lucide-react";
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
  companyName: string;
  companyAddress: string;
  vatId: string;
  defaultVatRate: string;
  invoicePrefix: string;
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
    companyName: "",
    companyAddress: "",
    vatId: "",
    defaultVatRate: "19",
    invoicePrefix: "RE",
  });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isDirty = useRef(false);
  const initialSettingsRef = useRef<Settings | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty.current) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  useEffect(() => {
    fetch("/api/admin/einstellungen")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load");
        return r.json();
      })
      .then((data) => {
        if (data.settings) {
          startTransition(() => setSettings(data.settings));
          initialSettingsRef.current = data.settings;
        }
      })
      .catch((err) => { logger.error("Failed to load data", { error: err }); setLoadError(true); })
      .finally(() => setLoading(false));
  }, [startTransition]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (settings.bankIban && !/^[A-Z]{2}\d{2}[\sA-Z0-9]{11,30}$/.test(settings.bankIban)) {
      newErrors.bankIban = "Ungültige IBAN (z.B. DE89 3704 0044 0532 0130 00)";
    }
    if (settings.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.contactEmail)) {
      newErrors.contactEmail = "Ungültige E-Mail-Adresse";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const body = {
        ...settings,
        defaultVatRate: parseFloat(settings.defaultVatRate) || 19,
      };
      const res = await fetch("/api/admin/einstellungen", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Fehler beim Speichern");
      }
      toast.success("Einstellungen gespeichert!");
      isDirty.current = false;
      initialSettingsRef.current = settings;
    } catch {
      toast.error("Fehler beim Speichern.");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof Settings, value: string) => {
    setSettings((prev) => {
      const next = { ...prev, [field]: value };
      isDirty.current = JSON.stringify(next) !== JSON.stringify(initialSettingsRef.current);
      return next;
    });
  };

  if (loading) {
    return <div className="p-8 text-center text-[var(--color-text-muted)]">Laden…</div>;
  }

  if (loadError) {
    return (
      <div className="max-w-3xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Einstellungen</h1>
        </div>
        <div className="bg-[var(--color-danger-light)] text-[var(--color-danger)] p-4 rounded-xl text-sm" role="alert">
          Einstellungen konnten nicht geladen werden. Bitte versuchen Sie es später erneut.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Einstellungen</h1>
        <p className="text-[var(--color-text-secondary)] mt-1">Konfigurieren Sie Ihre Shop-Daten</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Bank Details */}
        <div className="bg-white rounded-xl border border-[var(--color-border-light)] p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-[var(--color-primary)]" aria-hidden="true" />
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
                placeholder="DE89 3704 0044 0532 0130 00"
                className={`w-full px-3 py-3 border rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20 ${errors.bankIban ? "border-[var(--color-danger)]" : "border-[var(--color-border)]"}`}
              />
              {errors.bankIban && <p className="mt-1 text-xs text-[var(--color-danger)]">{errors.bankIban}</p>}
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
            <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center">
              <Globe className="w-5 h-5 text-[var(--color-accent)]" aria-hidden="true" />
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
                className={`w-full px-3 py-3 border rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20 ${errors.contactEmail ? "border-[var(--color-danger)]" : "border-[var(--color-border)]"}`}
              />
              {errors.contactEmail && <p className="mt-1 text-xs text-[var(--color-danger)]">{errors.contactEmail}</p>}
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
              <Truck className="w-5 h-5 text-[var(--color-success)]" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-bold text-[var(--color-text-primary)]">Versandinformationen</h2>
              <p className="text-xs text-[var(--color-text-muted)]">Text f\u00fcr Versandkonditionen</p>
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

        {/* Company & Invoice */}
        <div className="bg-white rounded-xl border border-[var(--color-border-light)] p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-[var(--color-primary)]" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-bold text-[var(--color-text-primary)]">Unternehmen & Rechnung</h2>
              <p className="text-xs text-[var(--color-text-muted)]">Daten f\u00fcr Rechnungen und Impressionen</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Firmenname</label>
              <input
                id="companyName"
                type="text"
                value={settings.companyName}
                onChange={(e) => handleChange("companyName", e.target.value)}
                placeholder="HAUSAURA GmbH"
                className="w-full px-3 py-3 border border-[var(--color-border)] rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20"
              />
            </div>
            <div>
              <label htmlFor="vatId" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">USt-IdNr.</label>
              <input
                id="vatId"
                type="text"
                value={settings.vatId}
                onChange={(e) => handleChange("vatId", e.target.value)}
                placeholder="DE 312 847 609"
                className="w-full px-3 py-3 border border-[var(--color-border)] rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="companyAddress" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Firmenadresse</label>
              <input
                id="companyAddress"
                type="text"
                value={settings.companyAddress}
                onChange={(e) => handleChange("companyAddress", e.target.value)}
                placeholder="Kastanienallee 42, 10435 Berlin"
                className="w-full px-3 py-3 border border-[var(--color-border)] rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20"
              />
            </div>
            <div>
              <label htmlFor="defaultVatRate" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Standard-MwSt-Satz (%)</label>
              <input
                id="defaultVatRate"
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={settings.defaultVatRate}
                onChange={(e) => handleChange("defaultVatRate", e.target.value)}
                className="w-full px-3 py-3 border border-[var(--color-border)] rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20"
              />
            </div>
            <div>
              <label htmlFor="invoicePrefix" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Rechnungspr\u00e4fix</label>
              <input
                id="invoicePrefix"
                type="text"
                maxLength={10}
                value={settings.invoicePrefix}
                onChange={(e) => handleChange("invoicePrefix", e.target.value)}
                placeholder="RE"
                className="w-full px-3 py-3 border border-[var(--color-border)] rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20"
              />
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-[var(--color-accent)] text-white rounded-xl text-sm font-semibold hover:bg-[var(--color-accent-hover)] transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "Speichern…" : "Einstellungen speichern"}
          </button>
        </div>
      </form>
    </div>
  );
}
