"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

interface ResendReceiptButtonProps {
  orderId: string;
}

export default function ResendReceiptButton({ orderId }: ResendReceiptButtonProps) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    if (!confirm("Zahlungsbest\u00e4tigung erneut senden?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/bestellungen/${orderId}/resend-receipt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Fehler beim Senden");
      }
      toast.success("Zahlungsbest\u00e4tigung erneut gesendet!");
    } catch {
      toast.error("Fehler beim Senden der Zahlungsbest\u00e4tigung.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleResend}
      disabled={loading}
      className="flex items-center gap-2 text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium transition-colors disabled:opacity-50"
    >
      <Send className="w-4 h-4" />
      {loading ? "Sende\u2026" : "Zahlungsbest\u00e4tigung erneut senden"}
    </button>
  );
}
