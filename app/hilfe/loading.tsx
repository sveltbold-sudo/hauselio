export default function HilfeLoading() {
  return (
    <div className="container-hausaura py-8" role="status" aria-label="Wird geladen">
      <div className="animate-pulse space-y-6">
        <div className="h-4 w-24 bg-[var(--color-bg-secondary)] rounded" />
        <div className="h-8 w-48 bg-[var(--color-bg-secondary)] rounded" />
        <div className="space-y-4 mt-8">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-[var(--color-border-light)] p-5">
              <div className="h-5 w-3/4 bg-[var(--color-bg-secondary)] rounded mb-3" />
              <div className="h-4 w-full bg-[var(--color-bg-secondary)] rounded mb-2" />
              <div className="h-4 w-5/6 bg-[var(--color-bg-secondary)] rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
