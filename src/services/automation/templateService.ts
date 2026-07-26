import type { Workflow } from "./workflowService";

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: "Productivity" | "Health" | "Knowledge" | "Operations";
  workflowData: Omit<Workflow, "id" | "runCount" | "lastRunAt">;
}

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    id: "tmpl-morning",
    name: "Morning Execution Protocol",
    description: "Triggers every morning to schedule high-priority focus directives.",
    category: "Productivity",
    workflowData: {
      name: "Morning Execution Protocol",
      description: "Automated morning task scheduling and focus boost.",
      enabled: true,
      trigger: { eventType: "SCHEDULED_TICK", label: "Morning 08:00 AM Tick" },
      conditions: [],
      actions: [
        { actionType: "CREATE_MISSION", label: "Schedule Focus Session", params: { title: "Deep Work Session" } },
        { actionType: "AWARD_XP", label: "Award +50 XP Morning Bonus", params: { xp: 50 } },
      ],
    },
  },
  {
    id: "tmpl-retrospective",
    name: "Weekly Retrospective Auto-Note",
    description: "When a major goal is completed, generate a Knowledge OS summary note.",
    category: "Knowledge",
    workflowData: {
      name: "Weekly Retrospective Auto-Note",
      description: "Auto-creates retrospective document in Knowledge Vault upon goal completion.",
      enabled: true,
      trigger: { eventType: "GOAL_COMPLETED", label: "Goal Accomplished" },
      conditions: [],
      actions: [
        { actionType: "CREATE_NOTE", label: "Generate Retrospective Document", params: { category: "Operations" } },
      ],
    },
  },
];
