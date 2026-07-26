import { useMemo } from "react";
import { Zap } from "lucide-react";
import { useHabitStore } from "@/store/missionStore";
import { evaluateChallenges } from "@/services/challengeService";
import { SectionHeader, TitanBadge, TitanProgress } from "@/components/ui";

export default function ChallengesWidget() {
  const { habits, totalXP } = useHabitStore();

  const { dailyChallenges, weeklyOperations } = useMemo(
    () => evaluateChallenges(habits, totalXP),
    [habits, totalXP]
  );

  return (
    <div className="space-y-8 font-mono text-zinc-100">
      {/* 1. Daily Challenges Section */}
      <div className="rounded-3xl border border-zinc-800/80 bg-[#070709] p-6 sm:p-8 shadow-2xl shadow-black space-y-6">
        <SectionHeader
          badge="Daily Directives"
          title="Daily Tactical Challenges"
          description="Accomplish daily operational parameters to earn bonus XP and coin yields."
        />

        <div className="grid gap-4 sm:grid-cols-3">
          {dailyChallenges.map((c) => {
            const percent = Math.min(100, Math.round((c.progress / c.requirement) * 100));

            return (
              <div
                key={c.id}
                className={`rounded-2xl border p-4.5 space-y-3 transition duration-300 ${
                  c.completed
                    ? "border-emerald-500/40 bg-emerald-950/10"
                    : "border-zinc-800/80 bg-[#0d0d10] hover:border-[#d4af37]/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <TitanBadge variant={c.completed ? "green" : "gold"} size="sm">
                    {c.completed ? "COMPLETED" : "ACTIVE"}
                  </TitanBadge>
                  <div className="flex items-center gap-1.5 text-xs text-[#e5c158] font-bold">
                    <Zap className="size-3.5" />
                    <span>+{c.xpReward} XP</span>
                  </div>
                </div>

                <h4 className="font-sans font-bold text-sm text-zinc-100">{c.title}</h4>
                <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">{c.description}</p>

                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[10px] text-zinc-400">
                    <span>Progress</span>
                    <span className="font-bold text-[#e5c158]">
                      {c.progress} / {c.requirement} ({percent}%)
                    </span>
                  </div>
                  <TitanProgress value={percent} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Weekly Operations Section */}
      <div className="rounded-3xl border border-zinc-800/80 bg-[#070709] p-6 sm:p-8 shadow-2xl shadow-black space-y-6">
        <SectionHeader
          badge="Weekly Task Force"
          title="Weekly Operational Directives"
          description="High-tier weekly operations for senior field commanders."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {weeklyOperations.map((w) => {
            const percent = Math.min(100, Math.round((w.progress / w.requirement) * 100));

            return (
              <div
                key={w.id}
                className={`rounded-2xl border p-4.5 space-y-3 transition duration-300 ${
                  w.completed
                    ? "border-emerald-500/40 bg-emerald-950/10"
                    : "border-zinc-800/80 bg-[#0d0d10] hover:border-[#d4af37]/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <TitanBadge variant={w.completed ? "green" : "blue"} size="sm">
                    {w.completed ? "ACCOMPLISHED" : "IN PROGRESS"}
                  </TitanBadge>
                  <div className="flex items-center gap-1 text-xs text-zinc-300 font-bold">
                    <span>🪙 +{w.coinReward}</span>
                  </div>
                </div>

                <h4 className="font-sans font-bold text-sm text-zinc-100">{w.title}</h4>
                <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">{w.description}</p>

                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[10px] text-zinc-400">
                    <span>Target Progress</span>
                    <span className="font-bold text-sky-400">
                      {w.progress} / {w.requirement}
                    </span>
                  </div>
                  <TitanProgress value={percent} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
