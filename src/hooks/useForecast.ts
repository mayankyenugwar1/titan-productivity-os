import { useMemo } from "react";
import { useHabitStore } from "@/store/missionStore";
import { calculateCommandCenterForecast, type CommandCenterForecast } from "@/services/commandCenter/forecastService";

export function useForecast(): CommandCenterForecast {
  const { habits, focusScore } = useHabitStore();

  return useMemo(() => {
    return calculateCommandCenterForecast(habits, focusScore);
  }, [habits, focusScore]);
}
