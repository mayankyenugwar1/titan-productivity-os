import { useMemo } from "react";
import { ArrowRight, Brain, Clock, ShieldAlert, Zap } from "lucide-react";
import { useHabitStore } from "@/store/missionStore";
import type { Habit } from "@/features/missions/types";
import { calculateDynamicXP } from "@/features/missions/types";
import { formatCategory } from "@/features/missions/constants";
import { EmptyState, SectionHeader, TitanBadge } from "@/components/ui";

export default function OperatorInsightsPanel() {
  const { habits } = useHabitStore();

  const activeMissions = useMemo(() => habits.filter((h: Habit) => !h.completed), [habits]);

  // Derived Insights
  const highestPriority = useMemo(() => {
    return activeMissions.find((h) => h.priority === "High") || activeMissions[0] || null;
  }, [activeMissions]);

  const nextMission = useMemo(() => {
    return activeMissions.find((h) => !h.completed) || null;
  }, [activeMissions]);

  const longestMission = useMemo(() => {
    if (activeMissions.length === 0) return null;
    return [...activeMissions].sort((a, b) => {
      const dur = (p: string) => (p === "High" ? 90 : p === "Medium" ? 45 : 20);
      return dur(b.priority) - dur(a.priority);
    })[0];
  }, [activeMissions]);

  const highestXPMission = useMemo(() => {
    if (activeMissions.length === 0) return null;
    return [...activeMissions].sort((a, b) => calculateDynamicXP(b) - calculateDynamicXP(a))[0];
  }, [activeMissions]);

  if (habits.length === 0) {
    return (
      <div className="rounded-3xl border border-zinc-800/80 bg-[#070709] p-6 shadow-2xl font-mono">
        <EmptyState
          icon={<Brain className="size-8 text-[#e5c158]" />}
          title="Operator, No Active Operations Detected"
          description="Your Wayne OS mission core is clear. Deploy your first tactical mission to activate intelligence insights."
        />
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-zinc-800/80 bg-[#070709] p-6 sm:p-8 shadow-2xl shadow-black font-mono space-y-6">
      <SectionHeader
        badge="Wayne OS Intelligence Engine"
        title="Operator Tactical Insights"
        description="Real-time operational analysis derived directly from active mission state."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-xs">
        {/* 1. Highest Priority Mission */}
        <div className="group rounded-2xl border border-red-500/30 bg-[#0d0d10] p-4 space-y-3 transition duration-300 hover:border-red-500/60">
          <div className="flex items-center justify-between text-red-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Highest Priority</span>
            <ShieldAlert className="size-4" />
          </div>
          {highestPriority ? (
            <div>
              <div className="flex items-center gap-2">
                <TitanBadge variant="red" size="sm">CRITICAL</TitanBadge>
                <TitanBadge variant="zinc" size="sm">{formatCategory(highestPriority.category)}</TitanBadge>
              </div>
              <h4 className="mt-2 font-sans font-bold text-zinc-100 truncate">{highestPriority.title}</h4>
            </div>
          ) : (
            <span className="text-zinc-500 italic">No critical priority operations</span>
          )}
        </div>

        {/* 2. Recommended Next Mission */}
        <div className="group rounded-2xl border border-[#d4af37]/30 bg-[#0d0d10] p-4 space-y-3 transition duration-300 hover:border-[#d4af37]/60">
          <div className="flex items-center justify-between text-[#e5c158]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Next Objective</span>
            <ArrowRight className="size-4" />
          </div>
          {nextMission ? (
            <div>
              <div className="flex items-center gap-2">
                <TitanBadge variant="gold" size="sm">RECOMMENDED</TitanBadge>
                <TitanBadge variant="zinc" size="sm">{formatCategory(nextMission.category)}</TitanBadge>
              </div>
              <h4 className="mt-2 font-sans font-bold text-zinc-100 truncate">{nextMission.title}</h4>
            </div>
          ) : (
            <span className="text-emerald-400 font-bold">All objectives completed today!</span>
          )}
        </div>

        {/* 3. Longest Mission */}
        <div className="group rounded-2xl border border-sky-500/30 bg-[#0d0d10] p-4 space-y-3 transition duration-300 hover:border-sky-500/60">
          <div className="flex items-center justify-between text-sky-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Max Duration</span>
            <Clock className="size-4" />
          </div>
          {longestMission ? (
            <div>
              <div className="flex items-center gap-2">
                <TitanBadge variant="blue" size="sm">
                  {longestMission.priority === "High" ? "90 MINS" : longestMission.priority === "Medium" ? "45 MINS" : "20 MINS"}
                </TitanBadge>
                <TitanBadge variant="zinc" size="sm">{formatCategory(longestMission.category)}</TitanBadge>
              </div>
              <h4 className="mt-2 font-sans font-bold text-zinc-100 truncate">{longestMission.title}</h4>
            </div>
          ) : (
            <span className="text-zinc-500 italic">No pending operations</span>
          )}
        </div>

        {/* 4. Highest XP Mission */}
        <div className="group rounded-2xl border border-[#d4af37]/30 bg-[#d4af37]/10 p-4 space-y-3 transition duration-300 hover:border-[#d4af37]">
          <div className="flex items-center justify-between text-[#e5c158]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Highest XP Yield</span>
            <Zap className="size-4" />
          </div>
          {highestXPMission ? (
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-[#e5c158]">+{calculateDynamicXP(highestXPMission)} XP</span>
                <TitanBadge variant="zinc" size="sm">{formatCategory(highestXPMission.category)}</TitanBadge>
              </div>
              <h4 className="mt-2 font-sans font-bold text-zinc-100 truncate">{highestXPMission.title}</h4>
            </div>
          ) : (
            <span className="text-zinc-500 italic">No XP yield active</span>
          )}
        </div>
      </div>
    </div>
  );
}
