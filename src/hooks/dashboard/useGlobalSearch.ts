import { useMemo } from "react";
import { useHabitStore } from "@/store/missionStore";
import { useKnowledgeStore } from "@/store/knowledgeStore";
import { useProjectStore } from "@/store/projectStore";
import { useAutomationStore } from "@/store/automationStore";
import { searchAllModules } from "@/services/commandCenter/globalSearchService";

export function useGlobalSearch(query: string) {
  const { habits } = useHabitStore();
  const { items: notes } = useKnowledgeStore();
  const { projects, goals } = useProjectStore();
  const { workflows } = useAutomationStore();

  const results = useMemo(() => {
    return searchAllModules(query, habits, notes, projects, goals, workflows);
  }, [query, habits, notes, projects, goals, workflows]);

  return results;
}
