"use client";

import AdminError from "@/components/admin/AdminError";

export default function BewertungenError({
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
      title="Fehler bei den Bewertungen"
      description="Die Bewertungen konnten nicht geladen werden."
    />
  );
}
