import { useMemo } from "react";
import { useHabitStore } from "@/store/missionStore";
import { generateOptimizedSchedule, type ScheduledMissionPlan } from "@/services/commandCenter/scheduleEngine";

export function useSchedule(): ScheduledMissionPlan[] {
  const { habits } = useHabitStore();

  return useMemo(() => {
    return generateOptimizedSchedule(habits);
  }, [habits]);
}
