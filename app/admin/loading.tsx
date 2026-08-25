export default function AdminDashboardLoading() {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-[var(--color-border-light)] p-5">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-bg-secondary)] mb-3" />
            <div className="h-4 w-20 bg-[var(--color-bg-secondary)] rounded mb-2" />
            <div className="h-6 w-28 bg-[var(--color-bg-secondary)] rounded" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-[var(--color-border-light)] p-5">
        <div className="h-5 w-40 bg-[var(--color-bg-secondary)] rounded mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-4 w-24 bg-[var(--color-bg-secondary)] rounded" />
              <div className="h-4 flex-1 bg-[var(--color-bg-secondary)] rounded" />
              <div className="h-4 w-20 bg-[var(--color-bg-secondary)] rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
