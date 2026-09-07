"use client";

import AdminError from "@/components/admin/AdminError";

export default function AdminCouponsError({
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
      title="Fehler bei den Coupons"
      description="Die Coupons konnten nicht geladen werden."
    />
  );
}
