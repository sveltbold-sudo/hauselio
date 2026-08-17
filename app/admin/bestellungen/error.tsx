"use client";

import AdminError from "@/components/admin/AdminError";

export default function BestellungenError({
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
      title="Fehler bei den Bestellungen"
      description="Die Bestellungen konnten nicht geladen werden."
    />
  );
}
