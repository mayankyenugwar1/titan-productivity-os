import type { HabitCategory as CentralHabitCategory } from "@/constants/categories";

export type HabitCategory =
  | CentralHabitCategory
  | "Fitness"
  | "Study"
  | "Knowledge"
  | "Coding"
  | "Reading"
  | "Health"
  | "Physical"
  | "Mindfulness"
  | "Finance"
  | "Personal"
  | "Personal Ops"
  | "Work"
  | "Operations";

export type HabitPriority = "Low" | "Medium" | "High";

export type HabitFrequency = "daily" | "weekly";

export type MissionState =
  | "Pending"
  | "Scheduled"
  | "In Progress"
  | "Paused"
  | "Completed"
  | "Failed"
  | "Archived";

export type Weekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type MissionDuration =
  | "15 mins"
  | "30 mins"
  | "45 mins"
  | "60 mins"
  | "90 mins"
  | "120 mins"
  | "infinite";

export interface HabitCompletion {
  id: string;
  habitId: string;
  completedOn: string;
  completedAt: Date;
}

export interface Habit {
  id: string;
  title: string;
  description?: string;
  category: HabitCategory;
  priority: HabitPriority;
  xp: number;
  frequency: HabitFrequency;
  weeklyDays: Weekday[];
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
  history: HabitCompletion[];
  state?: MissionState;
  archived?: boolean;
  difficulty?: "Low" | "Medium" | "High" | "Extreme" | "Ultra";
  estimatedMinutes?: number;
  duration?: MissionDuration;
  energyCost?: "Low" | "Medium" | "High";
  dueDate?: string;
  tags?: string[];
}

export interface HabitInput {
  title: string;
  description?: string;
  category: HabitCategory;
  priority: HabitPriority;
  xp: number;
  frequency: HabitFrequency;
  weeklyDays: Weekday[];
  difficulty?: "Low" | "Medium" | "High" | "Extreme" | "Ultra";
  estimatedMinutes?: number;
  duration?: MissionDuration;
  energyCost?: "Low" | "Medium" | "High";
  dueDate?: string;
  tags?: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: Date;
  secret?: boolean;
}

export type LevelTier = "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond" | "Master" | "Titan";

export interface LevelInfo {
  level: number;
  title: string;
  tier: LevelTier;
  currentXP: number;
  nextLevelXP: number;
  progressPercentage: number;
}

export function calculateDifficultyStars(habitOrPriority: Habit | HabitPriority): number {
  const priority = typeof habitOrPriority === "object" ? habitOrPriority.priority : habitOrPriority;
  switch (priority) {
    case "High":
      return 3;
    case "Medium":
      return 2;
    default:
      return 1;
  }
}

export function calculateDynamicXP(habitOrPriority: Habit | HabitPriority): number {
  if (typeof habitOrPriority === "object") {
    return habitOrPriority.xp || 100;
  }
  switch (habitOrPriority) {
    case "High":
      return 150;
    case "Medium":
      return 100;
    default:
      return 50;
  }
}

export function canTransitionState(from: MissionState, to: MissionState): boolean {
  if (from === to) return true;
  if (from === "Archived") return false;
  return true;
}

export const STATE_TOOLTIPS: Record<MissionState, string> = {
  Pending: "Mission initialized; pending execution signal.",
  Scheduled: "Mission scheduled in chrono matrix.",
  "In Progress": "Mission actively running under focus mode.",
  Paused: "Execution paused by operator.",
  Completed: "Mission accomplished; XP awarded.",
  Failed: "Mission failed deadline window.",
  Archived: "Mission archived into historical logs.",
};
