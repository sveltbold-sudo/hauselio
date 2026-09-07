export default function AdminLoginLoading() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-pulse">
          <div className="h-8 w-32 bg-[var(--color-bg-secondary)] rounded mx-auto" />
          <div className="h-4 w-24 bg-[var(--color-bg-secondary)] rounded mx-auto mt-2" />
        </div>

        <div className="bg-white rounded-2xl border border-[var(--color-border-light)] p-8 shadow-sm animate-pulse">
          <div className="w-12 h-12 bg-[var(--color-bg-secondary)] rounded-xl mx-auto mb-6" />
          <div className="h-6 w-32 bg-[var(--color-bg-secondary)] rounded mx-auto mb-6" />

          <div className="space-y-4">
            <div>
              <div className="h-4 w-16 bg-[var(--color-bg-secondary)] rounded mb-2" />
              <div className="h-12 w-full bg-[var(--color-bg-secondary)] rounded-xl" />
            </div>
            <div>
              <div className="h-4 w-20 bg-[var(--color-bg-secondary)] rounded mb-2" />
              <div className="h-12 w-full bg-[var(--color-bg-secondary)] rounded-xl" />
            </div>
            <div className="h-12 w-full bg-[var(--color-bg-secondary)] rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
