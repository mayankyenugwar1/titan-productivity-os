import type { Habit } from "@/features/missions/types";
import type { Project, Goal } from "@/services/projects/projectService";

export interface MorningBriefingPayload {
  todayMissionsCount: number;
  completedMissionsCount: number;
  overdueMissionsCount: number;
  activeProjectsCount: number;
  activeGoalsCount: number;
  streak: number;
  totalXP: number;
  calendarEventsCount: number;
  aiRecommendation: string;
}

export interface ProductivityTelemetry {
  score: number;
  velocity: number;
  consistencyPercent: number;
  explanation: string;
}

export interface FocusTelemetry {
  deepWorkHours: number;
  productiveHours: number;
  longestSessionMins: number;
  interruptedSessions: number;
}

export function generateMorningBriefing(
  habits: Habit[],
  projects: Project[],
  goals: Goal[],
  streak: number,
  totalXP: number
): MorningBriefingPayload {
  const completedMissionsCount = habits.filter((h) => h.completed).length;
  const todayMissionsCount = habits.length;

  return {
    todayMissionsCount,
    completedMissionsCount,
    overdueMissionsCount: Math.max(0, habits.length - completedMissionsCount),
    activeProjectsCount: projects.filter((p) => p.status === "Active").length,
    activeGoalsCount: goals.length,
    streak,
    totalXP,
    calendarEventsCount: habits.length,
    aiRecommendation:
      completedMissionsCount > 0
        ? `Operational momentum established. Keep pushing high-priority directives.`
        : `Start your morning cognitive window with high-priority operations.`,
  };
}

export function calculateProductivityScore(
  habits: Habit[],
  streak: number
): ProductivityTelemetry {
  if (habits.length === 0) {
    return {
      score: 100,
      velocity: 100,
      consistencyPercent: 100,
      explanation: "No active operations assigned; systems nominal.",
    };
  }

  const completed = habits.filter((h) => h.completed).length;
  const completionRate = Math.round((completed / habits.length) * 100);
  const streakBonus = Math.min(20, streak * 2);
  const score = Math.min(100, Math.round(completionRate * 0.8 + streakBonus));

  return {
    score,
    velocity: completionRate,
    consistencyPercent: Math.min(100, 75 + streak * 5),
    explanation: `Productivity score is ${score}/100 based on ${completionRate}% mission completion rate and a ${streak}-day active streak.`,
  };
}

export function calculateFocusTelemetry(habits: Habit[]): FocusTelemetry {
  const totalMins = habits.reduce((acc, h) => acc + (h.estimatedMinutes || 45), 0);
  const completedMins = habits.filter((h) => h.completed).reduce((acc, h) => acc + (h.estimatedMinutes || 45), 0);

  return {
    deepWorkHours: Number((completedMins / 60).toFixed(1)),
    productiveHours: Number((totalMins / 60).toFixed(1)),
    longestSessionMins: 90,
    interruptedSessions: 0,
  };
}
