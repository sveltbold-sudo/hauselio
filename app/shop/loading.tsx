export default function ShopLoading() {
  return (
    <div className="container-hauselio py-8" role="status" aria-label="Wird geladen">
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="h-4 w-24 bg-[var(--color-bg-secondary)] rounded mb-4 animate-pulse" />
        <div className="h-8 w-48 bg-[var(--color-bg-secondary)] rounded animate-pulse" />
      </div>

      {/* Search skeleton */}
      <div className="h-12 bg-[var(--color-bg-secondary)] rounded-xl mb-6 animate-pulse" />

      {/* Tabs skeleton */}
      <div className="flex gap-3 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-10 w-28 bg-[var(--color-bg-secondary)] rounded-xl animate-pulse" />
        ))}
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-[var(--color-border-light)] overflow-hidden animate-pulse">
            <div className="aspect-square bg-[var(--color-bg-secondary)]" />
            <div className="p-4 space-y-2.5">
              <div className="h-2.5 w-16 bg-[var(--color-bg-secondary)] rounded" />
              <div className="h-3.5 w-full bg-[var(--color-bg-secondary)] rounded" />
              <div className="h-3.5 w-3/4 bg-[var(--color-bg-secondary)] rounded" />
              <div className="h-5 w-24 bg-[var(--color-bg-secondary)] rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
