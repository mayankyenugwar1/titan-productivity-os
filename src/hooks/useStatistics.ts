import { useMemo } from "react";
import { useHabitStore } from "@/store/missionStore";
import { calculateKeyMetrics, type KeyMetricsTelemetry } from "@/services/analytics/statisticsEngine";

export function useStatistics(): KeyMetricsTelemetry {
  const { habits, totalXP, streak } = useHabitStore();

  return useMemo(() => {
    return calculateKeyMetrics(habits, totalXP, streak);
  }, [habits, totalXP, streak]);
}
