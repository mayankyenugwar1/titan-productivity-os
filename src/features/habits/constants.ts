import type { HabitCategory, HabitPriority } from "./types";

export const HABIT_CATEGORIES: HabitCategory[] = [
  "Fitness",
  "Study",
  "Coding",
  "Reading",
  "Health",
  "Mindfulness",
  "Finance",
  "Personal",
];

export const HABIT_PRIORITIES: HabitPriority[] = [
  "Low",
  "Medium",
  "High",
];

export const XP_REWARDS = {
  Low: 25,
  Medium: 50,
  High: 100,
} as const;