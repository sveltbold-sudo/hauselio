"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

interface DeleteProductButtonProps {
  productId: string;
  productName: string;
}

export default function DeleteProductButton({
  productId,
  productName,
}: DeleteProductButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showConfirm && cancelRef.current) {
      cancelRef.current.focus();
    }
  }, [showConfirm]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setShowConfirm(false);
      return;
    }
    if (e.key === "Tab" && dialogRef.current) {
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, []);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/produkte/${productId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Produkt gelöscht!");
        router.refresh();
      } else {
        toast.error("Fehler beim Löschen des Produkts.");
      }
    } catch {
      toast.error("Ein Fehler ist aufgetreten.");
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        aria-label={`${productName} löschen`}
        className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-light)] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {showConfirm && (
        <div
          ref={dialogRef}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
          onClick={(e) => { if (e.target === e.currentTarget) setShowConfirm(false); }}
          onKeyDown={handleKeyDown}
        >
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h3 id="delete-dialog-title" className="text-lg font-bold text-[var(--color-text-primary)] mb-2">
              Produkt löschen?
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6">
              Möchten Sie &ldquo;{productName}&rdquo; wirklich löschen? Diese Aktion kann nicht
              rückgängig gemacht werden.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                ref={cancelRef}
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 border border-[var(--color-border)] rounded-xl text-sm font-medium hover:bg-[var(--color-bg)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
              >
                Abbrechen
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-[var(--color-danger)] text-white rounded-xl text-sm font-medium hover:bg-[var(--color-danger-hover)] transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-danger)]"
              >
                {isDeleting ? "Wird gelöscht…" : "Löschen"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
