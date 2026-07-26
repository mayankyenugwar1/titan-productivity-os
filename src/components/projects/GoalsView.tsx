import { Target } from "lucide-react";
import type { Goal } from "@/services/projects/projectService";
import { calculateGoalProgress } from "@/services/projects/progressService";
import { TitanBadge, TitanProgress } from "@/components/ui";

interface GoalsViewProps {
  goals: Goal[];
}

export default function GoalsView({ goals }: GoalsViewProps) {
  return (
    <div className="rounded-3xl border border-zinc-800/80 bg-[#070709] p-6.5 shadow-2xl shadow-black font-mono space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3.5">
        <div className="flex items-center gap-2">
          <Target className="size-4 text-[#e5c158]" />
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#e5c158]">
            STRATEGIC GOALS & OKRS DASHBOARD
          </span>
        </div>
        <TitanBadge variant="gold" size="sm">
          OBJECTIVES & KEY RESULTS
        </TitanBadge>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {goals.map((goal) => {
          const progress = calculateGoalProgress(goal);
          return (
            <div
              key={goal.id}
              className="rounded-2xl border border-zinc-800/80 bg-[#0c0c0f] p-5 space-y-4 shadow-xl"
            >
              <div className="flex items-center justify-between">
                <TitanBadge variant="gold" size="sm">
                  {goal.category}
                </TitanBadge>
                <span className="text-xs font-bold text-zinc-400">Target: {goal.targetDate}</span>
              </div>

              <div>
                <h4 className="font-sans font-bold text-base text-zinc-100">{goal.title}</h4>
                <p className="text-xs text-zinc-400 font-sans mt-1 leading-relaxed">{goal.description}</p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400 font-bold">Goal Completion Index</span>
                  <span className="font-bold text-[#e5c158]">{progress}%</span>
                </div>
                <TitanProgress value={progress} />
              </div>

              {/* Key Results */}
              <div className="space-y-2 border-t border-zinc-800/60 pt-3 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  KEY RESULTS ({goal.keyResults.length})
                </span>
                {goal.keyResults.map((kr) => (
                  <div key={kr.id} className="flex items-center justify-between text-zinc-300 font-sans">
                    <span>{kr.title}</span>
                    <span className="font-mono font-bold text-[#e5c158]">
                      {kr.currentValue} / {kr.targetValue} {kr.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
