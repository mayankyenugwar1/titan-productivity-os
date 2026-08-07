import { Sparkles, Zap } from "lucide-react";
import type { MorningBriefingPayload } from "@/services/commandCenter/dashboardService";
import { TitanBadge } from "@/components/ui";

interface MorningBriefingProps {
  briefing?: MorningBriefingPayload | null;
}

export default function MorningBriefing({ briefing }: MorningBriefingProps) {
  const safeBriefing = briefing || {
    streak: 0,
    todayMissionsCount: 0,
    completedMissionsCount: 0,
    activeProjectsCount: 0,
    activeGoalsCount: 0,
    aiRecommendation: "Systems operational. Ready for daily tactical briefing.",
  };

  return (
    <div className="rounded-3xl border border-[#d4af37]/40 bg-gradient-to-b from-[#0d0d10] via-[#09090b] to-[#070709] p-6.5 shadow-2xl shadow-black font-mono space-y-5">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3.5">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl border border-[#d4af37]/30 bg-[#d4af37]/10 text-[#e5c158]">
            <Sparkles className="size-5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#e5c158]">
              DAILY EXECUTIVE BRIEFING
            </span>
            <h3 className="text-lg font-bold text-white font-sans">
              Morning Command Readiness
            </h3>
          </div>
        </div>
        <TitanBadge variant="gold" size="sm">
          {safeBriefing.streak || 0} DAY STREAK
        </TitanBadge>
      </div>

      {/* 4 Telemetry Metrics */}
      <div className="grid gap-3 sm:grid-cols-4 text-xs">
        <div className="rounded-2xl border border-zinc-800 bg-[#0c0c0f] p-3.5 space-y-1">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Today Missions</span>
          <p className="text-xl font-black text-white">{safeBriefing.todayMissionsCount || 0}</p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-[#0c0c0f] p-3.5 space-y-1">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Accomplished</span>
          <p className="text-xl font-black text-emerald-400">{safeBriefing.completedMissionsCount || 0}</p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-[#0c0c0f] p-3.5 space-y-1">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Active Projects</span>
          <p className="text-xl font-black text-sky-400">{safeBriefing.activeProjectsCount || 0}</p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-[#0c0c0f] p-3.5 space-y-1">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Active Goals</span>
          <p className="text-xl font-black text-purple-400">{safeBriefing.activeGoalsCount || 0}</p>
        </div>
      </div>

      {/* AI Recommendation Banner */}
      <div className="flex items-center gap-3 rounded-2xl border border-[#d4af37]/30 bg-[#d4af37]/10 p-4 text-xs">
        <Zap className="size-4 shrink-0 text-[#e5c158]" />
        <span className="font-sans text-zinc-200 font-bold">{safeBriefing.aiRecommendation}</span>
      </div>
    </div>
  );
}
