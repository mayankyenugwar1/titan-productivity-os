import { Activity, CheckCircle2, Flame, Plus, ShieldCheck, Trophy } from "lucide-react";
import { motion } from "framer-motion";

import { ICON_SIZES, TitanBadge, TitanButton, TitanProgress } from "@/components/ui";
import { fadeUp, staggerContainer } from "@/animations/motion";
import { useHabitStore } from "@/store/missionStore";
import type { Habit } from "@/features/missions/types";

type HeroBannerProps = {
  onNewMission?: () => void;
};

export default function HeroBanner({ onNewMission }: HeroBannerProps) {
  const { habits, totalXP, streak, focusScore } = useHabitStore();

  const completedTodayCount = habits.filter((habit: Habit) => habit.completed).length;
  const totalMissionsCount = habits.length;

  const readinessPercent = totalMissionsCount > 0
    ? Math.round((completedTodayCount / totalMissionsCount) * 100)
    : focusScore || 0;

  const level = Math.floor(totalXP / 500) + 1;
  const getRank = (lvl: number) => {
    if (lvl < 2) return "RECRUIT";
    if (lvl < 4) return "OPERATIVE";
    if (lvl < 7) return "VETERAN";
    if (lvl < 10) return "COMMANDER";
    return "TITAN PRIME";
  };

  const rank = getRank(level);

  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="relative overflow-hidden rounded-[2rem] border border-zinc-800 bg-gradient-to-br from-zinc-950 via-black to-zinc-900 p-8 sm:p-10 shadow-2xl shadow-black/40"
    >
      {/* Background glow effects */}
      <div className="absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-yellow-400/[0.06] blur-[120px] pointer-events-none" />
      <div className="absolute -left-40 -bottom-40 h-[350px] w-[350px] rounded-full bg-yellow-500/[0.04] blur-[120px] pointer-events-none" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-yellow-400/60 to-transparent" />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative space-y-8"
      >
        {/* Header & Quick Action */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center"
        >
          <div>
            <div className="flex items-center gap-2 text-yellow-400">
              <ShieldCheck className="size-4" />
              <p className="text-xs font-bold uppercase tracking-[0.35em]">
                MISSION READINESS COMMAND
              </p>
            </div>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
              System Readiness Level
            </h2>
          </div>

          <TitanButton
            size="lg"
            leftIcon={<Plus size={ICON_SIZES.md} />}
            onClick={onNewMission}
            className="self-start sm:self-auto"
          >
            + New Mission
          </TitanButton>
        </motion.div>

        {/* Readiness Progress Bar */}
        <motion.div variants={fadeUp} className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold uppercase tracking-[0.18em] text-zinc-400">
              Mission Readiness
            </span>
            <span className="font-black text-yellow-400 text-base">
              {readinessPercent}%
            </span>
          </div>

          <TitanProgress value={readinessPercent} />
        </motion.div>

        {/* Key Metrics Grid */}
        <motion.div
          variants={fadeUp}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {/* Mission Readiness % */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 transition hover:border-yellow-400/30">
            <div className="flex items-center justify-between text-zinc-500">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em]">Readiness</span>
              <Activity className="size-4 text-yellow-400" />
            </div>
            <p className="mt-3 text-3xl font-black text-white">{readinessPercent}%</p>
            <p className="mt-1 text-xs text-zinc-500">Operational status</p>
          </div>

          {/* Completed Today */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 transition hover:border-yellow-400/30">
            <div className="flex items-center justify-between text-zinc-500">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em]">Completed Today</span>
              <CheckCircle2 className="size-4 text-emerald-400" />
            </div>
            <p className="mt-3 text-3xl font-black text-white">{completedTodayCount} / {totalMissionsCount}</p>
            <p className="mt-1 text-xs text-zinc-500">Missions resolved</p>
          </div>

          {/* Combat Streak */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 transition hover:border-yellow-400/30">
            <div className="flex items-center justify-between text-zinc-500">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em]">Combat Streak</span>
              <Flame className="size-4 text-yellow-400" />
            </div>
            <p className="mt-3 text-3xl font-black text-white">{streak} Days</p>
            <p className="mt-1 text-xs text-zinc-500">Active consistency</p>
          </div>

          {/* Current Rank */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 transition hover:border-yellow-400/30">
            <div className="flex items-center justify-between text-zinc-500">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em]">Current Rank</span>
              <Trophy className="size-4 text-yellow-400" />
            </div>
            <div className="mt-3">
              <TitanBadge variant="gold" glow size="sm">
                {rank}
              </TitanBadge>
            </div>
            <p className="mt-2 text-xs text-zinc-500">Level {level} Clearance</p>
          </div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}