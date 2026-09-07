"use client";

import AdminError from "@/components/admin/AdminError";

export default function AdminTestimonialsError({
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
      title="Fehler bei den Testimonials"
      description="Die Testimonials konnten nicht geladen werden."
    />
  );
}
