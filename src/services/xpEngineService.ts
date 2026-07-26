import type { Habit } from "@/features/missions/types";

export type OperatorRankTitle =
  | "Recruit"
  | "Cadet"
  | "Operator"
  | "Guardian"
  | "Shadow"
  | "Knight"
  | "Titan"
  | "Legend";

export interface ProgressionDetails {
  level: number;
  totalXP: number;
  currentLevelXP: number;
  xpRequired: number;
  progressPercent: number;
  rank: OperatorRankTitle;
  rankColor: string;
}

export interface XPActivityItem {
  id: string;
  missionTitle: string;
  xpEarned: number;
  coinEarned: number;
  date: Date;
  reason: string;
}

const LEVEL_STEP = 500;

// Centralized XP Calculation Engine
export function calculateMissionXP(habit: Habit): number {
  if (habit.xp && habit.xp > 0) {
    return habit.xp;
  }
  const baseXP = 50;
  const starsCount = habit.priority === "High" ? 5 : habit.priority === "Medium" ? 3 : 1;
  const difficultyBonus = starsCount * 10;
  const priorityBonus = habit.priority === "High" ? 50 : habit.priority === "Medium" ? 25 : 10;
  const durationBonus = habit.priority === "High" ? 40 : habit.priority === "Medium" ? 20 : 10;
  const categoryBonus =
    habit.category === "Operations" || habit.category === "Physical" ? 25 : 15;

  return baseXP + difficultyBonus + priorityBonus + durationBonus + categoryBonus;
}

// Level Formula
export function calculateLevel(totalXP: number): number {
  return Math.floor(Math.max(0, totalXP) / LEVEL_STEP) + 1;
}

// Operator Rank Formula
export function getOperatorRank(level: number): {
  rank: OperatorRankTitle;
  color: string;
  badgeVariant: "zinc" | "blue" | "gold" | "red" | "green" | "purple";
} {
  if (level >= 35) return { rank: "Legend", color: "#e5c158", badgeVariant: "gold" };
  if (level >= 30) return { rank: "Titan", color: "#e5c158", badgeVariant: "gold" };
  if (level >= 25) return { rank: "Knight", color: "#c084fc", badgeVariant: "purple" };
  if (level >= 20) return { rank: "Shadow", color: "#38bdf8", badgeVariant: "blue" };
  if (level >= 15) return { rank: "Guardian", color: "#34d399", badgeVariant: "green" };
  if (level >= 10) return { rank: "Operator", color: "#fbbf24", badgeVariant: "gold" };
  if (level >= 5) return { rank: "Cadet", color: "#60a5fa", badgeVariant: "blue" };
  return { rank: "Recruit", color: "#a1a1aa", badgeVariant: "zinc" };
}

// Full Progression Details Telemetry
export function getProgressionDetails(totalXP: number): ProgressionDetails {
  const level = calculateLevel(totalXP);
  const currentLevelXP = Math.max(0, totalXP) % LEVEL_STEP;
  const progressPercent = Math.min(100, Math.round((currentLevelXP / LEVEL_STEP) * 100));
  const rankInfo = getOperatorRank(level);

  return {
    level,
    totalXP,
    currentLevelXP,
    xpRequired: LEVEL_STEP,
    progressPercent,
    rank: rankInfo.rank,
    rankColor: rankInfo.color,
  };
}
