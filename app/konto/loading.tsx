export default function KontoLoading() {
  return (
    <div className="container-hausaura py-8" role="status" aria-label="Wird geladen">
      <div className="animate-pulse space-y-6 max-w-2xl">
        <div className="h-4 w-24 bg-[var(--color-bg-secondary)] rounded" />
        <div className="h-8 w-48 bg-[var(--color-bg-secondary)] rounded" />
        <div className="h-4 w-72 bg-[var(--color-bg-secondary)] rounded" />
        <div className="mt-8 space-y-4">
          <div className="flex gap-2">
            <div className="h-10 w-24 bg-[var(--color-bg-secondary)] rounded-lg" />
            <div className="h-10 w-28 bg-[var(--color-bg-secondary)] rounded-lg" />
          </div>
          <div className="space-y-3 mt-4">
            <div className="h-10 w-full bg-[var(--color-bg-secondary)] rounded-xl" />
            <div className="h-10 w-full bg-[var(--color-bg-secondary)] rounded-xl" />
            <div className="h-12 w-40 bg-[var(--color-bg-secondary)] rounded-xl mt-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
