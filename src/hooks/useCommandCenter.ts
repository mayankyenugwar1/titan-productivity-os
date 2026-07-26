import { useMemo } from "react";
import { useHabitStore } from "@/store/missionStore";
import { getCommandCenterData, type CommandCenterData } from "@/services/commandCenter/commandCenterService";

export function useCommandCenter(): CommandCenterData {
  const { habits, focusScore } = useHabitStore();

  return useMemo(() => {
    return getCommandCenterData(habits, focusScore);
  }, [habits, focusScore]);
}
