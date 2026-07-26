import { ALLOWED_CATEGORIES, sanitizeCategory, type HabitCategory } from "@/constants/categories";
import type { HabitPriority, Weekday } from "./types";

export const HABIT_CATEGORIES: HabitCategory[] = ALLOWED_CATEGORIES;

export const formatCategory = (category: string): HabitCategory => {
  return sanitizeCategory(category);
};

export const HABIT_PRIORITIES: HabitPriority[] = ["Low", "Medium", "High"];

export const WEEKDAYS: { label: string; value: Weekday }[] = [
  { label: "Mon", value: "monday" },
  { label: "Tue", value: "tuesday" },
  { label: "Wed", value: "wednesday" },
  { label: "Thu", value: "thursday" },
  { label: "Fri", value: "friday" },
  { label: "Sat", value: "saturday" },
  { label: "Sun", value: "sunday" },
];

export const XP_REWARDS = { Low: 25, Medium: 50, High: 100 } as const;
