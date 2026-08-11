"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";

interface UpdateOrderStatusProps {
  orderId: string;
  currentStatus: string;
}

const statusOptions = [
  { value: "PENDING_PAYMENT", label: "Ausstehend" },
  { value: "PAYMENT_CONFIRMED", label: "Zahlung bestätigt" },
  { value: "PROCESSING", label: "In Bearbeitung" },
  { value: "SHIPPED", label: "Versendet" },
  { value: "DELIVERED", label: "Geliefert" },
  { value: "CANCELLED", label: "Storniert" },
];

export default function UpdateOrderStatus({
  orderId,
  currentStatus,
}: UpdateOrderStatusProps) {
  const [status, setStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/bestellungen/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        toast.success("Status aktualisiert!");
        router.refresh();
      } else {
        toast.error("Fehler beim Aktualisieren des Status.");
      }
    } catch {
      toast.error("Ein Fehler ist aufgetreten.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)]"
      >
        {statusOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <button
        onClick={handleUpdate}
        disabled={isUpdating || status === currentStatus}
        className="px-4 py-2 bg-[var(--color-orange)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-orange-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isUpdating ? "..." : "Aktualisieren"}
      </button>
    </div>
  );
}
