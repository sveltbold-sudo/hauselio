export default function ProductLoading() {
  return (
    <div className="container-hauselio py-8">
      <div className="animate-pulse">
        <div className="flex gap-2 mb-6">
          <div className="h-4 w-16 bg-gray-200 rounded" />
          <div className="h-4 w-4 bg-gray-200 rounded" />
          <div className="h-4 w-24 bg-gray-200 rounded" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-2xl" />
            <div className="grid grid-cols-4 gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-100 rounded-xl" />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="h-4 w-20 bg-gray-200 rounded mb-3" />
              <div className="h-8 w-3/4 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-32 bg-gray-100 rounded" />
            </div>
            <div className="h-10 w-40 bg-gray-200 rounded" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-100 rounded" />
              <div className="h-4 w-full bg-gray-100 rounded" />
              <div className="h-4 w-2/3 bg-gray-100 rounded" />
            </div>
            <div className="h-14 w-full bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
