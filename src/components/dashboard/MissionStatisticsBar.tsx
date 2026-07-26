import { useMemo } from "react";
import { CheckCircle2, Clock, Target, Zap } from "lucide-react";
import { useHabitStore } from "@/store/missionStore";
import type { Habit } from "@/features/missions/types";
import { calculateDynamicXP } from "@/features/missions/types";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import TitanProgress from "@/components/ui/TitanProgress";

export default function MissionStatisticsBar() {
  const { habits } = useHabitStore();

  // Dynamic Telemetry Calculations
  const stats = useMemo(() => {
    const totalToday = habits.length;
    const completedList = habits.filter((h: Habit) => h.completed);
    const completedCount = completedList.length;
    const remainingCount = totalToday - completedCount;

    const completionRate = totalToday > 0 ? Math.round((completedCount / totalToday) * 100) : 0;

    const totalXPAvailable = habits.reduce((sum, h) => sum + calculateDynamicXP(h), 0);

    const getMins = (p: string) => (p === "High" ? 90 : p === "Medium" ? 45 : 20);

    const estimatedFocusMins = habits.reduce((sum, h) => sum + getMins(h.priority), 0);
    const completedFocusMins = completedList.reduce((sum, h) => sum + getMins(h.priority), 0);

    return {
      totalToday,
      completedCount,
      remainingCount,
      completionRate,
      totalXPAvailable,
      estimatedFocusMins,
      completedFocusMins,
    };
  }, [habits]);

  return (
    <div className="rounded-3xl border border-zinc-800/80 bg-[#070709] p-6 shadow-2xl shadow-black font-mono space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl border border-[#d4af37]/30 bg-[#d4af37]/10 text-[#e5c158]">
            <Target className="size-5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#e5c158]">
              SYSTEM TELEMETRY // LIVE MISSION STATS
            </span>
            <h3 className="text-lg font-bold text-zinc-100 font-sans">
              Daily Operational Efficiency
            </h3>
          </div>
        </div>

        {/* Completion Rate Badge */}
        <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-[#121217] px-3.5 py-1.5 text-xs text-zinc-300">
          <span>Readiness:</span>
          <span className="font-extrabold text-[#e5c158]">
            <AnimatedNumber value={stats.completionRate} suffix="%" />
          </span>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-xs">
        {/* 1. Today's & Remaining Missions */}
        <div className="rounded-2xl border border-zinc-800/80 bg-[#0d0d10] p-4 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] uppercase tracking-wider">Active Operations</span>
            <Target className="size-4 text-[#e5c158]" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-white">
              <AnimatedNumber value={stats.totalToday} />
            </span>
            <span className="text-zinc-500 text-[11px]">
              {stats.remainingCount} Pending
            </span>
          </div>
        </div>

        {/* 2. Completed Missions */}
        <div className="rounded-2xl border border-zinc-800/80 bg-[#0d0d10] p-4 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] uppercase tracking-wider">Accomplished</span>
            <CheckCircle2 className="size-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-400">
              <AnimatedNumber value={stats.completedCount} />
            </span>
            <span className="text-emerald-500/80 text-[11px]">
              {stats.completionRate}% Yield
            </span>
          </div>
        </div>

        {/* 3. Total XP Available */}
        <div className="rounded-2xl border border-[#d4af37]/30 bg-[#d4af37]/10 p-4 space-y-2">
          <div className="flex items-center justify-between text-[#e5c158]">
            <span className="text-[10px] uppercase tracking-wider">XP Target Yield</span>
            <Zap className="size-4" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-[#e5c158]">
              <AnimatedNumber value={stats.totalXPAvailable} prefix="+" suffix=" XP" />
            </span>
            <span className="text-[#e5c158]/80 text-[11px]">Max Payload</span>
          </div>
        </div>

        {/* 4. Focus Time (Completed / Estimated) */}
        <div className="rounded-2xl border border-zinc-800/80 bg-[#0d0d10] p-4 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] uppercase tracking-wider">Focus Duration</span>
            <Clock className="size-4 text-sky-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-zinc-100">
              {stats.completedFocusMins}m
            </span>
            <span className="text-zinc-500 text-[11px]">
              / {stats.estimatedFocusMins}m Total
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[11px] text-zinc-400">
          <span>Completion Readiness Engine</span>
          <span className="font-bold text-[#e5c158]">{stats.completionRate}%</span>
        </div>
        <TitanProgress value={stats.completionRate} />
      </div>
    </div>
  );
}
