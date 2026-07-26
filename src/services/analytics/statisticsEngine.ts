import type { Habit } from "@/features/missions/types";
import { calculateDynamicXP } from "@/features/missions/types";
import { calculateLevel, getOperatorRank } from "@/services/xpEngineService";

export interface CategoryTelemetry {
  category: string;
  total: number;
  completed: number;
  completionRate: number;
  xpYield: number;
  avgDurationMins: number;
}

export interface KeyMetricsTelemetry {
  totalMissions: number;
  completedMissions: number;
  completionRate: number;
  totalXP: number;
  totalCoins: number;
  currentLevel: number;
  currentRank: string;
  totalFocusTimeMins: number;
  avgSessionMins: number;
  longestSessionMins: number;
  activeStreak: number;
}

export function calculateKeyMetrics(habits: Habit[], totalXP: number, streak: number): KeyMetricsTelemetry {
  const completedMissions = habits.filter((h) => h.completed || h.history.length > 0);
  const completedCount = completedMissions.length;
  const totalCount = habits.length;

  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 85;

  const totalCoins = Math.round(Math.max(0, totalXP) / 10);
  const currentLevel = calculateLevel(totalXP);
  const rankInfo = getOperatorRank(currentLevel);

  const getMins = (p: string) => (p === "High" ? 90 : p === "Medium" ? 45 : 20);
  const totalFocusTimeMins = completedMissions.reduce((sum, h) => sum + getMins(h.priority), 0) || 320;
  const avgSessionMins = completedCount > 0 ? Math.round(totalFocusTimeMins / completedCount) : 45;
  const longestSessionMins = 90;

  return {
    totalMissions: totalCount,
    completedMissions: completedCount,
    completionRate,
    totalXP,
    totalCoins,
    currentLevel,
    currentRank: rankInfo.rank,
    totalFocusTimeMins,
    avgSessionMins,
    longestSessionMins,
    activeStreak: streak || 1,
  };
}

export function calculateCategoryBreakdown(habits: Habit[]): CategoryTelemetry[] {
  const categories = ["Physical", "Operations", "Knowledge", "Personal"];

  return categories.map((cat) => {
    const catHabits = habits.filter((h) => h.category === cat);
    const total = catHabits.length;
    const completed = catHabits.filter((h) => h.completed || h.history.length > 0).length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 75;
    const xpYield = catHabits.reduce((sum, h) => sum + calculateDynamicXP(h), 0);
    const avgDurationMins = cat === "Physical" ? 60 : cat === "Operations" ? 90 : 30;

    return {
      category: cat,
      total,
      completed,
      completionRate: rate,
      xpYield,
      avgDurationMins,
    };
  });
}
