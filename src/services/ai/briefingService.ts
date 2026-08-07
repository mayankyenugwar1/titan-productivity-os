import type { Habit } from "@/features/missions/types";
import type { Project } from "@/store/projectStore";
import { safeDateString } from "@/utils/safeDate";

export interface DailyBriefingData {
  date: string;
  summary: string;
  totalMissionsToday: number;
  completedMissionsToday: number;
  criticalPendingMissions: number;
  activeProjectsCount: number;
  xpStreak: number;
  focusRecommendation: string;
  suggestedNextAction: string;
}

export function generateDailyBriefing(
  habits: Habit[],
  projects: Project[],
  streak: number
): DailyBriefingData {
  const totalMissionsToday = habits.length;
  const completedMissionsToday = habits.filter((h) => h.completed).length;
  const criticalPending = habits.filter((h) => h.priority === "High" && !h.completed).length;
  const activeProjectsCount = projects.filter((p) => p.status === "Active").length;

  let focusRecommendation = "Focus on completing high-priority operational directives during your morning peak energy window.";
  if (criticalPending > 0) {
    focusRecommendation = `Clear your ${criticalPending} critical clearance mission(s) before scheduling tactical low-priority items.`;
  } else if (completedMissionsToday > 0 && completedMissionsToday === totalMissionsToday) {
    focusRecommendation = "All today's missions accomplished! Allocate focus to strategic Project Initiatives or Knowledge OS research.";
  }

  const dateStr = safeDateString(new Date(), {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return {
    date: dateStr,
    summary: `Good day, Operator. You have ${totalMissionsToday - completedMissionsToday} pending operational directive(s) and ${activeProjectsCount} active project initiative(s) requiring attention.`,
    totalMissionsToday,
    completedMissionsToday,
    criticalPendingMissions: criticalPending,
    activeProjectsCount,
    xpStreak: streak,
    focusRecommendation,
    suggestedNextAction: criticalPending > 0 ? "Execute High-Priority Directive" : "Review Strategic Projects",
  };
}
