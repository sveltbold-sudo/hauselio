"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/Toast";

interface OrderBulkActionsProps {
  selectedIds: string[];
  onClearSelection: () => void;
  onComplete: () => void;
}

export default function OrderBulkActions({ selectedIds, onClearSelection, onComplete }: OrderBulkActionsProps) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  if (selectedIds.length === 0) return null;

  const handleBulkStatus = async (status: string) => {
    setShowStatusMenu(false);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/bestellungen/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds, status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(`${data.count} Bestellungen aktualisiert.`);
      onClearSelection();
      onComplete();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Fehler");
    } finally {
      setLoading(false);
    }
  };

  const statuses = [
    { value: "PAYMENT_CONFIRMED", label: "Bezahlt" },
    { value: "PROCESSING", label: "In Bearbeitung" },
    { value: "SHIPPED", label: "Versendet" },
    { value: "DELIVERED", label: "Geliefert" },
    { value: "CANCELLED", label: "Storniert" },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[var(--color-secondary)] text-white rounded-2xl shadow-2xl px-6 py-4 flex items-center gap-4">
      <span className="text-sm font-semibold">{selectedIds.length} ausgewählt</span>
      <div className="w-px h-6 bg-white/20" />
      <div className="relative">
        <button
          onClick={() => setShowStatusMenu(!showStatusMenu)}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
        >
          Status ändern ▾
        </button>
        {showStatusMenu && (
          <div className="absolute bottom-full mb-2 left-0 bg-white rounded-lg shadow-xl border border-gray-200 py-1 min-w-[160px]">
            {statuses.map((s) => (
              <button
                key={s.value}
                onClick={() => handleBulkStatus(s.value)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <button
        onClick={onClearSelection}
        className="px-3 py-1.5 text-white/60 hover:text-white text-sm font-medium transition-colors"
      >
        Abbrechen
      </button>
    </div>
  );
}
