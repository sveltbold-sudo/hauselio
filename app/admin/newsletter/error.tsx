"use client";

import AdminError from "@/components/admin/AdminError";

export default function NewsletterError({
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
      title="Fehler beim Newsletter"
      description="Die Newsletter-Übersicht konnte nicht geladen werden."
    />
  );
}
