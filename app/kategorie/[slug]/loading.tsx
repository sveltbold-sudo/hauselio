export default function CategoryLoading() {
  return (
    <div className="container-hausaura py-8" role="status" aria-label="Wird geladen">
      <div className="mb-10 animate-pulse">
        <div className="h-4 w-20 bg-[var(--color-border-light)] rounded mb-3" />
        <div className="h-10 w-64 bg-[var(--color-border-light)] rounded mb-2" />
        <div className="h-5 w-96 bg-[var(--color-bg-secondary)] rounded" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-[var(--color-border-light)] overflow-hidden animate-pulse">
            <div className="aspect-square bg-[var(--color-bg-secondary)]" />
            <div className="p-5 space-y-3">
              <div className="h-3 bg-[var(--color-bg-secondary)] rounded w-1/3" />
              <div className="h-4 bg-[var(--color-bg-secondary)] rounded w-3/4" />
              <div className="h-3 bg-[var(--color-bg-secondary)] rounded w-1/2" />
              <div className="h-5 bg-[var(--color-bg-secondary)] rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
