import {
  Brain,
  Clock3,
  Sparkles,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

import TitanButton from "@/components/ui/TitanButton";

export default function AICoach() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/60 p-8">

      {/* Glow */}
      <div className="absolute -right-24 -top-24 h-60 w-60 rounded-full bg-yellow-400/5 blur-[100px]" />

      <div className="relative">

        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-yellow-400/10 p-3">
            <Brain className="h-6 w-6 text-yellow-400" />
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-yellow-400">
              TITAN Intelligence
            </p>

            <h2 className="mt-1 text-2xl font-bold text-white">
              Analysis Complete
            </h2>
          </div>

        </div>

        <p className="mt-8 text-lg leading-relaxed text-zinc-300">
          You're performing <span className="font-semibold text-white">18%</span> better
          than last week.
        </p>

        <p className="mt-3 text-zinc-500">
          Based on your recent activity, your highest productivity window is
          between <span className="text-yellow-400">7:30 AM</span> and{" "}
          <span className="text-yellow-400">10:00 AM</span>.
        </p>

        <div className="mt-10 space-y-5">

          <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-black/20 p-4">

            <div className="flex items-center gap-3">

              <TrendingUp className="h-5 w-5 text-green-500" />

              <div>

                <p className="text-sm font-medium text-white">
                  Recommended Action
                </p>

                <p className="text-sm text-zinc-500">
                  Complete Reading Habit
                </p>

              </div>

            </div>

            <ArrowRight className="h-5 w-5 text-zinc-500" />

          </div>

          <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-black/20 p-4">

            <div className="flex items-center gap-3">

              <Clock3 className="h-5 w-5 text-yellow-400" />

              <div>

                <p className="text-sm font-medium text-white">
                  Estimated Time
                </p>

                <p className="text-sm text-zinc-500">
                  18 Minutes
                </p>

              </div>

            </div>

          </div>

          <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-black/20 p-4">

            <div className="flex items-center gap-3">

              <Sparkles className="h-5 w-5 text-cyan-400" />

              <div>

                <p className="text-sm font-medium text-white">
                  AI Insight
                </p>

                <p className="text-sm text-zinc-500">
                  Keep your current streak alive today.
                </p>

              </div>

            </div>

          </div>

        </div>

        <div className="mt-8">

          <TitanButton>
            View Full Report
          </TitanButton>

        </div>

      </div>

    </section>
  );
}