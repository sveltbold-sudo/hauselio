export default function ShopLoading() {
  return (
    <div className="container-hauselio py-8">
      <div className="mb-10 animate-pulse">
        <div className="h-4 w-20 bg-gray-200 rounded mb-3" />
        <div className="h-10 w-64 bg-gray-200 rounded mb-2" />
        <div className="h-5 w-96 bg-gray-100 rounded" />
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-10 w-24 bg-gray-200 rounded-xl animate-pulse" />
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-64 space-y-4 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-8 bg-gray-100 rounded" />
          ))}
        </div>

        <div className="flex-1">
          <div className="h-12 bg-gray-100 rounded-xl mb-6 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[var(--color-border-light)] overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-100" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                  <div className="h-5 bg-gray-100 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
