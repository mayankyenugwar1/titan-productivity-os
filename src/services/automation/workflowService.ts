import type { EventType } from "./eventBusService";

export interface WorkflowTrigger {
  eventType: EventType;
  label: string;
}

export interface WorkflowCondition {
  field: string;
  operator: "equals" | "greater_than" | "contains";
  value: string;
}

export interface WorkflowAction {
  actionType: "CREATE_MISSION" | "AWARD_XP" | "CREATE_NOTE" | "SEND_NOTIFICATION";
  label: string;
  params: Record<string, any>;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  trigger: WorkflowTrigger;
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
  runCount: number;
  lastRunAt?: string;
}

export interface ExecutionRecord {
  id: string;
  workflowId: string;
  workflowName: string;
  status: "SUCCESS" | "FAILED";
  timestamp: string;
  durationMs: number;
  logs: string[];
}

export function getInitialWorkflows(): Workflow[] {
  return [
    {
      id: "wf-1",
      name: "Morning Focus Protocol",
      description: "When daily tick occurs at 08:00 AM, generate focus directive and award +50 XP bonus.",
      enabled: true,
      trigger: { eventType: "SCHEDULED_TICK", label: "Daily Scheduled Tick (08:00 AM)" },
      conditions: [{ field: "time", operator: "equals", value: "08:00" }],
      actions: [
        { actionType: "CREATE_MISSION", label: "Create Morning Focus Directive", params: { title: "Execute Morning Focus Session" } },
        { actionType: "AWARD_XP", label: "Award +50 Operational Bonus XP", params: { xp: 50 } },
      ],
      runCount: 14,
      lastRunAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    },
    {
      id: "wf-2",
      name: "Streak Preservation Alert & Journal Auto-Entry",
      description: "When an operation mission is completed, auto-create a daily journal entry in Knowledge OS.",
      enabled: true,
      trigger: { eventType: "MISSION_COMPLETED", label: "Operation Mission Accomplished" },
      conditions: [{ field: "category", operator: "equals", value: "Operations" }],
      actions: [
        { actionType: "CREATE_NOTE", label: "Create Knowledge OS Journal Log", params: { category: "Journal" } },
      ],
      runCount: 8,
      lastRunAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    },
  ];
}
