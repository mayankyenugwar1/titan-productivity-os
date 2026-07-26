import { Award, CheckCircle2, Compass, Flame, ShieldAlert, Sparkles } from "lucide-react";
import type { DailyBriefingData } from "@/services/ai/briefingService";
import { TitanBadge } from "@/components/ui";

interface BriefingWidgetProps {
  briefing: DailyBriefingData;
  onActionClick: (prompt: string) => void;
}

export default function BriefingWidget({ briefing, onActionClick }: BriefingWidgetProps) {
  return (
    <div className="rounded-3xl border border-[#d4af37]/40 bg-[#0d0d10] p-6 shadow-2xl shadow-black font-mono space-y-5">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3.5">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl border border-[#d4af37]/30 bg-[#d4af37]/15 text-[#e5c158]">
            <Compass className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <TitanBadge variant="gold" size="sm">
                EXECUTIVE DAILY BRIEFING
              </TitanBadge>
              <span className="text-[10px] text-zinc-500 font-bold">{briefing.date}</span>
            </div>
            <h3 className="mt-1 font-sans text-base font-bold text-white">Daily Operational Directive</h3>
          </div>
        </div>
      </div>

      <p className="font-sans text-xs text-zinc-300 leading-relaxed">{briefing.summary}</p>

      {/* Metric Tiles */}
      <div className="grid gap-3 sm:grid-cols-4 text-xs">
        <div className="rounded-2xl border border-zinc-800/80 bg-[#070709] p-3.5 space-y-1">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-[10px] font-bold uppercase">Missions Today</span>
            <CheckCircle2 className="size-3.5 text-emerald-400" />
          </div>
          <p className="text-xl font-black text-white">
            {briefing.completedMissionsToday} / {briefing.totalMissionsToday}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800/80 bg-[#070709] p-3.5 space-y-1">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-[10px] font-bold uppercase">Critical Pending</span>
            <ShieldAlert className="size-3.5 text-red-400" />
          </div>
          <p className="text-xl font-black text-red-400">{briefing.criticalPendingMissions}</p>
        </div>

        <div className="rounded-2xl border border-zinc-800/80 bg-[#070709] p-3.5 space-y-1">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-[10px] font-bold uppercase">Active Projects</span>
            <Award className="size-3.5 text-purple-400" />
          </div>
          <p className="text-xl font-black text-purple-400">{briefing.activeProjectsCount}</p>
        </div>

        <div className="rounded-2xl border border-zinc-800/80 bg-[#070709] p-3.5 space-y-1">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-[10px] font-bold uppercase">Combat Streak</span>
            <Flame className="size-3.5 text-yellow-400" />
          </div>
          <p className="text-xl font-black text-yellow-400">{briefing.xpStreak} DAYS</p>
        </div>
      </div>

      {/* Focus Recommendation Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#d4af37]/30 bg-[#d4af37]/10 p-4 text-xs">
        <div className="flex items-center gap-2 text-[#e5c158]">
          <Sparkles className="size-4 shrink-0" />
          <span className="font-sans font-bold text-xs text-[#e5c158]">{briefing.focusRecommendation}</span>
        </div>

        <button
          onClick={() => onActionClick(briefing.suggestedNextAction)}
          className="rounded-xl border border-[#d4af37]/40 bg-[#d4af37] px-3.5 py-1.5 font-bold text-zinc-950 hover:bg-[#e5c158] transition"
        >
          {briefing.suggestedNextAction}
        </button>
      </div>
    </div>
  );
}
