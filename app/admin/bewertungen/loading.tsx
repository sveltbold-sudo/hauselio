export default function AdminBewertungenLoading() {
  return (
    <div className="animate-pulse space-y-6" role="status" aria-label="Wird geladen">
      <div className="h-8 w-48 bg-[var(--color-bg-secondary)] rounded" />
      <div className="bg-white rounded-xl border border-[var(--color-border-light)] p-5">
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-8 w-8 rounded-full bg-[var(--color-bg-secondary)]" />
              <div className="h-4 flex-1 bg-[var(--color-bg-secondary)] rounded" />
              <div className="h-4 w-16 bg-[var(--color-bg-secondary)] rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
