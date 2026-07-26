import { Bot, Calendar, Sparkles, Zap } from "lucide-react";
import { ICON_SIZES, TitanButton, TitanCard } from "@/components/ui";
import { useHabitStore } from "@/store/missionStore";
import type { Habit } from "@/features/missions/types";

export default function AICoach() {
  const { habits } = useHabitStore();
  const activeMissionsCount = habits.filter((habit: Habit) => !habit.completed).length || 4;

  return (
    <TitanCard variant="callout" padding="lg" className="relative overflow-hidden border-yellow-500/30">
      {/* Background Glow */}
      <div className="absolute -right-24 -top-24 size-64 rounded-full bg-yellow-400/10 blur-[100px] pointer-events-none" />

      <div className="relative space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3.5">
          <div className="flex size-12 items-center justify-center rounded-2xl border border-yellow-400/25 bg-yellow-400/10 text-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.15)]">
            <Bot size={ICON_SIZES.lg} />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-wider text-yellow-400 sm:text-3xl">
              AI COMMANDER
            </h2>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-zinc-400">
              Daily Tactical Briefing
            </p>
          </div>
        </div>

        {/* Briefing Box */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 text-zinc-300 shadow-inner">
          <p className="text-base leading-relaxed">
            You have <span className="font-bold text-yellow-400">{activeMissionsCount} active missions</span>.
          </p>
          <p className="mt-3 text-base leading-relaxed">
            <span className="font-bold text-white">Workout</span> provides the highest XP opportunity.
          </p>
          <p className="mt-3 text-base leading-relaxed">
            Estimated focus window: <span className="font-bold text-yellow-400">2 hours</span>.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-2">
          <TitanButton
            variant="secondary"
            size="sm"
            leftIcon={<Calendar size={ICON_SIZES.sm} />}
          >
            Plan My Day
          </TitanButton>

          <TitanButton
            variant="secondary"
            size="sm"
            leftIcon={<Zap size={ICON_SIZES.sm} />}
          >
            Optimize Missions
          </TitanButton>

          <TitanButton
            variant="secondary"
            size="sm"
            leftIcon={<Sparkles size={ICON_SIZES.sm} />}
          >
            Generate Schedule
          </TitanButton>
        </div>
      </div>
    </TitanCard>
  );
}
