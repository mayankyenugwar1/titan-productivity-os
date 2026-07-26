export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-3xl border border-zinc-800/80 bg-[#0c0c0f] p-6 space-y-4 font-mono">
      <div className="flex items-center justify-between">
        <div className="h-5 w-28 rounded-lg bg-zinc-800" />
        <div className="h-5 w-16 rounded-lg bg-zinc-800/60" />
      </div>
      <div className="h-6 w-3/4 rounded-lg bg-zinc-800" />
      <div className="h-4 w-1/2 rounded-lg bg-zinc-800/60" />
      <div className="h-2.5 w-full rounded-full bg-zinc-800/80" />
    </div>
  );
}

export function SkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 font-mono">
      {Array.from({ length: count }).map((_, idx) => (
        <SkeletonCard key={idx} />
      ))}
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="animate-pulse rounded-3xl border border-zinc-800/80 bg-[#070709] p-6 space-y-4 font-mono h-72">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div className="h-4 w-40 rounded-lg bg-zinc-800" />
        <div className="h-3 w-20 rounded-lg bg-zinc-800/60" />
      </div>
      <div className="flex items-end justify-between h-48 pt-6 gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="w-full rounded-t-lg bg-zinc-800/70"
            style={{ height: `${(i % 5) * 20 + 30}%` }}
          />
        ))}
      </div>
    </div>
  );
}
