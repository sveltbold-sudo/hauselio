"use client";

import AdminError from "@/components/admin/AdminError";

export default function EinstellungenError({
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
      title="Fehler bei den Einstellungen"
      description="Die Einstellungen konnten nicht geladen werden."
    />
  );
}
