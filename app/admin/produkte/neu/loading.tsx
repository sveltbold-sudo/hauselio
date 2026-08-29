export default function AdminProductCreateLoading() {
  return (
    <div className="animate-pulse space-y-6" role="status" aria-label="Wird geladen">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 bg-[var(--color-bg-secondary)] rounded" />
        <div className="h-8 w-48 bg-[var(--color-bg-secondary)] rounded" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-[var(--color-border-light)] p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i}>
                <div className="h-4 w-24 bg-[var(--color-bg-secondary)] rounded mb-2" />
                <div className="h-10 w-full bg-[var(--color-bg-secondary)] rounded" />
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[var(--color-border-light)] p-6">
          <div className="h-5 w-32 bg-[var(--color-bg-secondary)] rounded mb-4" />
          <div className="h-40 bg-[var(--color-bg-secondary)] rounded" />
        </div>
      </div>
    </div>
  );
}
