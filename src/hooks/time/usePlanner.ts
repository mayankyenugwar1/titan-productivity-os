import { useMemo } from "react";
import { useCalendar } from "./useCalendar";
import { calculatePlannerMetrics, type PlannerMetrics } from "@/services/time/plannerService";

export function usePlanner(): PlannerMetrics {
  const { allEvents } = useCalendar();

  return useMemo(() => {
    return calculatePlannerMetrics(allEvents);
  }, [allEvents]);
}
