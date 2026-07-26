import { useMemo } from "react";
import { Flame, Shield, ShieldCheck, Trophy, Zap } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useHabitStore } from "@/store/missionStore";
import { getProgressionDetails } from "@/services/xpEngineService";
import XPActivityLog from "@/components/progression/XPActivityLog";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import { SectionHeader, TitanBadge, TitanProgress } from "@/components/ui";

export default function Profile() {
  const { user } = useAuth();
  const { totalXP, streak, focusScore, habits } = useHabitStore();

  const progression = useMemo(() => getProgressionDetails(totalXP), [totalXP]);

  const activeMissionsCount = useMemo(() => habits.filter((h) => !h.completed).length, [habits]);
  const completedMissionsCount = useMemo(() => habits.filter((h) => h.completed).length, [habits]);

  return (
    <div className="space-y-10 py-4 font-mono text-zinc-100">
      <SectionHeader
        badge="Operator Classification Dossier"
        title="Operator Profile Telemetry"
        description="Centralized clearance dossier, operator rank progression, and XP activity log."
      />

      {/* Operator Rank & Level Clearance Card */}
      <div className="relative overflow-hidden rounded-[2rem] border border-[#d4af37]/35 bg-gradient-to-b from-[#09090b] via-[#0d0d10] to-[#08080a] p-6.5 sm:p-8 shadow-2xl shadow-black">
        {/* Ambient Background Glow */}
        <div className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-[#d4af37]/[0.05] blur-[120px]" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#d4af37] via-emerald-400 to-[#d4af37]" />

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4.5">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl border border-[#d4af37]/40 bg-[#d4af37]/10 text-[#e5c158] shadow-[0_0_20px_rgba(212,175,55,0.2)]">
              <Shield className="size-9 stroke-[2]" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <TitanBadge variant="gold" size="sm">
                  RANK: {progression.rank.toUpperCase()}
                </TitanBadge>
                <span className="text-xs font-bold text-zinc-400 font-mono">
                  {user?.email || "OPERATOR PRIME"}
                </span>
              </div>

              <h2 className="mt-1 font-sans text-2xl font-black text-white sm:text-3xl">
                Classified Operator Status
              </h2>
            </div>
          </div>

          {/* Rank Clearance Badge */}
          <div className="flex items-center gap-3.5 rounded-2xl border border-zinc-800 bg-[#121217] p-4 text-xs font-mono">
            <Trophy className="size-6 text-[#e5c158]" />
            <div>
              <span className="block text-xs font-bold text-zinc-500 uppercase tracking-wider">Clearance Level</span>
              <span className="text-xl font-bold text-white">Level {progression.level}</span>
            </div>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div className="mt-8 space-y-2 border-t border-zinc-800/80 pt-6 font-mono">
          <div className="flex justify-between text-xs">
            <span className="text-zinc-400 font-bold">Level {progression.level} Progression</span>
            <span className="font-bold text-[#e5c158]">
              {progression.currentLevelXP} / {progression.xpRequired} XP ({progression.progressPercent}%)
            </span>
          </div>
          <TitanProgress value={progression.progressPercent} />
        </div>
      </div>

      {/* 4 Operator Status Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-xs font-mono">
        {/* Total XP */}
        <div className="rounded-2xl border border-[#d4af37]/30 bg-[#d4af37]/10 p-5 space-y-2">
          <div className="flex items-center justify-between text-[#e5c158]">
            <span className="text-xs uppercase tracking-wider font-bold">Total Accumulated XP</span>
            <Zap className="size-4" />
          </div>
          <p className="text-3xl font-black text-[#e5c158]">
            <AnimatedNumber value={progression.totalXP} suffix=" XP" />
          </p>
        </div>

        {/* Combat Streak */}
        <div className="rounded-2xl border border-zinc-800/80 bg-[#0d0d10] p-5 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs uppercase tracking-wider font-bold">Combat Streak</span>
            <Flame className="size-4 text-[#e5c158]" />
          </div>
          <p className="text-3xl font-black text-white">
            <AnimatedNumber value={streak} suffix=" Days" />
          </p>
        </div>

        {/* Focus Score */}
        <div className="rounded-2xl border border-zinc-800/80 bg-[#0d0d10] p-5 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs uppercase tracking-wider font-bold">Focus Execution Score</span>
            <ShieldCheck className="size-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-emerald-400">
            <AnimatedNumber value={focusScore} suffix="%" />
          </p>
        </div>

        {/* Completed Operations */}
        <div className="rounded-2xl border border-zinc-800/80 bg-[#0d0d10] p-5 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs uppercase tracking-wider font-bold">Accomplished Missions</span>
            <Trophy className="size-4 text-sky-400" />
          </div>
          <p className="text-3xl font-black text-zinc-100">
            <AnimatedNumber value={completedMissionsCount} />
            <span className="text-xs text-zinc-500 font-normal ml-2">({activeMissionsCount} Active)</span>
          </p>
        </div>
      </div>

      {/* XP Activity Log */}
      <XPActivityLog />
    </div>
  );
}