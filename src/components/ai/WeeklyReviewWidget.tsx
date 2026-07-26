import { Award, BarChart3, Check, Flame, Trophy } from "lucide-react";
import type { WeeklyReviewData } from "@/services/ai/weeklyReviewService";
import { TitanBadge } from "@/components/ui";

interface WeeklyReviewWidgetProps {
  review: WeeklyReviewData;
}

export default function WeeklyReviewWidget({ review }: WeeklyReviewWidgetProps) {
  return (
    <div className="rounded-3xl border border-zinc-800/80 bg-[#070709] p-6 shadow-2xl shadow-black font-mono space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="size-4 text-[#e5c158]" />
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#e5c158]">
            WEEKLY OPERATIONAL PERFORMANCE REVIEW
          </span>
        </div>
        <TitanBadge variant="gold" size="sm">
          {review.weekRange}
        </TitanBadge>
      </div>

      <div className="grid gap-3 sm:grid-cols-3 text-xs">
        <div className="rounded-2xl border border-zinc-800 bg-[#0c0c0f] p-3.5 space-y-1">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-[10px] font-bold uppercase">Completed Operations</span>
            <Check className="size-3.5 text-emerald-400" />
          </div>
          <p className="text-xl font-black text-emerald-400">{review.completedMissionsCount}</p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-[#0c0c0f] p-3.5 space-y-1">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-[10px] font-bold uppercase">Weekly XP Yield</span>
            <Flame className="size-3.5 text-yellow-400" />
          </div>
          <p className="text-xl font-black text-yellow-400">+{review.totalXpEarnedWeek} XP</p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-[#0c0c0f] p-3.5 space-y-1">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-[10px] font-bold uppercase">Peak Day</span>
            <Award className="size-3.5 text-sky-400" />
          </div>
          <p className="text-xl font-black text-sky-400">{review.mostProductiveDay}</p>
        </div>
      </div>

      {/* Suggested Improvements */}
      <div className="space-y-2 pt-2 border-t border-zinc-800/80">
        <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider">
          AI TACTICAL IMPROVEMENT DIRECTIVES
        </span>
        <ul className="space-y-1.5 text-xs text-zinc-300 font-sans">
          {review.aiSuggestedImprovements.map((imp, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <Trophy className="size-3.5 text-[#e5c158] shrink-0 mt-0.5" />
              <span>{imp}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
