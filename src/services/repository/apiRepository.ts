import { useHabitStore } from "@/store/missionStore";
import { useProjectStore } from "@/store/projectStore";
import { useKnowledgeStore } from "@/store/knowledgeStore";
import { logEvent } from "@/services/telemetry/loggerService";

export const TitanRepository = {
  missions: {
    getAll: () => useHabitStore.getState().habits,
    load: (userId: string) => {
      logEvent("INFO", "REPOS", `Loading missions for user ${userId}`);
      return useHabitStore.getState().loadHabits(userId);
    },
  },
  projects: {
    getAll: () => useProjectStore.getState().projects,
  },
  knowledge: {
    getAll: () => useKnowledgeStore.getState().items,
  },
};
