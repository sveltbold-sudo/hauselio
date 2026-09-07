export default function UeberUnsLoading() {
  return (
    <div className="container-hausaura py-8" role="status" aria-label="Wird geladen">
      <div className="animate-pulse space-y-6">
        <div className="h-4 w-24 bg-[var(--color-bg-secondary)] rounded" />
        <div className="h-8 w-56 bg-[var(--color-bg-secondary)] rounded" />
        <div className="h-40 w-full bg-[var(--color-bg-secondary)] rounded-2xl mt-8" />
        <div className="space-y-3 mt-6">
          <div className="h-4 w-full bg-[var(--color-bg-secondary)] rounded" />
          <div className="h-4 w-full bg-[var(--color-bg-secondary)] rounded" />
          <div className="h-4 w-3/4 bg-[var(--color-bg-secondary)] rounded" />
        </div>
        <div className="space-y-3 mt-6">
          <div className="h-5 w-48 bg-[var(--color-bg-secondary)] rounded" />
          <div className="h-4 w-full bg-[var(--color-bg-secondary)] rounded" />
          <div className="h-4 w-5/6 bg-[var(--color-bg-secondary)] rounded" />
        </div>
      </div>
    </div>
  );
}
