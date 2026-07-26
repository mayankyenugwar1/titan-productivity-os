import { useHabitStore } from "@/store/missionStore";
import { useProjectStore } from "@/store/projectStore";
import { useKnowledgeStore } from "@/store/knowledgeStore";
import { useAutomationStore } from "@/store/automationStore";
import { logEvent } from "@/services/telemetry/loggerService";

export function loadDemoWorkspaceData(userId: string = "local_user") {
  logEvent("INFO", "DEMO_WORKSPACE", "Loading demo workspace data payload across all modules");

  const { addHabit } = useHabitStore.getState();
  const { createGoal } = useProjectStore.getState();
  const { createNote } = useKnowledgeStore.getState();
  const { createWorkflow } = useAutomationStore.getState();

  // 1. Mission Control Directives
  void addHabit(userId, {
    title: "Morning Deep Work Protocol",
    description: "Perform 90 minutes of uninterrupted focused execution before checking email.",
    category: "Health",
    priority: "High",
    xp: 200,
    frequency: "daily",
    weeklyDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
  });

  void addHabit(userId, {
    title: "System Architecture Code Review",
    description: "Review pull requests and enforce zero debt in repository.",
    category: "Operations",
    priority: "High",
    xp: 150,
    frequency: "daily",
    weeklyDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
  });

  // 2. Projects & OKRs
  createGoal({
    title: "Launch TITAN V1.0 Operating System",
    description: "Deliver production-ready release candidate with 13 core modules.",
    category: "Operations",
    priority: "High",
    targetDate: "2026-08-01",
    keyResults: [
      {
        id: `kr-1`,
        goalId: `goal-1`,
        title: "Achieve 0 TypeScript Errors Across 13 Routes",
        currentValue: 13,
        targetValue: 13,
        unit: "routes",
      },
    ],
  });

  // 3. Knowledge OS Notes
  createNote(
    "TITAN System Specifications",
    "# TITAN Architecture\n\n- Unified productivity OS\n- High contrast Wayne Enterprises dark mode\n- 0 TypeScript errors\n- PWA & Mobile ready",
    "Document",
    "Operations",
    ["spec", "v1.0", "titan"]
  );

  // 4. Automation Workflows
  createWorkflow({
    name: "Overdue Mission Auto-Recovery",
    description: "Automatically awards recovery XP and logs recap note when mission completes.",
    trigger: { eventType: "MISSION_COMPLETED", label: "Mission Directive Completed" },
    conditions: [{ field: "priority", operator: "equals", value: "High" }],
    actions: [{ actionType: "AWARD_XP", label: "Award +150 XP", params: { amount: 150 } }],
    enabled: true,
  });
}
