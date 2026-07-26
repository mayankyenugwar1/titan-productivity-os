import type { Habit } from "@/features/missions/types";
import { generateOptimizedSchedule, type ScheduledMissionPlan } from "./scheduleEngine";
import { generateTimeBlocks, type TimeBlockGroup } from "./timeBlockEngine";
import { generateEnergyPlan, type EnergyAllocationCategory } from "./energyPlanner";
import {
  calculateWorkloadHeatmap,
  calculateCommandCenterForecast,
  type WorkloadHeatmapData,
  type CommandCenterForecast,
} from "./forecastService";

export interface CommandCenterData {
  schedule: ScheduledMissionPlan[];
  timeBlocks: TimeBlockGroup[];
  energyPlan: EnergyAllocationCategory[];
  heatmap: WorkloadHeatmapData;
  forecast: CommandCenterForecast;
}

export function getCommandCenterData(habits: Habit[], focusScore: number): CommandCenterData {
  const schedule = generateOptimizedSchedule(habits);
  const timeBlocks = generateTimeBlocks(habits);
  const energyPlan = generateEnergyPlan(habits);
  const heatmap = calculateWorkloadHeatmap(habits);
  const forecast = calculateCommandCenterForecast(habits, focusScore);

  return {
    schedule,
    timeBlocks,
    energyPlan,
    heatmap,
    forecast,
  };
}
