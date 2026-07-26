export interface WorkflowTemplate {
  id: string;
  name: string;
  category: "Productivity" | "Focus" | "Knowledge" | "Recovery";
  description: string;
  trigger: string;
  actionsCount: number;
  tags: string[];
}

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    id: "tmpl-1",
    name: "Morning Focus Accelerator",
    category: "Focus",
    description: "When morning arrives, create high-priority focus directives and trigger AI Daily Briefing.",
    trigger: "Morning Routine",
    actionsCount: 3,
    tags: ["morning", "focus", "ai-briefing"],
  },
  {
    id: "tmpl-2",
    name: "Overdue Mission Recovery",
    category: "Productivity",
    description: "When an operation is marked overdue, automatically reschedule to tomorrow and notify AI Commander.",
    trigger: "OverdueMission",
    actionsCount: 2,
    tags: ["reschedule", "recovery"],
  },
  {
    id: "tmpl-3",
    name: "Knowledge Vault Auto-Capture",
    category: "Knowledge",
    description: "When a mission is completed with High Priority, generate a markdown summary note in Knowledge Vault.",
    trigger: "MissionCompleted",
    actionsCount: 2,
    tags: ["knowledge", "notes"],
  },
  {
    id: "tmpl-4",
    name: "Project Milestone Reward",
    category: "Productivity",
    description: "When a project milestone is completed, award +200 XP and publish achievement stream to Discord.",
    trigger: "ProjectCompleted",
    actionsCount: 3,
    tags: ["xp", "rewards", "discord"],
  },
];
