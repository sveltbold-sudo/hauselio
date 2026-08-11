export default function ProduktLoading() {
  return (
    <div className="container-hauselio py-8">
      <div className="animate-pulse">
        <div className="flex items-center gap-2 mb-8">
          <div className="h-3 w-12 bg-gray-200 rounded" />
          <div className="h-3 w-3 bg-gray-200 rounded" />
          <div className="h-3 w-24 bg-gray-200 rounded" />
          <div className="h-3 w-3 bg-gray-200 rounded" />
          <div className="h-3 w-32 bg-gray-200 rounded" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-square bg-gray-200 rounded-2xl" />

          <div className="space-y-6">
            <div className="h-3 w-20 bg-gray-200 rounded" />
            <div className="h-8 w-3/4 bg-gray-200 rounded" />
            <div className="h-4 w-1/2 bg-gray-200 rounded" />
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-5 h-5 bg-gray-200 rounded" />
                ))}
              </div>
              <div className="h-4 w-16 bg-gray-200 rounded" />
            </div>
            <div className="h-10 w-48 bg-gray-200 rounded" />
            <div className="h-12 w-full bg-gray-200 rounded-xl" />
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
