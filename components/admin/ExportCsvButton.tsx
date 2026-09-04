"use client";

import { useState } from "react";
import { Download } from "lucide-react";

interface ExportCsvButtonProps {
  status?: string;
  q?: string;
}

export default function ExportCsvButton({ status, q }: ExportCsvButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (status) params.set("status", status);
      if (q) params.set("q", q);

      const res = await fetch(`/api/admin/bestellungen/export?${params.toString()}`);
      if (!res.ok) throw new Error("Export fehlgeschlagen");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Bestellungen_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // Silent fail — user can retry
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 min-h-[44px] border border-[var(--color-border)] rounded-xl text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] transition-colors disabled:opacity-50"
    >
      <Download className="w-4 h-4" />
      {loading ? "Exportiere\u2026" : "CSV Export"}
    </button>
  );
}
