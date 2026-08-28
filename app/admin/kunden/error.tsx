"use client";

import AdminError from "@/components/admin/AdminError";

export default function KundenError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <AdminError
      error={error}
      reset={reset}
      title="Fehler bei den Kunden"
      description="Die Kundenliste konnte nicht geladen werden."
    />
  );
}
