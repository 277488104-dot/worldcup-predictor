export function MatchCardSkeleton() {
  return (
    <div className="bg-[#0d220d] border border-white/15 rounded-2xl p-5 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-3 w-16 bg-white/10 rounded" />
        <div className="h-3 w-10 bg-white/10 rounded" />
        <div className="h-5 w-14 bg-white/10 rounded-full" />
      </div>
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col items-center gap-2 flex-1">
          <div className="w-10 h-10 rounded-full bg-white/10" />
          <div className="h-3 w-16 bg-white/10 rounded" />
          <div className="h-2 w-8 bg-white/10 rounded" />
        </div>
        <div className="h-7 w-14 bg-white/10 rounded" />
        <div className="flex flex-col items-center gap-2 flex-1">
          <div className="w-10 h-10 rounded-full bg-white/10" />
          <div className="h-3 w-16 bg-white/10 rounded" />
          <div className="h-2 w-8 bg-white/10 rounded" />
        </div>
      </div>
      <div className="mt-5 pt-3 border-t border-white/10">
        <div className="h-3 w-40 mx-auto bg-white/10 rounded" />
      </div>
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="card-glass p-5 animate-pulse">
      <div className="h-3 w-24 bg-white/10 rounded mb-3" />
      <div className="h-5 w-48 bg-white/10 rounded mb-2" />
      <div className="h-3 w-32 bg-white/10 rounded" />
    </div>
  )
}

export function DetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-5 py-24 animate-pulse">
      {/* breadcrumb */}
      <div className="h-3 w-48 bg-white/10 rounded mb-6" />
      {/* scoreboard */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 md:p-12 mb-10">
        <div className="flex justify-center gap-3 mb-6">
          <div className="h-6 w-16 bg-white/10 rounded-full" />
          <div className="h-6 w-24 bg-white/10 rounded-full" />
        </div>
        <div className="flex items-center justify-center gap-8">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-white/10" />
            <div className="h-5 w-20 bg-white/10 rounded" />
          </div>
          <div className="h-16 w-32 bg-white/10 rounded" />
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-white/10" />
            <div className="h-5 w-20 bg-white/10 rounded" />
          </div>
        </div>
      </div>
      {/* analysis grid */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 h-80">
          <div className="h-3 w-32 bg-white/10 rounded mb-4" />
          <div className="h-5 w-24 bg-white/10 rounded mb-6" />
          <div className="h-48 bg-white/[0.03] rounded-xl" />
        </div>
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 h-80">
          <div className="h-3 w-32 bg-white/10 rounded mb-4" />
          <div className="h-5 w-24 bg-white/10 rounded mb-6" />
          <div className="space-y-3">
            <div className="h-4 bg-white/10 rounded" />
            <div className="h-4 bg-white/10 rounded w-3/4" />
            <div className="h-4 bg-white/10 rounded w-1/2" />
          </div>
        </div>
      </div>
    </div>
  )
}
