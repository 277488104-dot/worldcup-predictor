export default function TeamsLoading() {
  return (
    <main className="max-w-7xl mx-auto px-5 py-24 animate-pulse">
      <div className="h-8 w-32 bg-white/10 rounded mb-2" />
      <div className="h-4 w-64 bg-white/10 rounded mb-10" />
      {Array.from({ length: 3 }).map((_, gi) => (
        <div key={gi} className="mb-10">
          <div className="h-4 w-20 bg-white/10 rounded mb-4" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-[#0d220d] border border-white/15 rounded-2xl p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-16 bg-white/10 rounded" />
                  <div className="h-2 w-12 bg-white/10 rounded" />
                </div>
                <div className="h-5 w-8 bg-white/10 rounded" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </main>
  )
}
