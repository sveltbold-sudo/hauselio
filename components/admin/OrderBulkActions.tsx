"use client";

import { useState, useRef, useEffect } from "react";
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
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!showStatusMenu) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowStatusMenu(false);
        buttonRef.current?.focus();
      }
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const items = menuRef.current?.querySelectorAll('[role="menuitem"]') as NodeListOf<HTMLElement>;
        if (!items || items.length === 0) return;
        const current = Array.from(items).findIndex((el) => el === document.activeElement);
        let next: number;
        if (e.key === "ArrowDown") {
          next = current < items.length - 1 ? current + 1 : 0;
        } else {
          next = current > 0 ? current - 1 : items.length - 1;
        }
        items[next].focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showStatusMenu]);

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
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[var(--color-secondary)] text-white rounded-2xl shadow-[var(--shadow-2xl)] px-6 py-4 flex items-center gap-4">
      <span className="text-sm font-semibold">{selectedIds.length} ausgewählt</span>
      <div className="w-px h-6 bg-white/20" />
      <div className="relative">
        <button
          ref={buttonRef}
          onClick={() => setShowStatusMenu(!showStatusMenu)}
          disabled={loading}
          aria-haspopup="menu"
          aria-expanded={showStatusMenu}
          className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
        >
          Status ändern ▾
        </button>
        {showStatusMenu && (
          <div
            ref={menuRef}
            role="menu"
            aria-label="Status auswählen"
            className="absolute bottom-full mb-2 left-0 bg-white rounded-lg shadow-xl border border-[var(--color-border-light)] py-1 min-w-[160px]"
          >
            {statuses.map((s) => (
              <button
                key={s.value}
                role="menuitem"
                onClick={() => handleBulkStatus(s.value)}
                className="w-full text-left px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-primary)]"
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <button
        onClick={onClearSelection}
        aria-label="Auswahl abbrechen"
        className="px-3 py-1.5 text-white/60 hover:text-white text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
      >
        Abbrechen
      </button>
    </div>
  );
}
