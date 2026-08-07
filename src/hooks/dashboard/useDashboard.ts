import { useMemo } from "react";
import { useHabitStore } from "@/store/missionStore";
import { useProjectStore } from "@/store/projectStore";
import { useKnowledgeStore } from "@/store/knowledgeStore";
import { useAutomationStore } from "@/store/automationStore";
import {
  calculateFocusTelemetry,
  calculateProductivityScore,
  generateMorningBriefing,
} from "@/services/commandCenter/dashboardService";
import { safeTime } from "@/utils/safeDate";

export function useDashboard() {
  const { habits, streak, totalXP } = useHabitStore();
  const { projects, goals } = useProjectStore();
  const { items: notes } = useKnowledgeStore();
  const { workflows } = useAutomationStore();

  const morningBriefing = useMemo(() => {
    return generateMorningBriefing(habits, projects, goals, streak, totalXP);
  }, [habits, projects, goals, streak, totalXP]);

  const productivityTelemetry = useMemo(() => {
    return calculateProductivityScore(habits, streak);
  }, [habits, streak]);

  const focusTelemetry = useMemo(() => {
    return calculateFocusTelemetry(habits);
  }, [habits]);

  const recentActivity = useMemo(() => {
    const list: { id: string; text: string; time: string; type: string }[] = [];

    (habits || []).slice(0, 3).forEach((h) => {
      list.push({
        id: `act-h-${h.id}`,
        text: `Mission "${h.title}" state: ${h.completed ? "Accomplished (+XP)" : "Queued in Mission OS"}`,
        time: safeTime(new Date()),
        type: "Mission",
      });
    });

    (notes || []).slice(0, 2).forEach((n) => {
      list.push({
        id: `act-n-${n.id}`,
        text: `Knowledge entry "${n.title}" created in Vault`,
        time: "Today",
        type: "Knowledge",
      });
    });

    (workflows || []).slice(0, 2).forEach((w) => {
      list.push({
        id: `act-w-${w.id}`,
        text: `Workflow "${w.name}" executed via Event Bus`,
        time: "Today",
        type: "Automation",
      });
    });

    return list;
  }, [habits, notes, workflows]);

  return {
    morningBriefing,
    productivityTelemetry,
    focusTelemetry,
    recentActivity,
    habits,
    projects,
    goals,
    notes,
    workflows,
  };
}
