import { Brain, Layers, ShieldCheck, Zap } from "lucide-react";
import { useHabitStore } from "@/store/missionStore";
import { getProgressionDetails } from "@/services/xpEngineService";
import { TitanBadge } from "@/components/ui";

export default function MemoryPanel() {
  const { habits, totalXP, streak } = useHabitStore();
  const progression = getProgressionDetails(totalXP);

  const activeCount = habits.filter((h) => !h.completed).length;
  const completedCount = habits.filter((h) => h.completed).length;

  return (
    <div className="rounded-3xl border border-zinc-800/80 bg-[#070709] p-5 shadow-2xl shadow-black space-y-4 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Brain className="size-4 text-[#e5c158]" />
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#e5c158]">
            AI MEMORY & CONTEXT
          </span>
        </div>
        <TitanBadge variant="gold" size="sm">
          CONTEXT LOADED
        </TitanBadge>
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-[#0c0c0f] p-2.5">
          <div className="flex items-center gap-2 text-zinc-400">
            <Layers className="size-3.5" />
            <span>Active Operations</span>
          </div>
          <span className="font-bold text-white">{activeCount} Queued</span>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-[#0c0c0f] p-2.5">
          <div className="flex items-center gap-2 text-zinc-400">
            <ShieldCheck className="size-3.5 text-emerald-400" />
            <span>Accomplished</span>
          </div>
          <span className="font-bold text-emerald-400">{completedCount} Done</span>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-[#0c0c0f] p-2.5">
          <div className="flex items-center gap-2 text-zinc-400">
            <Zap className="size-3.5 text-[#e5c158]" />
            <span>Combat Streak</span>
          </div>
          <span className="font-bold text-[#e5c158]">{streak} Days</span>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-[#0c0c0f] p-2.5">
          <div className="flex items-center gap-2 text-zinc-400">
            <Brain className="size-3.5 text-sky-400" />
            <span>Clearance Rank</span>
          </div>
          <span className="font-bold text-sky-300">LVL {progression.level} · {progression.rank}</span>
        </div>
      </div>
    </div>
  );
}
