"use client";

import { useState } from "react";
import { Trash2, Package, PackageX } from "lucide-react";
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
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[var(--color-secondary)] text-white rounded-2xl shadow-2xl px-6 py-4 flex items-center gap-4 animate-slide-in-right">
      <span className="text-sm font-semibold">{selectedIds.length} ausgewählt</span>
      <div className="w-px h-6 bg-white/20" />
      <button
        onClick={() => handleBulkStock(true)}
        disabled={loading}
        className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
      >
        <Package className="w-4 h-4" /> Verfügbar
      </button>
      <button
        onClick={() => handleBulkStock(false)}
        disabled={loading}
        className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
      >
        <PackageX className="w-4 h-4" /> Nicht verfügbar
      </button>
      <button
        onClick={handleBulkDelete}
        disabled={loading}
        className="flex items-center gap-2 px-3 py-1.5 bg-red-500/80 hover:bg-red-500 rounded-lg text-sm font-medium transition-colors"
      >
        <Trash2 className="w-4 h-4" /> Löschen
      </button>
      <button
        onClick={onClearSelection}
        className="px-3 py-1.5 text-white/60 hover:text-white text-sm font-medium transition-colors"
      >
        Abbrechen
      </button>
    </div>
  );
}
