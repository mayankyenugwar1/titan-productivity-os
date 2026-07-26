import { useMemo } from "react";
import { useHabitStore } from "@/store/missionStore";
import { generateAICommanderBriefing, type AICommanderBriefing } from "@/services/aiCommander/aiCommanderService";

export function useAICommander(): AICommanderBriefing {
  const { habits } = useHabitStore();

  const briefing = useMemo(() => {
    return generateAICommanderBriefing(habits);
  }, [habits]);

  return briefing;
}
