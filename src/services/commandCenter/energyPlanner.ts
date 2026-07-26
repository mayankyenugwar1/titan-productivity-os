import type { Habit } from "@/features/missions/types";
import { sanitizeCategory } from "@/constants/categories";

export interface EnergyAllocationCategory {
  mode: "Deep Work" | "Shallow Work" | "Exercise" | "Reading" | "Recovery";
  recommendedMins: number;
  missionCount: number;
  energyDemand: "PEAK" | "MODERATE" | "LOW";
  color: string;
}

export function generateEnergyPlan(habits: Habit[]): EnergyAllocationCategory[] {
  const active = habits.filter((h) => !h.completed);

  const deepWorkMissions = active.filter((h) => h.priority === "High" || sanitizeCategory(h.category) === "Operations");
  const shallowWorkMissions = active.filter((h) => h.priority === "Low" || sanitizeCategory(h.category) === "Personal Ops");
  const exerciseMissions = active.filter((h) => sanitizeCategory(h.category) === "Physical" || sanitizeCategory(h.category) === "Fitness");
  const readingMissions = active.filter((h) => sanitizeCategory(h.category) === "Knowledge" || sanitizeCategory(h.category) === "Reading");

  const getSumMins = (items: Habit[]) => items.reduce((sum, h) => sum + (h.priority === "High" ? 90 : 45), 0);

  return [
    {
      mode: "Deep Work",
      recommendedMins: getSumMins(deepWorkMissions) || 120,
      missionCount: deepWorkMissions.length,
      energyDemand: "PEAK",
      color: "#e5c158",
    },
    {
      mode: "Shallow Work",
      recommendedMins: getSumMins(shallowWorkMissions) || 60,
      missionCount: shallowWorkMissions.length,
      energyDemand: "LOW",
      color: "#38bdf8",
    },
    {
      mode: "Exercise",
      recommendedMins: getSumMins(exerciseMissions) || 45,
      missionCount: exerciseMissions.length,
      energyDemand: "PEAK",
      color: "#ef4444",
    },
    {
      mode: "Reading",
      recommendedMins: getSumMins(readingMissions) || 30,
      missionCount: readingMissions.length,
      energyDemand: "MODERATE",
      color: "#a855f7",
    },
    {
      mode: "Recovery",
      recommendedMins: 45,
      missionCount: 0,
      energyDemand: "LOW",
      color: "#10b981",
    },
  ];
}
