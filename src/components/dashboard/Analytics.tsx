import {
  ArrowUpRight,
  BarChart3,
  TrendingUp,
} from "lucide-react";

export default function Analytics() {
  const weeklyData = [32, 48, 41, 68, 76, 61, 92];

  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-yellow-400">
            Performance
          </p>

          <h2 className="mt-3 text-3xl font-bold text-white">
            Weekly Progress
          </h2>

          <p className="mt-2 text-zinc-500">
            Your consistency has improved over the last 7 days.
          </p>
        </div>

        <div className="rounded-2xl bg-yellow-400/10 p-3">
          <BarChart3 className="h-6 w-6 text-yellow-400" />
        </div>
      </div>

      {/* Fake Chart */}
      <div className="mt-10 flex h-48 items-end justify-between gap-3">
        {weeklyData.map((value, index) => (
          <div
            key={index}
            className="flex flex-1 flex-col items-center gap-3"
          >
            <div
              className="w-full rounded-t-xl bg-gradient-to-t from-yellow-500 to-yellow-300 transition-all duration-300 hover:opacity-80"
              style={{
                height: `${value}%`,
              }}
            />

            <span className="text-xs text-zinc-500">
              {["M", "T", "W", "T", "F", "S", "S"][index]}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom Stats */}
      <div className="mt-10 grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-zinc-800 bg-black/20 p-5">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-green-400" />

            <div>
              <p className="text-sm text-zinc-500">
                Weekly Growth
              </p>

              <h3 className="mt-1 text-2xl font-bold text-white">
                +18%
              </h3>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-black/20 p-5">
          <div className="flex items-center gap-3">
            <ArrowUpRight className="h-5 w-5 text-yellow-400" />

            <div>
              <p className="text-sm text-zinc-500">
                Completion Rate
              </p>

              <h3 className="mt-1 text-2xl font-bold text-white">
                92%
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}