"use client";

import AdminError from "@/components/admin/AdminError";

export default function KategorienError({
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
      title="Fehler bei den Kategorien"
      description="Die Kategorien konnten nicht geladen werden."
    />
  );
}
