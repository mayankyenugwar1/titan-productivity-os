import {
  ArrowUpRight,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import { ICON_SIZES, SectionHeader, TitanCard } from "@/components/ui";

export default function Analytics() {
  const weeklyData = [32, 48, 41, 68, 76, 61, 92];

  return (
    <TitanCard variant="default" padding="lg">
      <SectionHeader
        badge="Performance"
        title="Weekly Progress"
        description="Your consistency has improved over the last 7 days."
        action={
          <div className="rounded-2xl bg-yellow-400/10 p-3">
            <BarChart3 className="size-6 text-yellow-400" />
          </div>
        }
      />

      {/* Fake Chart */}
      <div className="mt-10 flex h-48 items-end justify-between gap-3">
        {weeklyData.map((value, index) => (
          <div key={index} className="flex flex-1 flex-col items-center gap-3">
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
            <TrendingUp size={ICON_SIZES.md} className="text-green-400" />
            <div>
              <p className="text-sm text-zinc-500">Weekly Growth</p>
              <h3 className="mt-1 text-2xl font-bold text-white">+18%</h3>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-black/20 p-5">
          <div className="flex items-center gap-3">
            <ArrowUpRight size={ICON_SIZES.md} className="text-yellow-400" />
            <div>
              <p className="text-sm text-zinc-500">Completion Rate</p>
              <h3 className="mt-1 text-2xl font-bold text-white">92%</h3>
            </div>
          </div>
        </div>
      </div>
    </TitanCard>
  );
}