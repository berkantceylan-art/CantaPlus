export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Hero Skeleton */}
      <div className="h-[70vh] w-full bg-zinc-900 animate-pulse rounded-3xl" />
      
      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-4">
            <div className="aspect-[4/5] w-full bg-zinc-900 animate-pulse rounded-2xl" />
            <div className="h-4 w-2/3 bg-zinc-900 animate-pulse rounded" />
            <div className="h-4 w-1/3 bg-zinc-900 animate-pulse rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
