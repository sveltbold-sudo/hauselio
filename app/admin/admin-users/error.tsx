"use client";

import AdminError from "@/components/admin/AdminError";

export default function AdminUsersError({
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
      title="Fehler bei den Admin-Benutzern"
      description="Die Admin-Benutzer konnten nicht geladen werden."
    />
  );
}
