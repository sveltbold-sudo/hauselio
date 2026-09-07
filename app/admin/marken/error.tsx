"use client";

import AdminError from "@/components/admin/AdminError";

export default function AdminMarkenError({
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
      title="Fehler bei den Marken"
      description="Die Marken konnten nicht geladen werden."
    />
  );
}
