export default function BestellungLoading() {
  return (
    <div className="container-hauselio py-8">
      <div className="animate-pulse">
        <div className="h-8 w-64 bg-gray-200 rounded mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[var(--color-border-light)] p-6 space-y-4">
                <div className="h-5 w-40 bg-gray-200 rounded" />
                <div className="h-10 w-full bg-gray-200 rounded-xl" />
                <div className="h-10 w-full bg-gray-200 rounded-xl" />
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-[var(--color-border-light)] p-6 space-y-4 h-fit">
            <div className="h-5 w-32 bg-gray-200 rounded" />
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                  <div className="h-4 w-16 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
            <div className="border-t border-[var(--color-border-light)] pt-4">
              <div className="flex justify-between">
                <div className="h-5 w-20 bg-gray-200 rounded" />
                <div className="h-5 w-24 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="h-12 w-full bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
