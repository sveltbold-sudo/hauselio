"use client";

import AdminError from "@/components/admin/AdminError";

export default function StatistikenError({
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
      title="Fehler bei den Statistiken"
      description="Die Statistiken konnten nicht geladen werden."
    />
  );
}
