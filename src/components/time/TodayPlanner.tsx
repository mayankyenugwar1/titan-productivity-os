import { Activity, Brain, Clock, Play, Sparkles, Zap } from "lucide-react";
import { usePlanner } from "@/hooks/time/usePlanner";
import { TitanBadge, TitanProgress } from "@/components/ui";
import TimeBlock from "./TimeBlock";

export default function TodayPlanner() {
  const planner = usePlanner();

  return (
    <div className="space-y-8 font-mono text-zinc-100">
      {/* 4 Planner Telemetry Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-xs">
        <div className="rounded-2xl border border-[#d4af37]/30 bg-[#d4af37]/10 p-5 space-y-2">
          <div className="flex items-center justify-between text-[#e5c158]">
            <span className="text-xs uppercase tracking-wider font-bold">Today's Focus Hours</span>
            <Zap className="size-4" />
          </div>
          <p className="text-3xl font-black text-[#e5c158]">{planner.totalFocusHours} Hours</p>
        </div>

        <div className="rounded-2xl border border-zinc-800/80 bg-[#070709] p-5 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs uppercase tracking-wider font-bold">Free Time Capacity</span>
            <Clock className="size-4 text-sky-400" />
          </div>
          <p className="text-3xl font-black text-white">{planner.freeTimeHours} Hours</p>
        </div>

        <div className="rounded-2xl border border-zinc-800/80 bg-[#070709] p-5 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs uppercase tracking-wider font-bold">Tactical Break Allocation</span>
            <Brain className="size-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-emerald-400">{planner.breakTimeMins} Minutes</p>
        </div>

        <div className="rounded-2xl border border-zinc-800/80 bg-[#070709] p-5 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs uppercase tracking-wider font-bold">Schedule Completion</span>
            <Activity className="size-4 text-purple-400" />
          </div>
          <p className="text-3xl font-black text-purple-400">{planner.completionPercent}%</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="rounded-3xl border border-zinc-800/80 bg-[#070709] p-6.5 space-y-3 shadow-2xl shadow-black">
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-400 font-bold">Daily Directive Completion Index</span>
          <span className="font-bold text-[#e5c158]">{planner.completionPercent}% Completed</span>
        </div>
        <TitanProgress value={planner.completionPercent} />
      </div>

      {/* Current & Next Mission Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Current Active Mission */}
        <div className="rounded-3xl border border-[#d4af37]/40 bg-gradient-to-b from-[#09090b] via-[#0d0d10] to-[#08080a] p-6.5 space-y-4 shadow-2xl shadow-black">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3.5">
            <div className="flex items-center gap-2">
              <Play className="size-4 text-[#e5c158]" />
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#e5c158]">
                CURRENT OPERATION DIRECTIVE
              </span>
            </div>
            <TitanBadge variant="gold" size="sm">
              ACTIVE NOW
            </TitanBadge>
          </div>

          {planner.currentMission ? (
            <TimeBlock event={planner.currentMission} />
          ) : (
            <p className="text-xs text-zinc-500 italic p-4">No active operation directive scheduled now.</p>
          )}
        </div>

        {/* Next Scheduled Mission */}
        <div className="rounded-3xl border border-zinc-800/80 bg-[#070709] p-6.5 space-y-4 shadow-2xl shadow-black">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3.5">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-sky-400" />
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-sky-400">
                UPCOMING NEXT OPERATION
              </span>
            </div>
            <TitanBadge variant="blue" size="sm">
              QUEUED
            </TitanBadge>
          </div>

          {planner.nextMission ? (
            <TimeBlock event={planner.nextMission} />
          ) : (
            <p className="text-xs text-zinc-500 italic p-4">No upcoming operation queued next.</p>
          )}
        </div>
      </div>
    </div>
  );
}
