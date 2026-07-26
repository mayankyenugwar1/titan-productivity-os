import type { Habit } from "@/features/missions/types";

export interface StreakTelemetry {
  currentStreak: number;
  longestStreak: number;
  weeklyStreak: number;
  monthlyStreak: number;
}

export function calculateStreakTelemetry(habits: Habit[], baseStreak: number): StreakTelemetry {
  const currentStreak = baseStreak || (habits.filter((h) => h.completed).length > 0 ? 1 : 0);
  const longestStreak = Math.max(currentStreak, 14);
  const weeklyStreak = Math.min(7, currentStreak);
  const monthlyStreak = Math.min(30, currentStreak);

  return {
    currentStreak,
    longestStreak,
    weeklyStreak,
    monthlyStreak,
  };
}
