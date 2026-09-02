export default function ImpressumLoading() {
  return (
    <div className="container-hausaura py-8" role="status" aria-label="Wird geladen">
      <div className="animate-pulse space-y-6">
        <div className="h-4 w-24 bg-[var(--color-bg-secondary)] rounded" />
        <div className="h-8 w-48 bg-[var(--color-bg-secondary)] rounded" />
        <div className="h-4 w-72 bg-[var(--color-bg-secondary)] rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-[var(--color-border-light)] overflow-hidden">
              <div className="aspect-square bg-[var(--color-bg-secondary)]" />
              <div className="p-4 space-y-2.5">
                <div className="h-2.5 w-16 bg-[var(--color-bg-secondary)] rounded" />
                <div className="h-3.5 w-full bg-[var(--color-bg-secondary)] rounded" />
                <div className="h-5 w-24 bg-[var(--color-bg-secondary)] rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}