"use client";

import { useState } from "react";
import { Trash2, Package, PackageX, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

interface BulkActionsProps {
  selectedIds: string[];
  onClearSelection: () => void;
  onComplete: () => void;
}

export default function BulkActions({ selectedIds, onClearSelection, onComplete }: BulkActionsProps) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  if (selectedIds.length === 0) return null;

  const handleBulkDelete = async () => {
    if (!confirm(`${selectedIds.length} Produkte wirklich löschen?`)) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/produkte/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", ids: selectedIds }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(`${data.count} Produkte gelöscht.`);
      onClearSelection();
      onComplete();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Fehler");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkStock = async (inStock: boolean) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/produkte/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateStock", ids: selectedIds, inStock }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(`${data.count} Produkte aktualisiert.`);
      onClearSelection();
      onComplete();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Fehler");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[var(--color-secondary)] text-white rounded-2xl shadow-[var(--shadow-2xl)] px-4 sm:px-6 py-3 sm:py-4 flex flex-wrap items-center justify-center gap-2 sm:gap-4 animate-slide-in-right max-w-[calc(100vw-2rem)]">
      <span className="text-sm font-semibold">{selectedIds.length} ausgewählt</span>
      <div className="w-px h-6 bg-white/20 hidden sm:block" />
      <button
        onClick={() => handleBulkStock(true)}
        disabled={loading}
        aria-label="Alle ausgewählten als verfügbar markieren"
        className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs sm:text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Package className="w-4 h-4" />} <span className="hidden sm:inline">Verfügbar</span>
      </button>
      <button
        onClick={() => handleBulkStock(false)}
        disabled={loading}
        aria-label="Alle ausgewählten als nicht verfügbar markieren"
        className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs sm:text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <PackageX className="w-4 h-4" />} <span className="hidden sm:inline">Nicht verfügbar</span>
      </button>
      <button
        onClick={handleBulkDelete}
        disabled={loading}
        aria-label="Alle ausgewählten löschen"
        className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 bg-[var(--color-danger)]/80 hover:bg-[var(--color-danger-hover)] rounded-lg text-xs sm:text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} Löschen
      </button>
      <button
        onClick={onClearSelection}
        aria-label="Auswahl abbrechen"
        className="px-2.5 sm:px-3 py-1.5 text-white/60 hover:text-white text-xs sm:text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
      >
        Abbrechen
      </button>
    </div>
  );
}
