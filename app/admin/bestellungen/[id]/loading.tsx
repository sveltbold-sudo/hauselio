export default function AdminOrderDetailLoading() {
  return (
    <div className="animate-pulse space-y-6" role="status" aria-label="Wird geladen">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 bg-[var(--color-bg-secondary)] rounded" />
        <div className="h-8 w-64 bg-[var(--color-bg-secondary)] rounded" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-[var(--color-border-light)] p-6">
            <div className="h-5 w-40 bg-[var(--color-bg-secondary)] rounded mb-4" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-3 border-t border-[var(--color-border-light)]">
                <div className="h-12 w-12 bg-[var(--color-bg-secondary)] rounded" />
                <div className="flex-1">
                  <div className="h-4 w-48 bg-[var(--color-bg-secondary)] rounded mb-1" />
                  <div className="h-3 w-24 bg-[var(--color-bg-secondary)] rounded" />
                </div>
                <div className="h-4 w-20 bg-[var(--color-bg-secondary)] rounded" />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-[var(--color-border-light)] p-6">
            <div className="h-5 w-32 bg-[var(--color-bg-secondary)] rounded mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-4 w-full bg-[var(--color-bg-secondary)] rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
