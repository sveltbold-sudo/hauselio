export default function VersandLoading() {
  return (
    <div className="container-hausaura py-8" role="status" aria-label="Wird geladen">
      <div className="animate-pulse space-y-6">
        <div className="h-4 w-24 bg-[var(--color-bg-secondary)] rounded" />
        <div className="h-8 w-56 bg-[var(--color-bg-secondary)] rounded" />
        <div className="space-y-3 mt-8">
          <div className="h-4 w-full bg-[var(--color-bg-secondary)] rounded" />
          <div className="h-4 w-full bg-[var(--color-bg-secondary)] rounded" />
          <div className="h-4 w-3/4 bg-[var(--color-bg-secondary)] rounded" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-[var(--color-border-light)] p-5">
              <div className="h-5 w-24 bg-[var(--color-bg-secondary)] rounded mb-3" />
              <div className="h-4 w-full bg-[var(--color-bg-secondary)] rounded mb-2" />
              <div className="h-4 w-2/3 bg-[var(--color-bg-secondary)] rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
