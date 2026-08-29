export default function AdminNewsletterLoading() {
  return (
    <div className="animate-pulse space-y-6" role="status" aria-label="Wird geladen">
      <div className="h-8 w-48 bg-[var(--color-bg-secondary)] rounded" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-[var(--color-border-light)] p-5">
            <div className="h-4 w-24 bg-[var(--color-bg-secondary)] rounded mb-2" />
            <div className="h-6 w-16 bg-[var(--color-bg-secondary)] rounded" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-[var(--color-border-light)] p-5">
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-4 w-40 bg-[var(--color-bg-secondary)] rounded" />
              <div className="h-4 flex-1 bg-[var(--color-bg-secondary)] rounded" />
              <div className="h-4 w-20 bg-[var(--color-bg-secondary)] rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
