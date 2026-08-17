"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function BestellungenError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[HAUSELIO] Bestellungen error:", error);
  }, [error]);

  return (
    <div className="p-8 text-center">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
        <AlertTriangle className="w-8 h-8 text-red-500" />
      </div>
      <h2 className="text-lg font-bold text-gray-900 mb-2">Fehler bei den Bestellungen</h2>
      <p className="text-gray-500 mb-6">Die Bestellungen konnten nicht geladen werden.</p>
      <div className="flex gap-3 justify-center">
        <button onClick={() => reset()} className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
          Erneut versuchen
        </button>
        <Link href="/admin" className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
          Dashboard
        </Link>
      </div>
    </div>
  );
}
