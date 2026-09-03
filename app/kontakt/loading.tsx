export default function KontaktLoading() {
  return (
    <div className="container-hausaura py-8" role="status" aria-label="Wird geladen">
      <div className="animate-pulse">
        <div className="mb-10">
          <div className="h-4 w-24 bg-[var(--color-border-light)] rounded mb-3" />
          <div className="h-10 w-48 bg-[var(--color-border-light)] rounded mb-2" />
          <div className="h-5 w-72 bg-[var(--color-bg-secondary)] rounded" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-5">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <div className="h-4 w-20 bg-[var(--color-border-light)] rounded mb-2" />
                <div className="h-12 w-full bg-[var(--color-bg-secondary)] rounded-xl" />
              </div>
            ))}
            <div>
              <div className="h-4 w-24 bg-[var(--color-border-light)] rounded mb-2" />
              <div className="h-32 w-full bg-[var(--color-bg-secondary)] rounded-xl" />
            </div>
            <div className="h-14 w-40 bg-[var(--color-border-light)] rounded-xl" />
          </div>

          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-[var(--color-border-light)]">
                <div className="w-12 h-12 bg-[var(--color-bg-secondary)] rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-[var(--color-border-light)] rounded" />
                  <div className="h-3 w-full bg-[var(--color-bg-secondary)] rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
