import type { Habit } from "@/features/missions/types";
import { calculateDynamicXP } from "@/features/missions/types";

export interface WorkloadHeatmapData {
  density: "LIGHT" | "MEDIUM" | "HEAVY";
  peakFocusHours: string;
  remainingCapacityHours: number;
  utilizationPercent: number;
}

export interface CommandCenterForecast {
  completionPercent: number;
  estimatedFinishTime: string;
  expectedXP: number;
  expectedCoins: number;
  focusScore: number;
  riskLevel: "LOW RISK" | "MODERATE RISK" | "HIGH RISK";
  confidenceRating: string;
}

export function calculateWorkloadHeatmap(habits: Habit[]): WorkloadHeatmapData {
  const active = habits.filter((h) => !h.completed);
  const activeMins = active.reduce((sum, h) => sum + (h.priority === "High" ? 90 : 45), 0);
  const activeHours = activeMins / 60;

  const density: WorkloadHeatmapData["density"] =
    activeHours > 5 ? "HEAVY" : activeHours > 2.5 ? "MEDIUM" : "LIGHT";

  const remainingCapacityHours = Math.max(0, Number((8 - activeHours).toFixed(1)));
  const utilizationPercent = Math.min(100, Math.round((activeHours / 8) * 100));

  return {
    density,
    peakFocusHours: "08:00 AM - 11:30 AM",
    remainingCapacityHours,
    utilizationPercent,
  };
}

export function calculateCommandCenterForecast(habits: Habit[], focusScore: number): CommandCenterForecast {
  const active = habits.filter((h) => !h.completed);
  const completed = habits.filter((h) => h.completed);

  const totalXP = active.reduce((sum, h) => sum + calculateDynamicXP(h), 0);
  const totalCoins = Math.round(totalXP / 10);

  const completionPercent = habits.length > 0 ? Math.round((completed.length / habits.length) * 100) : 85;

  const riskLevel: CommandCenterForecast["riskLevel"] =
    active.length > 6 ? "HIGH RISK" : active.length > 3 ? "MODERATE RISK" : "LOW RISK";

  return {
    completionPercent: Math.min(100, completionPercent),
    estimatedFinishTime: "06:45 PM",
    expectedXP: totalXP,
    expectedCoins: totalCoins,
    focusScore: focusScore || 88,
    riskLevel,
    confidenceRating: "HIGH PRECISION (94%)",
  };
}
