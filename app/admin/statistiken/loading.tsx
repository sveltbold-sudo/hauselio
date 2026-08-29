export default function AdminStatistikenLoading() {
  return (
    <div className="animate-pulse space-y-6" role="status" aria-label="Wird geladen">
      <div className="h-8 w-48 bg-[var(--color-bg-secondary)] rounded" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-[var(--color-border-light)] p-5">
            <div className="h-4 w-24 bg-[var(--color-bg-secondary)] rounded mb-2" />
            <div className="h-6 w-20 bg-[var(--color-bg-secondary)] rounded" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-[var(--color-border-light)] p-5">
        <div className="h-5 w-40 bg-[var(--color-bg-secondary)] rounded mb-4" />
        <div className="h-48 bg-[var(--color-bg-secondary)] rounded" />
      </div>
    </div>
  );
}
