import { ALLOWED_CATEGORIES, sanitizeCategory, type HabitCategory } from "@/constants/categories";
import type { HabitPriority, MissionDuration, Weekday } from "./types";

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

// Canonical Single Source of Truth for Mission Durations
export const MISSION_DURATIONS = [
  { value: "15 mins", label: "15 minutes" },
  { value: "30 mins", label: "30 minutes" },
  { value: "45 mins", label: "45 minutes" },
  { value: "60 mins", label: "60 minutes" },
  { value: "90 mins", label: "90 minutes" },
  { value: "120 mins", label: "120 minutes" },
  { value: "infinite", label: "∞ Infinite" },
] as const;

export interface DurationDefaults {
  difficulty: "Low" | "Medium" | "High" | "Extreme";
  energyCost: "Low" | "Medium" | "High";
  xp: number;
}

export function validateDuration(duration?: string | null): MissionDuration {
  if (!duration) return "45 mins";
  const normalized = duration.trim().toLowerCase();
  if (normalized === "infinite" || normalized.includes("infinite")) return "infinite";

  const match = MISSION_DURATIONS.find(
    (d) => d.value === duration || d.value === normalized || d.value.startsWith(normalized)
  );
  if (match) return match.value as MissionDuration;

  return "45 mins";
}

export function getDurationDefaults(duration: string): DurationDefaults {
  const valid = validateDuration(duration);
  switch (valid) {
    case "15 mins":
      return { difficulty: "Low", energyCost: "Low", xp: 25 };
    case "30 mins":
      return { difficulty: "Low", energyCost: "Low", xp: 50 };
    case "45 mins":
      return { difficulty: "Medium", energyCost: "Medium", xp: 100 };
    case "60 mins":
      return { difficulty: "Medium", energyCost: "Medium", xp: 125 };
    case "90 mins":
      return { difficulty: "High", energyCost: "High", xp: 175 };
    case "120 mins":
      return { difficulty: "Extreme", energyCost: "High", xp: 250 };
    case "infinite":
      return { difficulty: "High", energyCost: "High", xp: 150 };
    default:
      return { difficulty: "Medium", energyCost: "Medium", xp: 100 };
  }
}

export function isInfiniteDuration(duration?: string | null): boolean {
  if (!duration) return false;
  return duration === "infinite" || duration.toLowerCase().includes("infinite");
}

export function parseDurationMinutes(duration?: string | null): number | null {
  if (!duration || isInfiniteDuration(duration)) return null;
  const match = duration.match(/(\d+)/);
  if (match) {
    const mins = parseInt(match[1], 10);
    return isNaN(mins) ? null : mins;
  }
  return null;
}

export function getDurationDisplayLabel(duration?: string | null, priority?: HabitPriority): string {
  const valid = validateDuration(duration);
  if (valid === "infinite") return "∞ Infinite";
  if (valid) return valid;

  if (priority === "High") return "60 mins";
  if (priority === "Medium") return "30 mins";
  return "15 mins";
}

export function getDurationSortOrder(duration?: string | null, priority?: HabitPriority): number {
  if (isInfiniteDuration(duration)) return 9999;
  const mins = parseDurationMinutes(duration);
  if (mins !== null) return mins;
  const fallback = priority === "High" ? 60 : priority === "Medium" ? 30 : 15;
  return fallback;
}
