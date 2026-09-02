export default function AdminUsersLoading() {
  return (
    <div className="p-6" role="status" aria-label="Wird geladen">
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-48 bg-[var(--color-bg-secondary)] rounded" />
        <div className="h-12 w-full bg-[var(--color-bg-secondary)] rounded-xl" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 w-full bg-[var(--color-bg-secondary)] rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}