import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Check,
  Clock,
  Code,
  Dumbbell,
  Flame,
  ListOrdered,
  Moon,
  Sparkles,
  Sun,
  Sunset,
  Sunrise,
  Utensils,
} from "lucide-react";

import { ICON_SIZES, TitanBadge, TitanButton } from "@/components/ui";
import { fadeUp } from "@/animations/motion";
import { useAuth } from "@/context/AuthContext";
import { useHabitStore } from "@/store/missionStore";
import type { Habit } from "@/features/missions/types";

type TimePeriod = "Morning" | "Afternoon" | "Evening" | "Night";

function computePriorityScore(habit: Habit): number {
  const xpReward = habit.xp;
  const priorityWeight = habit.priority === "High" ? 120 : habit.priority === "Medium" ? 60 : 20;
  const difficultyWeight = habit.category === "Physical" ? 40 : habit.category === "Operations" ? 30 : 15;
  const pendingBonus = habit.completed ? -300 : 150;
  return xpReward + priorityWeight + difficultyWeight + pendingBonus;
}

function getScheduledTime(habit: Habit, index: number): string {
  if (habit.completedAt) {
    return new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }).format(habit.completedAt);
  }
  const baseHour = 7 + (index * 4) % 16;
  const hourStr = baseHour < 10 ? `0${baseHour}` : `${baseHour}`;
  return `${hourStr}:00`;
}

function getTimePeriod(scheduledTime: string): TimePeriod {
  const hour = parseInt(scheduledTime.split(":")[0], 10);
  if (hour >= 5 && hour < 12) return "Morning";
  if (hour >= 12 && hour < 17) return "Afternoon";
  if (hour >= 17 && hour < 21) return "Evening";
  return "Night";
}

function getPeriodIcon(period: TimePeriod) {
  if (period === "Morning") return Sunrise;
  if (period === "Afternoon") return Sun;
  if (period === "Evening") return Sunset;
  return Moon;
}

function getDuration(habit: Habit): string {
  if (habit.priority === "High") return "90 min";
  if (habit.priority === "Medium") return "45 min";
  return "20 min";
}

function getIcon(habit: Habit) {
  if (habit.category === "Physical") return Dumbbell;
  if (habit.category === "Knowledge") return BookOpen;
  if (habit.category === "Operations") return Code;
  return Utensils;
}

type MissionTimelineEngineProps = {
  onNewMission?: () => void;
};

