"use client";

import AdminError from "@/components/admin/AdminError";

export default function ProdukteError({
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
      title="Fehler bei den Produkten"
      description="Die Produktliste konnte nicht geladen werden."
    />
  );
}
