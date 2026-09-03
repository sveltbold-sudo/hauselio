export default function ProductDetailSkeleton() {
  return (
    <div className="container-hausaura py-8" role="status" aria-label="Wird geladen">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2 mb-8">
        <div className="h-3 bg-[var(--color-bg-secondary)] rounded w-16" />
        <div className="h-3 bg-[var(--color-bg-secondary)] rounded w-1" />
        <div className="h-3 bg-[var(--color-bg-secondary)] rounded w-24" />
        <div className="h-3 bg-[var(--color-bg-secondary)] rounded w-1" />
        <div className="h-3 bg-[var(--color-bg-secondary)] rounded w-32" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Image skeleton */}
        <div className="animate-pulse">
          <div className="aspect-square bg-[var(--color-bg-secondary)] rounded-2xl" />
          <div className="flex gap-2 mt-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-20 h-20 bg-[var(--color-bg-secondary)] rounded-xl" />
            ))}
          </div>
        </div>

        {/* Info skeleton */}
        <div className="space-y-6 animate-pulse">
          <div>
            <div className="h-4 bg-[var(--color-bg-secondary)] rounded w-24 mb-3" />
            <div className="h-8 bg-[var(--color-bg-secondary)] rounded w-3/4 mb-3" />
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-4 h-4 bg-[var(--color-bg-secondary)] rounded" />
                ))}
              </div>
              <div className="h-4 bg-[var(--color-bg-secondary)] rounded w-16" />
            </div>
          </div>

          <div className="h-px bg-[var(--color-bg-secondary)]" />

          <div>
            <div className="h-10 bg-[var(--color-bg-secondary)] rounded w-32 mb-2" />
            <div className="h-4 bg-[var(--color-bg-secondary)] rounded w-48" />
          </div>

          <div className="h-px bg-[var(--color-bg-secondary)]" />

          <div className="space-y-3">
            <div className="h-14 bg-[var(--color-bg-secondary)] rounded-xl" />
            <div className="flex gap-2">
              <div className="h-12 bg-[var(--color-bg-secondary)] rounded-xl flex-1" />
              <div className="h-12 bg-[var(--color-bg-secondary)] rounded-xl w-12" />
            </div>
          </div>

          <div className="h-px bg-[var(--color-bg-secondary)]" />

          <div className="bg-[var(--color-bg-secondary)] rounded-xl p-4 space-y-2">
            <div className="h-3 bg-white/50 rounded w-3/4" />
            <div className="h-3 bg-white/50 rounded w-1/2" />
          </div>
        </div>
      </div>

      {/* Tabs skeleton */}
      <div className="mt-12 lg:mt-16 animate-pulse">
        <div className="flex gap-4 border-b border-[var(--color-border-light)] mb-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-10 bg-[var(--color-bg-secondary)] rounded w-24" />
          ))}
        </div>
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-4 bg-[var(--color-bg-secondary)] rounded" style={{ width: `${90 - i * 10}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
