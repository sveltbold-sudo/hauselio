export default function KategorieLoading() {
  return (
    <div className="container-hausaura py-8" role="status" aria-label="Wird geladen">
      <div className="animate-pulse">
        <div className="mb-10">
          <div className="h-3 w-24 bg-[var(--color-border-light)] rounded mb-4" />
          <div className="h-8 w-48 bg-[var(--color-border-light)] rounded mb-2" />
          <div className="h-4 w-96 bg-[var(--color-border-light)] rounded" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-[var(--color-border-light)] overflow-hidden"
            >
              <div className="aspect-square bg-[var(--color-border-light)]" />
              <div className="p-5 space-y-3">
                <div className="h-3 w-16 bg-[var(--color-border-light)] rounded" />
                <div className="h-4 w-full bg-[var(--color-border-light)] rounded" />
                <div className="h-4 w-3/4 bg-[var(--color-border-light)] rounded" />
                <div className="h-3 w-20 bg-[var(--color-border-light)] rounded" />
                <div className="h-6 w-24 bg-[var(--color-border-light)] rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
