export default function CustomerDetailLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-[var(--color-bg-secondary)] rounded" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-[var(--color-bg-secondary)] rounded-xl" />
        ))}
      </div>
      <div className="h-64 bg-[var(--color-bg-secondary)] rounded-xl" />
    </div>
  );
}
