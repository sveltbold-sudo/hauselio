"use client";

import { useState } from "react";
import { Save, Truck, FileText } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

interface OrderNotesProps {
  orderId: string;
  initialAdminNotes: string;
  initialTrackingNumber: string;
}

export default function OrderNotes({ orderId, initialAdminNotes, initialTrackingNumber }: OrderNotesProps) {
  const toast = useToast();
  const [adminNotes, setAdminNotes] = useState(initialAdminNotes);
  const [trackingNumber, setTrackingNumber] = useState(initialTrackingNumber);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/bestellungen/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNotes, trackingNumber }),
      });
      if (!res.ok) throw new Error("Fehler beim Speichern");
      toast.success("Notizen gespeichert!");
      setDirty(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Fehler beim Speichern");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[var(--color-border-light)] p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-[var(--color-text-primary)]">
          Notizen & Versand
        </h2>
        <button
          onClick={handleSave}
          disabled={saving || !dirty}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-accent-hover)] transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? "Speichern…" : "Speichern"}
        </button>
      </div>
      <div className="space-y-4">
        <div>
          <label htmlFor="adminNotes" className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
            <FileText className="w-4 h-4 text-[var(--color-text-muted)]" aria-hidden="true" />
            Admin-Notizen
          </label>
          <textarea
            id="adminNotes"
            rows={3}
            value={adminNotes}
            onChange={(e) => { setAdminNotes(e.target.value); setDirty(true); }}
            placeholder="Interne Notizen zu dieser Bestellung…"
            className="w-full px-3 py-3 border border-[var(--color-border)] rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20 resize-y"
          />
        </div>
        <div>
          <label htmlFor="trackingNumber" className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
            <Truck className="w-4 h-4 text-[var(--color-text-muted)]" aria-hidden="true" />
            Tracking-Nummer
          </label>
          <input
            id="trackingNumber"
            type="text"
            value={trackingNumber}
            onChange={(e) => { setTrackingNumber(e.target.value); setDirty(true); }}
            placeholder="z.B. DHL1234567890"
            className="w-full px-3 py-3 border border-[var(--color-border)] rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20"
          />
        </div>
      </div>
    </div>
  );
}
