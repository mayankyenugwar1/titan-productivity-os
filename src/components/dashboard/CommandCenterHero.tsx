import { useEffect, useMemo, useState } from "react";
import { safeDateString, safeTime } from "@/utils/safeDate";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart3,
  Bot,
  Clock,
  Compass,
  Flame,
  Plus,
  Radio,
  Target,
  User,
  Zap,
} from "lucide-react";

import { TitanBadge, TitanButton, TitanProgress } from "@/components/ui";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import { fadeUp, staggerContainer } from "@/animations/motion";
import { useHabitStore } from "@/store/missionStore";
import { getDynamicGreeting } from "@/utils/greetingUtils";
import type { Habit } from "@/features/missions/types";

type CommandCenterHeroProps = {
  onNewMission: () => void;
};

export default function CommandCenterHero({ onNewMission }: CommandCenterHeroProps) {
  const navigate = useNavigate();
  const { habits, totalXP, streak, focusScore } = useHabitStore();

  // SECTION 1: Live Digital Clock & Greeting
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const greetingInfo = useMemo(() => getDynamicGreeting("Operator"), []);
  const getGreeting = () => greetingInfo.salutation;

  const formattedDate = useMemo(() => {
    return safeDateString(time, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, [time]);

  const formattedTime = useMemo(() => {
    return safeTime(time, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }, [time]);

  // SECTION 2: Real State Metrics from Supabase Store
  const completedToday = useMemo(() => habits.filter((h: Habit) => h.completed), [habits]);
  const activeMissions = useMemo(() => habits.filter((h: Habit) => !h.completed), [habits]);
  const totalMissions = habits.length;

  const readinessPercent = useMemo(() => {
    if (totalMissions === 0) return focusScore > 0 ? focusScore : 0;
    return Math.round((completedToday.length / totalMissions) * 100);
  }, [completedToday.length, totalMissions, focusScore]);

  const level = Math.floor(totalXP / 500) + 1;
  const getRank = (lvl: number) => {
    if (lvl < 2) return "RECRUIT";
    if (lvl < 4) return "OPERATIVE";
    if (lvl < 7) return "VETERAN";
    if (lvl < 10) return "COMMANDER";
    return "TITAN PRIME";
  };
  const rank = getRank(level);

  const priorityMission = activeMissions.find((h: Habit) => h.priority === "High") || activeMissions[0] || null;
  const recommendedNextTitle = activeMissions[0]?.title || "Daily Executive Briefing";
  const estimatedXPToday = activeMissions.reduce((acc: number, h: Habit) => acc + h.xp, 0);

  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="relative overflow-hidden rounded-[2rem] border border-zinc-800/80 bg-gradient-to-b from-[#09090b] via-[#0d0d10] to-[#08080a] p-6 sm:p-7 lg:p-8 shadow-2xl shadow-black/90 backdrop-blur-2xl"
    >
      {/* Subtle Scanline Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.025]" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-transparent via-[#d4af37]/60 to-transparent" />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative space-y-6"
      >
        {/* SECTION 1: LIVE HEADER BAR WITH DYNAMIC GREETING & DIGITAL CLOCK */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800/60 pb-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100 sm:text-3xl lg:text-4xl">
              {getGreeting()}
            </h1>
            <p className="mt-1 font-mono text-xs text-[#e5c158]/90 tracking-wider">
              {formattedDate}
            </p>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-zinc-800/60 bg-[#0c0c0f]/90 px-4 py-2.5 shadow-lg backdrop-blur-xl">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-xs font-bold text-zinc-300">LIVE CHRONO</span>
            </div>
            <span className="text-zinc-700">|</span>
            <div className="flex items-center gap-1.5 font-mono text-sm font-black text-[#e5c158]">
              <Clock className="size-4 text-[#e5c158]" />
              <span>{formattedTime}</span>
            </div>
          </div>
        </div>

        {/* 3-COLUMN OPERATOR COMMAND CENTER LAYOUT */}
        <div className="grid gap-5 xl:grid-cols-12 xl:items-stretch">
          {/* COLUMN 1: LEFT - SECTION 2: OPERATOR STATUS (3 cols on XL) */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col justify-between space-y-4 rounded-2xl border border-zinc-800/70 bg-[#0c0c0f]/90 p-5 shadow-xl backdrop-blur-xl xl:col-span-3"
          >
            <div>
              <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#e5c158]">
                  <Radio className="size-3.5" />
                  <span>OPERATOR STATUS</span>
                </div>
                <TitanBadge variant="gold" glow size="sm">
                  {rank}
                </TitanBadge>
              </div>

              {/* Real State Metrics */}
              <div className="mt-4 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Current Level</span>
                  <span className="font-bold text-zinc-100">Level {level}</span>
                </div>

                <div className="flex items-center justify-between border-t border-zinc-800/40 pt-2.5">
                  <span className="text-zinc-500">Total XP</span>
                  <span className="font-bold text-[#e5c158]">
                    +<AnimatedNumber value={totalXP} /> XP
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-zinc-800/40 pt-2.5">
                  <span className="text-zinc-500">Combat Streak</span>
                  <span className="inline-flex items-center gap-1 font-bold text-[#e5c158]">
                    <Flame className="size-3.5 text-[#e5c158]" />
                    <AnimatedNumber value={streak} /> Days
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-zinc-800/40 pt-2.5">
                  <span className="text-zinc-500">Active Missions</span>
                  <span className="font-bold text-zinc-200">
                    <AnimatedNumber value={activeMissions.length} />
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-zinc-800/40 pt-2.5">
                  <span className="text-zinc-500">Completed Today</span>
                  <span className="font-bold text-emerald-400">
                    <AnimatedNumber value={completedToday.length} />
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-zinc-800/40 pt-2.5">
                  <span className="text-zinc-500">Today's Completion %</span>
                  <span className="font-bold text-emerald-400">
                    <AnimatedNumber value={readinessPercent} suffix="%" />
                  </span>
                </div>
              </div>
            </div>

            {/* Mission Readiness Progress Bar */}
            <div className="mt-4 space-y-2 border-t border-zinc-800/60 pt-3.5">
              <div className="flex items-center justify-between text-[11px] font-semibold">
                <span className="text-zinc-400 uppercase tracking-wider">Mission Readiness</span>
                <span className="text-[#e5c158] font-bold">{readinessPercent}%</span>
              </div>
              <TitanProgress value={readinessPercent} />
            </div>
          </motion.div>

          {/* COLUMN 2: CENTER - SECTION 3: DAILY AI BRIEFING (6 cols on XL) */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col space-y-4 xl:col-span-6"
          >
            {/* AI COMMANDER CARD */}
            <div className="rounded-2xl border border-zinc-800/70 bg-[#0c0c0f]/90 p-5 shadow-xl backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-7 items-center justify-center rounded-lg border border-[#d4af37]/30 bg-[#d4af37]/10 text-[#e5c158]">
                    <Bot className="size-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-[0.25em] text-[#e5c158]">
                      AI COMMANDER
                    </h3>
                    <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
                      Operational Intelligence Briefing
                    </p>
                  </div>
                </div>

                <TitanBadge variant="gold" size="sm">
                  DAILY BRIEF
                </TitanBadge>
              </div>

              {/* Generated Briefing Summary using Real Data */}
              <div className="mt-3.5 rounded-xl border border-zinc-800/60 bg-[#070709] p-4 text-xs text-zinc-300 leading-relaxed font-sans">
                <p className="font-semibold text-zinc-200">Operator,</p>
                <p className="mt-1.5">
                  You currently have <span className="font-bold text-[#e5c158]">{activeMissions.length} active missions</span> awaiting tactical execution.
                </p>
                <p className="mt-1.5">
                  Highest priority mission: <span className="font-bold text-white">{priorityMission?.title || "None (All Missions Completed)"}</span>.
                </p>
                <div className="mt-3 grid grid-cols-3 gap-2 font-mono text-[11px]">
                  <div className="rounded-lg bg-zinc-950 p-2 border border-zinc-800/60">
                    <span className="block text-[9px] text-zinc-500 uppercase">Estimated Completion</span>
                    <span className="font-bold text-emerald-400">{readinessPercent}%</span>
                  </div>
                  <div className="rounded-lg bg-zinc-950 p-2 border border-zinc-800/60">
                    <span className="block text-[9px] text-zinc-500 uppercase">Current Streak</span>
                    <span className="font-bold text-[#e5c158]">{streak} Days</span>
                  </div>
                  <div className="rounded-lg bg-zinc-950 p-2 border border-zinc-800/60">
                    <span className="block text-[9px] text-zinc-500 uppercase">Focus Score</span>
                    <span className="font-bold text-sky-400">{focusScore || readinessPercent}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Priority Mission & Telemetry Cards */}
            <div className="grid gap-3.5 sm:grid-cols-2">
              {/* Priority Mission Card */}
              <div className="flex flex-col justify-between rounded-2xl border border-zinc-800/60 bg-[#0c0c0f]/90 p-4 transition duration-500 hover:border-[#d4af37]/30">
                <div>
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">
                    <span>Priority Mission</span>
                    <Target className="size-3.5 text-[#e5c158]" />
                  </div>
                  <h4 className="mt-2 text-sm font-bold text-white line-clamp-1">
                    {priorityMission ? priorityMission.title : "High XP Operation"}
                  </h4>
                  <p className="mt-1 text-xs text-zinc-400 line-clamp-2">
                    {priorityMission?.description || "Execute classified physical operations."}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-zinc-800/50 pt-2.5">
                  <TitanBadge variant="red" size="sm">
                    High Priority
                  </TitanBadge>
                  <span className="text-xs font-bold text-[#e5c158]">
                    +{priorityMission?.xp || 100} XP
                  </span>
                </div>
              </div>

              {/* Recommended Next Mission */}
              <div className="flex flex-col justify-between rounded-2xl border border-zinc-800/60 bg-[#0c0c0f]/90 p-4 transition duration-500 hover:border-[#d4af37]/30">
                <div>
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">
                    <span>Recommended Next</span>
                    <Compass className="size-3.5 text-sky-400" />
                  </div>
                  <h4 className="mt-2 text-sm font-bold text-white line-clamp-1">
                    {recommendedNextTitle}
                  </h4>
                  <p className="mt-1 text-xs text-zinc-400">
                    Optimal focus window deployment.
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-zinc-800/50 pt-2.5">
                  <span className="inline-flex items-center gap-1 text-[11px] text-zinc-400">
                    <Clock className="size-3 text-zinc-500" />
                    30 mins
                  </span>
                  <TitanBadge variant="blue" size="sm">
                    Recommended
                  </TitanBadge>
                </div>
              </div>
            </div>

            {/* Metrics Bar: Estimated XP Today, Focus Score, Energy Reserve */}
            <div className="grid grid-cols-3 gap-3">
              {/* Estimated XP Today */}
              <div className="rounded-xl border border-zinc-800/60 bg-[#0c0c0f]/90 p-3 text-center transition duration-500 hover:border-[#d4af37]/30">
                <p className="text-[9px] font-semibold uppercase tracking-wider text-zinc-500">Est. XP Today</p>
                <p className="mt-1 text-base font-extrabold text-[#e5c158]">+{estimatedXPToday} XP</p>
              </div>

              {/* Focus Score */}
              <div className="rounded-xl border border-zinc-800/60 bg-[#0c0c0f]/90 p-3 text-center transition duration-500 hover:border-[#d4af37]/30">
                <p className="text-[9px] font-semibold uppercase tracking-wider text-zinc-500">Focus Score</p>
                <p className="mt-1 text-base font-extrabold text-emerald-400">{focusScore || 94}%</p>
              </div>

              {/* Energy Reserve */}
              <div className="rounded-xl border border-zinc-800/60 bg-[#0c0c0f]/90 p-3 text-center transition duration-500 hover:border-[#d4af37]/30">
                <p className="text-[9px] font-semibold uppercase tracking-wider text-zinc-500">Energy Reserve</p>
                <p className="mt-1 text-base font-extrabold text-sky-400">98% OPTIMAL</p>
              </div>
            </div>
          </motion.div>

          {/* COLUMN 3: RIGHT - SECTION 6: QUICK ACTIONS (3 cols on XL) */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col justify-between space-y-4 rounded-2xl border border-zinc-800/70 bg-[#0c0c0f]/90 p-5 shadow-xl backdrop-blur-xl xl:col-span-3"
          >
            <div>
              <div className="flex items-center gap-2 border-b border-zinc-800/60 pb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#e5c158]">
                <Zap className="size-3.5" />
                <span>QUICK ACTIONS</span>
              </div>

              <div className="mt-4 space-y-3">
                {/* 1. New Mission */}
                <TitanButton
                  fullWidth
                  size="md"
                  leftIcon={<Plus className="size-4" />}
                  onClick={onNewMission}
                >
                  NEW MISSION
                </TitanButton>

                {/* 2. Mission Control */}
                <TitanButton
                  fullWidth
                  variant="secondary"
                  size="md"
                  leftIcon={<Target className="size-4 text-zinc-400" />}
                  onClick={() => navigate("/habits")}
                >
                  MISSION CONTROL
                </TitanButton>

                {/* 3. Analytics */}
                <TitanButton
                  fullWidth
                  variant="secondary"
                  size="md"
                  leftIcon={<BarChart3 className="size-4 text-zinc-400" />}
                  onClick={() => navigate("/achievements")}
                >
                  ANALYTICS
                </TitanButton>

                {/* 4. Operator Profile */}
                <TitanButton
                  fullWidth
                  variant="secondary"
                  size="md"
                  leftIcon={<User className="size-4 text-[#e5c158]" />}
                  onClick={() => navigate("/profile")}
                >
                  OPERATOR PROFILE
                </TitanButton>
              </div>
            </div>

            {/* Wayne OS Footer */}
            <div className="mt-4 border-t border-zinc-800/60 pt-3.5 text-center text-[10px] font-medium text-zinc-500 uppercase tracking-widest">
              WAYNE ENTERPRISES // COMMAND CENTER
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  );
}
