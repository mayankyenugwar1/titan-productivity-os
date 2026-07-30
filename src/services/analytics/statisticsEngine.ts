import type { Habit } from "@/features/missions/types";
import { calculateDynamicXP } from "@/features/missions/types";
import { parseDurationMinutes } from "@/features/missions/constants";
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
  totalPlannedTimeTodayMins: number;
  totalPlannedTimeWeekMins: number;
  avgMissionDurationMins: number;
}

export function calculateKeyMetrics(habits: Habit[], totalXP: number, streak: number): KeyMetricsTelemetry {
  const completedMissions = habits.filter((h) => h.completed || h.history.length > 0);
  const completedCount = completedMissions.length;
  const totalCount = habits.length;

  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 85;

  const totalCoins = Math.round(Math.max(0, totalXP) / 10);
  const currentLevel = calculateLevel(totalXP);
  const rankInfo = getOperatorRank(currentLevel);

  const getMins = (h: Habit) => {
    if (h.duration) {
      const parsed = parseDurationMinutes(h.duration);
      if (parsed !== null) return parsed;
    }
    return h.estimatedMinutes || (h.priority === "High" ? 90 : h.priority === "Medium" ? 45 : 20);
  };

  const totalFocusTimeMins = completedMissions.reduce((sum, h) => sum + getMins(h), 0) || 320;
  const avgSessionMins = completedCount > 0 ? Math.round(totalFocusTimeMins / completedCount) : 45;
  const longestSessionMins = 90;

  const totalPlannedTimeTodayMins = habits.reduce((sum, h) => sum + getMins(h), 0);
  const totalPlannedTimeWeekMins = habits.reduce((sum, h) => {
    const mins = getMins(h);
    return sum + (h.frequency === "daily" ? mins * 7 : mins * (h.weeklyDays.length || 1));
  }, 0);
  const avgMissionDurationMins = totalCount > 0 ? Math.round(totalPlannedTimeTodayMins / totalCount) : 45;

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
    totalPlannedTimeTodayMins,
    totalPlannedTimeWeekMins,
    avgMissionDurationMins,
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

    const getMins = (h: Habit) => {
      if (h.duration) {
        const parsed = parseDurationMinutes(h.duration);
        if (parsed !== null) return parsed;
      }
      return h.estimatedMinutes || (cat === "Physical" ? 60 : cat === "Operations" ? 90 : 30);
    };

    const totalCatMins = catHabits.reduce((sum, h) => sum + getMins(h), 0);
    const avgDurationMins = total > 0 ? Math.round(totalCatMins / total) : (cat === "Physical" ? 60 : cat === "Operations" ? 90 : 30);

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
