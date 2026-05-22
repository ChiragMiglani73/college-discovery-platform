export function CollegeCardSkeleton() {
  return (
    <div className="card p-5 space-y-3">
      <div className="flex gap-2">
        <div className="skeleton h-5 w-16" />
        <div className="skeleton h-5 w-20" />
      </div>
      <div className="skeleton h-6 w-3/4" />
      <div className="skeleton h-4 w-1/3" />
      <div className="grid grid-cols-3 gap-2">
        <div className="skeleton h-14 rounded-lg" />
        <div className="skeleton h-14 rounded-lg" />
        <div className="skeleton h-14 rounded-lg" />
      </div>
      <div className="flex gap-1">
        <div className="skeleton h-5 w-12 rounded-full" />
        <div className="skeleton h-5 w-16 rounded-full" />
        <div className="skeleton h-5 w-10 rounded-full" />
      </div>
      <div className="skeleton h-9 rounded-lg" />
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="skeleton h-10 w-3/4" />
      <div className="skeleton h-5 w-1/3" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="skeleton h-24 rounded-xl" />
        ))}
      </div>
      <div className="skeleton h-48 rounded-xl" />
    </div>
  );
}
