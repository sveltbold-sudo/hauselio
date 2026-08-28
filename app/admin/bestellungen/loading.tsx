export default function AdminOrdersLoading() {
  return (
    <div className="animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="h-8 w-40 bg-[var(--color-border-light)] rounded" />
        <div className="h-10 w-36 bg-[var(--color-border-light)] rounded-xl" />
      </div>
      <div className="bg-white rounded-xl border border-[var(--color-border-light)] overflow-hidden">
        <div className="px-5 py-3 bg-[var(--color-bg)] flex gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-3 w-16 bg-[var(--color-border-light)] rounded" />
          ))}
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-3 border-b border-[var(--color-border-light)]">
            <div className="w-4 h-4 bg-[var(--color-border-light)] rounded" />
            <div className="h-4 w-24 bg-[var(--color-border-light)] rounded" />
            <div className="flex-1">
              <div className="h-4 w-32 bg-[var(--color-border-light)] rounded mb-1" />
              <div className="h-3 w-24 bg-[var(--color-border-light)] rounded" />
            </div>
            <div className="h-4 w-20 bg-[var(--color-border-light)] rounded" />
            <div className="h-4 w-16 bg-[var(--color-border-light)] rounded" />
            <div className="h-5 w-24 bg-[var(--color-border-light)] rounded-full" />
            <div className="h-4 w-16 bg-[var(--color-border-light)] rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