export default function MissionTimelineEngine({ onNewMission }: MissionTimelineEngineProps) {
  const { user } = useAuth();
  const { habits, toggleHabit } = useHabitStore();

  // 1. Mission Timeline Grouped by Morning, Afternoon, Evening, Night
  const groupedTimeline = useMemo(() => {
    const periodOrder: TimePeriod[] = ["Morning", "Afternoon", "Evening", "Night"];
    const items = habits.map((habit, index) => {
      const scheduledTime = getScheduledTime(habit, index);
      const period = getTimePeriod(scheduledTime);
      return {
        habit,
        scheduledTime,
        period,
        duration: getDuration(habit),
        icon: getIcon(habit),
      };
    });

    return periodOrder
      .map((period) => ({
        period,
        icon: getPeriodIcon(period),
        missions: items.filter((item) => item.period === period),
      }))
      .filter((group) => group.missions.length > 0);
  }, [habits]);

  // 2. Priority Engine: Live ranking dynamically based on Priority Score
  const rankedPriorityMissions = useMemo(() => {
    return [...habits]
      .sort((a, b) => computePriorityScore(b) - computePriorityScore(a))
      .slice(0, 4);
  }, [habits]);

  const topPriorityHabit = rankedPriorityMissions.find((h) => !h.completed) || habits[0];

  const handleToggle = (id: string) => {
    if (user) {
      void toggleHabit(user.id, id);
    }
  };

  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="relative overflow-hidden rounded-[2rem] border border-zinc-800/80 bg-gradient-to-b from-[#09090b] via-[#0d0d10] to-[#08080a] p-6 sm:p-7 lg:p-8 shadow-2xl shadow-black/90 backdrop-blur-2xl"
    >
      {/* Ambient Lighting */}
      <div className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-[#d4af37]/[0.03] blur-[120px]" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-transparent via-[#d4af37]/60 to-transparent" />

      {/* MAIN 70/30 GRID SPLIT */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* LEFT (70%): MISSION TIMELINE GROUPED BY PERIODS (8 cols on XL / 7 cols on LG) */}
        <div className="space-y-6 lg:col-span-7 xl:col-span-8">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-800/60 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-xl border border-[#d4af37]/30 bg-[#d4af37]/10 text-[#e5c158]">
                <Clock size={ICON_SIZES.sm} />
              </div>
              <div>
                <h2 className="text-sm font-bold uppercase tracking-[0.25em] text-[#e5c158] sm:text-base">
                  MISSION TIMELINE
                </h2>
                <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
                  Morning · Afternoon · Evening · Night Schedule
                </p>
              </div>
            </div>
            <TitanBadge variant="gold" size="sm">
              CHRONO MATRIX
            </TitanBadge>
          </div>

          {/* Grouped Timeline List */}
          {groupedTimeline.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-800 p-8 text-center bg-[#0c0c0f]">
              <p className="text-xs text-zinc-400">No active missions loaded from Supabase.</p>
              {onNewMission && (
                <div className="mt-4">
                  <TitanButton size="sm" onClick={onNewMission}>
                    + Deploy First Mission
                  </TitanButton>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {groupedTimeline.map((group) => {
                const PeriodIcon = group.icon;

                return (
                  <div key={group.period} className="space-y-3">
                    {/* Period Subheader Badge */}
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#e5c158]/90">
                      <PeriodIcon className="size-4 text-[#e5c158]" />
                      <span>{group.period} Operations</span>
                      <span className="h-px flex-1 bg-zinc-800/60" />
                    </div>

                    <div className="relative border-l border-zinc-800/70 pl-6 sm:pl-8 space-y-3.5">
                      {group.missions.map(({ habit, scheduledTime, duration, icon: Icon }) => {
                        const badgeVariant =
                          habit.priority === "High" ? "red" : habit.priority === "Medium" ? "gold" : "blue";
                        const priorityLabel = `${habit.priority.toUpperCase()} PRIORITY`;

                        return (
                          <div key={habit.id} className="group relative">
                            {/* Timeline Connector Dot Node */}
                            <div
                              className={`absolute -left-[31px] sm:-left-[39px] top-4 flex size-8 items-center justify-center rounded-full border shadow-md transition-all duration-500 ${
                                habit.completed
                                  ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                                  : "border-[#d4af37]/30 bg-[#0d0d10] text-[#e5c158] group-hover:border-[#d4af37] group-hover:bg-[#d4af37]/10"
                              }`}
                            >
                              <Icon className="size-3.5" />
                            </div>

                            {/* Mission Card Box */}
                            <div
                              className={`rounded-2xl border p-4.5 transition-all duration-500 ${
                                habit.completed
                                  ? "border-emerald-500/20 bg-emerald-950/10"
                                  : "border-zinc-800/60 bg-[#0c0c0f]/90 hover:border-[#d4af37]/40 hover:bg-[#111116]"
                              }`}
                            >
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                  {/* Completion Checkbox */}
                                  <button
                                    onClick={() => handleToggle(habit.id)}
                                    aria-label={habit.completed ? `Mark ${habit.title} incomplete` : `Mark ${habit.title} complete`}
                                    className={`flex size-7 shrink-0 items-center justify-center rounded-lg border transition duration-500 ${
                                      habit.completed
                                        ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                                        : "border-zinc-700 bg-black/40 text-zinc-500 hover:border-[#d4af37]/50 hover:text-[#e5c158]"
                                    }`}
                                  >
                                    {habit.completed ? <Check className="size-4 stroke-[3]" /> : <div className="size-2 rounded-xs bg-zinc-600" />}
                                  </button>

                                  <div>
                                    <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                                      <span className="font-bold text-[#e5c158]">
                                        {scheduledTime}
                                      </span>
                                      <span className="text-zinc-600">·</span>
                                      <span className="text-[10px] text-zinc-500">
                                        {duration}
                                      </span>
                                    </div>

                                    <h3
                                      className={`mt-1 font-sans text-sm font-bold sm:text-base ${
                                        habit.completed ? "line-through text-zinc-500" : "text-zinc-100"
                                      }`}
                                    >
                                      {habit.title}
                                    </h3>
                                    {habit.description && (
                                      <p className="mt-0.5 text-xs text-zinc-400 line-clamp-1">
                                        {habit.description}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                {/* Right Meta Badges */}
                                <div className="flex items-center gap-2 font-mono">
                                  <TitanBadge variant={badgeVariant} size="sm">
                                    {priorityLabel}
                                  </TitanBadge>
                                  <span className="font-mono text-xs font-bold text-[#e5c158]">
                                    +{habit.xp} XP
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT (30%): MISSION PRIORITY ENGINE (5 cols on XL / 5 cols on LG) */}
        <div className="flex flex-col justify-between space-y-5 rounded-2xl border border-zinc-800/70 bg-[#0c0c0f]/90 p-5 backdrop-blur-xl lg:col-span-5 xl:col-span-4">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex size-7 items-center justify-center rounded-lg border border-[#d4af37]/30 bg-[#d4af37]/10 text-[#e5c158]">
                  <ListOrdered size={ICON_SIZES.sm} />
                </div>
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-[#e5c158]">
                    PRIORITY ENGINE v1
                  </h2>
                  <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
                    Wayne Core Ranking
                  </p>
                </div>
              </div>
              <Flame className="size-4 text-[#e5c158]" />
            </div>

            {/* Ranked Cards */}
            {rankedPriorityMissions.length === 0 ? (
              <div className="rounded-xl border border-zinc-800/60 p-4 text-center text-xs text-zinc-500">
                No active priority missions.
              </div>
            ) : (
              <div className="space-y-3">
                {rankedPriorityMissions.map((habit, idx) => {
                  const rankStr = `0${idx + 1}`;
                  const badgeVariant =
                    habit.priority === "High" ? "red" : habit.priority === "Medium" ? "gold" : "blue";
                  const levelLabel = `${habit.priority.toUpperCase()}${idx === 0 ? " PRIORITY" : ""}`;

                  return (
                    <div
                      key={habit.id}
                      className="group rounded-xl border border-zinc-800/60 bg-[#070709] p-3.5 transition duration-500 hover:border-[#d4af37]/40"
                    >
                      <div className="flex items-center justify-between font-mono">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xs font-bold text-[#e5c158]">
                            #{rankStr}
                          </span>
                          <TitanBadge variant={badgeVariant} size="sm">
                            {levelLabel}
                          </TitanBadge>
                        </div>
                        <span className="text-xs font-bold text-[#e5c158]">
                          +{habit.xp} XP
                        </span>
                      </div>

                      <h3 className={`mt-2.5 text-sm font-bold ${habit.completed ? "line-through text-zinc-500" : "text-zinc-100"}`}>
                        {habit.title}
                      </h3>
                      <p className="mt-1 text-[10px] text-zinc-500 font-medium">
                        {habit.completed ? "Mission Complete" : `${habit.category} · Priority Score: ${computePriorityScore(habit)}`}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* AI Recommendation Panel (At Bottom of Right Column) */}
          <div className="relative overflow-hidden rounded-xl border border-[#d4af37]/30 bg-gradient-to-r from-[#d4af37]/10 via-[#d4af37]/5 to-transparent p-4 text-xs shadow-md">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-[#d4af37] text-zinc-950">
                <Sparkles className="size-3.5 fill-zinc-950" />
              </div>
              <p className="leading-relaxed text-zinc-200 font-medium">
                <span className="font-semibold text-[#e5c158] uppercase tracking-wider">AI RECOMMENDATION:</span>{" "}
                Completing your <span className="font-bold text-white">{topPriorityHabit?.title || "highest XP"}</span> operation before 7:00 PM increases today's completion probability to <span className="font-bold text-emerald-400">93%</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
