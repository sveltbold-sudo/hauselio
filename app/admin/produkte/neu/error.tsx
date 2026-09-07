"use client";

import AdminError from "@/components/admin/AdminError";

export default function AdminProduktNeuError({
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
      title="Fehler beim Hinzufügen"
      description="Das Produktformular konnte nicht geladen werden."
    />
  );
}
