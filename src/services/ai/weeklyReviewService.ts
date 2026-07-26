import type { Habit } from "@/features/missions/types";
import type { Project } from "@/store/projectStore";

export interface WeeklyReviewData {
  weekRange: string;
  completedMissionsCount: number;
  totalXpEarnedWeek: number;
  mostProductiveDay: string;
  leastProductiveDay: string;
  projectCompletionRate: number;
  unlockedAchievementsCount: number;
  aiSuggestedImprovements: string[];
}

export function generateWeeklyReview(
  habits: Habit[],
  projects: Project[],
  totalXP: number
): WeeklyReviewData {
  const completedMissionsCount = habits.filter((h) => h.completed || h.history.length > 0).length;
  const totalXpEarnedWeek = habits.reduce((acc, h) => acc + h.history.length * (h.xp || 100), 0);

  const compCount = projects.filter((p) => p.status === "Completed").length;
  const projectCompletionRate = projects.length > 0 ? Math.round((compCount / projects.length) * 100) : 100;

  return {
    weekRange: "Current Operations Week",
    completedMissionsCount,
    totalXpEarnedWeek: totalXpEarnedWeek || totalXP,
    mostProductiveDay: "Monday",
    leastProductiveDay: "Sunday",
    projectCompletionRate,
    unlockedAchievementsCount: Math.min(12, Math.floor(totalXP / 300)),
    aiSuggestedImprovements: [
      "Maintain morning high-priority focus blocks before checking communications.",
      "Break down complex projects into 30-minute daily sub-directives.",
      "Schedule recovery time windows on weekends to prevent burnout.",
    ],
  };
}
