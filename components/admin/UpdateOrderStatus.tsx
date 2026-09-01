"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import { VALID_ORDER_TRANSITIONS, ORDER_STATUS_LABELS } from "@/lib/admin-constants";

interface UpdateOrderStatusProps {
  orderId: string;
  currentStatus: string;
}

export default function UpdateOrderStatus({
  orderId,
  currentStatus,
}: UpdateOrderStatusProps) {
  const [status, setStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const allowedStatuses = VALID_ORDER_TRANSITIONS[currentStatus] ?? [];

  const statusOptions = allowedStatuses.map((value) => ({
    value,
    label: ORDER_STATUS_LABELS[value] ?? value,
  }));

  const handleUpdate = async () => {
    if (status === "CANCELLED" && currentStatus !== "CANCELLED" && !confirm("Bestellung wirklich stornieren? Dies kann nicht rückgängig gemacht werden.")) {
      return;
    }
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
        const data = await res.json().catch(() => null);
        toast.error(data?.error || "Fehler beim Aktualisieren des Status.");
      }
    } catch {
      toast.error("Ein Fehler ist aufgetreten.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {statusOptions.length > 0 ? (
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          aria-label="Bestellstatus"
          className="px-3 py-2 border border-[var(--color-border)] rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <span className="px-3 py-2 text-sm text-[var(--color-text-muted)] bg-[var(--color-bg-secondary)] rounded-xl">
          Keine weiteren Status moeglich
        </span>
      )}
      <button
        onClick={handleUpdate}
        disabled={isUpdating || status === currentStatus || statusOptions.length === 0}
        className="px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-accent-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
      >
        {isUpdating ? "Wird aktualisiert..." : "Aktualisieren"}
      </button>
    </div>
  );
}
