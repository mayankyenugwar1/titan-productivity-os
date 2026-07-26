import type { Habit } from "@/features/missions/types";
import { calculateMissionXP } from "./xpEngineService";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  requirement: number;
  progress: number;
  completed: boolean;
  xpReward: number;
  coinReward: number;
  category: "Daily" | "Weekly";
}

export function evaluateChallenges(habits: Habit[], totalXP: number): {
  dailyChallenges: Challenge[];
  weeklyOperations: Challenge[];
} {
  const completedToday = habits.filter((h) => h.completed);
  const completedTodayCount = completedToday.length;
  const xpEarnedToday = completedToday.reduce((sum, h) => sum + calculateMissionXP(h), 0);
  const physicalTodayCount = completedToday.filter((h) => h.category === "Physical" || h.category === "Fitness").length;

  const totalCompleted = habits.filter((h) => h.completed || h.history.length > 0).length;
  const physicalTotal = habits.filter((h) => (h.category === "Physical" || h.category === "Fitness") && (h.completed || h.history.length > 0)).length;
  const codingTotal = habits.filter((h) => (h.category === "Operations" || h.category === "Coding") && (h.completed || h.history.length > 0)).length;

  const dailyChallenges: Challenge[] = [
    {
      id: "daily-1",
      title: "Triple Execution Directive",
      description: "Accomplish 3 tactical operations today.",
      requirement: 3,
      progress: Math.min(3, completedTodayCount),
      completed: completedTodayCount >= 3,
      xpReward: 150,
      coinReward: 30,
      category: "Daily",
    },
    {
      id: "daily-2",
      title: "Target XP Payload",
      description: "Earn at least 300 XP from daily operations.",
      requirement: 300,
      progress: Math.min(300, xpEarnedToday),
      completed: xpEarnedToday >= 300,
      xpReward: 200,
      coinReward: 40,
      category: "Daily",
    },
    {
      id: "daily-3",
      title: "Physical Conditioning",
      description: "Accomplish 1 Physical or Workout operation today.",
      requirement: 1,
      progress: Math.min(1, physicalTodayCount),
      completed: physicalTodayCount >= 1,
      xpReward: 100,
      coinReward: 20,
      category: "Daily",
    },
  ];

  const weeklyOperations: Challenge[] = [
    {
      id: "weekly-1",
      title: "Operation 15 Task Force",
      description: "Accomplish 15 operations this week.",
      requirement: 15,
      progress: Math.min(15, totalCompleted),
      completed: totalCompleted >= 15,
      xpReward: 750,
      coinReward: 150,
      category: "Weekly",
    },
    {
      id: "weekly-2",
      title: "Chrono XP Payload",
      description: "Earn 1,500 total XP payload.",
      requirement: 1500,
      progress: Math.min(1500, totalXP),
      completed: totalXP >= 1500,
      xpReward: 1000,
      coinReward: 200,
      category: "Weekly",
    },
    {
      id: "weekly-3",
      title: "Iron Conditioning",
      description: "Accomplish 5 Physical/Workout operations.",
      requirement: 5,
      progress: Math.min(5, physicalTotal),
      completed: physicalTotal >= 5,
      xpReward: 500,
      coinReward: 100,
      category: "Weekly",
    },
    {
      id: "weekly-4",
      title: "Cyber Execution Squad",
      description: "Accomplish 5 Operations/Coding sessions.",
      requirement: 5,
      progress: Math.min(5, codingTotal),
      completed: codingTotal >= 5,
      xpReward: 500,
      coinReward: 100,
      category: "Weekly",
    },
  ];

  return { dailyChallenges, weeklyOperations };
}
