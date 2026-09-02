"use client";

import { useState } from "react";
import { RefreshCw, Check, AlertCircle } from "lucide-react";

export default function AlgoliaSyncButton() {
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState<{ indexed: number; errors: number } | null>(null);

  const handleSync = async () => {
    setSyncing(true);
    setResult(null);
    try {
      const res = await fetch("/api/admin/algoliasync", { method: "POST" });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || "Synchronisation fehlgeschlagen");
      }
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ indexed: 0, errors: -1 });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleSync}
        disabled={syncing}
        className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
      >
        <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
        {syncing ? "Synchronisiere…" : "Algolia synchronisieren"}
      </button>
      {result && (
        <span className={`text-sm font-medium flex items-center gap-1 ${
          result.errors === 0 ? "text-[var(--color-success)]" : result.errors === -1 ? "text-[var(--color-danger)]" : "text-[var(--color-accent)]"
        }`}>
          {result.errors === 0 ? (
            <><Check className="w-4 h-4" /> {result.indexed} Produkte synchronisiert</>
          ) : result.errors === -1 ? (
            <><AlertCircle className="w-4 h-4" /> Fehler bei der Synchronisation</>
          ) : (
            <><AlertCircle className="w-4 h-4" /> {result.indexed} ok, {result.errors} Fehler</>
          )}
        </span>
      )}
    </div>
  );
}
