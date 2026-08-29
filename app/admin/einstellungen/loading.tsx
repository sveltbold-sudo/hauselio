export default function AdminEinstellungenLoading() {
  return (
    <div className="animate-pulse space-y-6" role="status" aria-label="Wird geladen">
      <div className="h-8 w-48 bg-[var(--color-bg-secondary)] rounded" />
      <div className="bg-white rounded-xl border border-[var(--color-border-light)] p-6 space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-4 w-32 bg-[var(--color-bg-secondary)] rounded" />
            <div className="h-10 flex-1 bg-[var(--color-bg-secondary)] rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
