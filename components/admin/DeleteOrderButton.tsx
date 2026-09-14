"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function DeleteOrderButton({
  orderId,
  orderNumber,
}: {
  orderId: string;
  orderNumber: string;
}) {
  const router = useRouter();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setOpen(false);
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/bestellungen/${orderId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(`Bestellung ${orderNumber} gelöscht.`);
      router.push("/admin/bestellungen");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Fehler beim Löschen");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2.5 min-h-[44px] bg-[var(--color-danger)] hover:bg-[var(--color-danger-hover)] text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
      >
        <Trash2 className="w-4 h-4" />
        Bestellung löschen
      </button>
      <ConfirmDialog
        open={open}
        title={`Bestellung ${orderNumber} löschen`}
        message="Möchten Sie diese Bestellung wirklich dauerhaft löschen? Dies kann nicht rückgängig gemacht werden."
        confirmLabel="Löschen"
        danger
        onConfirm={handleDelete}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
