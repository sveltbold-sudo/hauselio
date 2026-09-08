"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

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
        const data = await res.json().catch(() => null);
        toast.error(data?.error || "Fehler beim Löschen des Produkts.");
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
        className="p-2.5 min-w-[44px] min-h-[44px] text-[var(--color-text-muted)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-light)] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      <ConfirmDialog
        open={showConfirm}
        title="Produkt löschen?"
        message={`Möchten Sie "${productName}" wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.`}
        confirmLabel={isDeleting ? "Wird gelöscht…" : "Löschen"}
        danger
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
