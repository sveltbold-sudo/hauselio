export default function AdminKategorienLoading() {
  return (
    <div className="animate-pulse space-y-6" role="status" aria-label="Wird geladen">
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 bg-[var(--color-bg-secondary)] rounded" />
        <div className="h-10 w-32 bg-[var(--color-bg-secondary)] rounded" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-[var(--color-border-light)] p-5">
            <div className="h-5 w-32 bg-[var(--color-bg-secondary)] rounded mb-2" />
            <div className="h-4 w-48 bg-[var(--color-bg-secondary)] rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
