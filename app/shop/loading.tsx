export default function ShopLoading() {
  return (
    <div className="container-hauselio py-8">
      <div className="animate-pulse">
        <div className="mb-10">
          <div className="h-3 w-24 bg-gray-200 rounded mb-4" />
          <div className="h-8 w-48 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-96 bg-gray-200 rounded" />
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 w-24 bg-gray-200 rounded-xl" />
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-[var(--color-border-light)] p-6 space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-5 bg-gray-200 rounded w-3/4" />
              ))}
            </div>
          </aside>

          <div className="flex-1">
            <div className="h-12 bg-gray-200 rounded-xl mb-6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-[var(--color-border-light)] overflow-hidden"
                >
                  <div className="aspect-square bg-gray-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 w-16 bg-gray-200 rounded" />
                    <div className="h-4 w-full bg-gray-200 rounded" />
                    <div className="h-4 w-3/4 bg-gray-200 rounded" />
                    <div className="h-3 w-20 bg-gray-200 rounded" />
                    <div className="h-6 w-24 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
