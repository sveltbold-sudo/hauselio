export default function NewsletterAbmeldenLoading() {
  return (
    <div className="container-hausaura py-8" role="status" aria-label="Wird geladen">
      <div className="animate-pulse max-w-lg mx-auto">
        <div className="h-4 w-32 bg-[var(--color-bg-secondary)] rounded mb-4" />
        <div className="h-8 w-64 bg-[var(--color-bg-secondary)] rounded mb-4" />
        <div className="h-4 w-80 bg-[var(--color-bg-secondary)] rounded mb-8" />
        <div className="space-y-4">
          <div className="h-12 w-full bg-[var(--color-bg-secondary)] rounded-xl" />
          <div className="h-12 w-40 bg-[var(--color-bg-secondary)] rounded-xl" />
        </div>
      </div>
    </div>
  );
}
