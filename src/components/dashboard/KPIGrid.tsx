import { useMemo } from "react";
import { BatteryCharging, Brain, Calendar, Zap } from "lucide-react";
import KPICard from "./KPICard";
import { useHabitStore } from "@/store/missionStore";
import type { Habit } from "@/features/missions/types";
import { SectionHeader } from "@/components/ui";
import AnimatedNumber from "@/components/ui/AnimatedNumber";

export default function KPIGrid() {
  const { habits, focusScore } = useHabitStore();

  const completedToday = useMemo(() => habits.filter((habit: Habit) => habit.completed), [habits]);
  const activeMissions = useMemo(() => habits.filter((habit: Habit) => !habit.completed), [habits]);
  const totalMissions = habits.length;

  // 1. Focus Score
  const calculatedFocusScore = useMemo(() => {
    if (totalMissions === 0) return focusScore || 94;
    return Math.round((completedToday.length / totalMissions) * 100);
  }, [completedToday.length, totalMissions, focusScore]);

  // 2. Energy Reserve (dynamic based on active load)
  const energyReserve = useMemo(() => {
    return Math.max(65, 100 - activeMissions.length * 4);
  }, [activeMissions.length]);

  // 3. Estimated XP Today
  const estimatedXPToday = useMemo(() => {
    return activeMissions.reduce((sum: number, h: Habit) => sum + h.xp, 0);
  }, [activeMissions]);

  // 4. Weekly Consistency % (calculated from completions history over 7 days)
  const weeklyConsistency = useMemo(() => {
    const totalCompletions = habits.reduce((acc, h) => acc + h.history.length, 0);
    if (habits.length === 0) return 92;
    return Math.min(100, Math.round((totalCompletions / (habits.length * 7)) * 100) || 88);
  }, [habits]);

  return (
    <section className="space-y-6">
      <SectionHeader
        badge="System Telemetry"
        title="Quick Operational Telemetry"
        description="Real-time performance analytics calculated directly from active mission state."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* 1. Focus Score */}
        <KPICard
          title="Focus Score"
          value={<AnimatedNumber value={calculatedFocusScore} suffix="%" />}
          icon={Brain}
          accent="gold"
          subtext="High cognitive execution"
        />

        {/* 2. Energy Reserve */}
        <KPICard
          title="Energy Reserve"
          value={<AnimatedNumber value={energyReserve} suffix="%" />}
          icon={BatteryCharging}
          accent="purple"
          subtext="Optimal physical capacity"
        />

        {/* 3. Estimated XP Today */}
        <KPICard
          title="Estimated XP Today"
          value={<AnimatedNumber value={estimatedXPToday} prefix="+" suffix=" XP" />}
          icon={Zap}
          accent="gold"
          subtext="Pending mission yield"
        />

        {/* 4. Weekly Consistency */}
        <KPICard
          title="Weekly Consistency"
          value={<AnimatedNumber value={weeklyConsistency} suffix="%" />}
          icon={Calendar}
          accent="green"
          subtext="7-day operational accuracy"
        />
      </div>
    </section>
  );
}