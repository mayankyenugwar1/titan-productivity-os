import { useMemo } from "react";
import { useHabitStore } from "@/store/missionStore";
import { getAnalyticsData, type AnalyticsData } from "@/services/analytics/analyticsService";

export function useAnalytics(): AnalyticsData {
  const { habits, totalXP, streak } = useHabitStore();

  return useMemo(() => {
    return getAnalyticsData(habits, totalXP, streak);
  }, [habits, totalXP, streak]);
}
