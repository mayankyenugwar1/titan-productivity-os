import type { StructuredIntent } from "./providers/AIProvider";

export type AgentIntentType =
  | "CREATE_MISSION"
  | "DELETE_MISSION"
  | "RESCHEDULE_MISSION"
  | "SUMMARIZE_DAY"
  | "GENERATE_PLAN"
  | "PRIORITIZE_TASKS"
  | "ANALYZE_PRODUCTIVITY"
  | "CREATE_PROJECT"
  | "GENERATE_NOTE"
  | "TRIGGER_WORKFLOW"
  | "OPTIMIZE_SCHEDULE"
  | "UNKNOWN";

export function classifyIntent(prompt: string): StructuredIntent {
  const p = prompt.toLowerCase().trim();

  if (p.includes("create mission") || p.includes("add mission") || p.includes("new habit") || p.includes("workout mission")) {
    let category = "Operations";
    if (p.includes("workout") || p.includes("exercise") || p.includes("gym")) category = "Fitness";
    if (p.includes("read") || p.includes("book")) category = "Reading";
    if (p.includes("code") || p.includes("dev")) category = "Coding";

    return {
      intent: "CREATE_MISSION",
      confidence: 0.95,
      parameters: {
        title: prompt.replace(/create mission|add mission|new habit|workout mission/gi, "").trim() || "New AI Directive",
        category,
        priority: p.includes("urgent") || p.includes("critical") ? "High" : "Medium",
        xp: 100,
      },
      summaryText: "Intent detected: Create a tactical mission directive.",
    };
  }

  if (p.includes("plan today") || p.includes("daily plan") || p.includes("generate plan") || p.includes("study schedule")) {
    return {
      intent: "GENERATE_PLAN",
      confidence: 0.92,
      parameters: { planType: p.includes("study") ? "Study" : "Daily" },
      summaryText: "Intent detected: Generate optimized execution plan.",
    };
  }

  if (p.includes("create project") || p.includes("new project") || p.includes("project roadmap")) {
    return {
      intent: "CREATE_PROJECT",
      confidence: 0.9,
      parameters: {
        name: prompt.replace(/create project|new project|project roadmap/gi, "").trim() || "New Strategic Initiative",
        category: "Operations",
        priority: "High",
      },
      summaryText: "Intent detected: Initialize strategic project.",
    };
  }

  if (p.includes("new note") || p.includes("generate note") || p.includes("summarize notes") || p.includes("meeting notes")) {
    return {
      intent: "GENERATE_NOTE",
      confidence: 0.88,
      parameters: {
        title: prompt.replace(/new note|generate note|summarize notes|meeting notes/gi, "").trim() || "AI Generated Note",
        type: "DOCUMENT",
      },
      summaryText: "Intent detected: Create Knowledge Vault note.",
    };
  }

  if (p.includes("workflow") || p.includes("automation") || p.includes("run automation")) {
    return {
      intent: "TRIGGER_WORKFLOW",
      confidence: 0.94,
      parameters: { action: "EXECUTE_WORKFLOW" },
      summaryText: "Intent detected: Trigger workflow automation.",
    };
  }

  if (p.includes("optimize calendar") || p.includes("reschedule") || p.includes("overdue")) {
    return {
      intent: "OPTIMIZE_SCHEDULE",
      confidence: 0.91,
      parameters: { action: "RESCHEDULE_OVERDUE" },
      summaryText: "Intent detected: Optimize calendar schedule.",
    };
  }

  if (p.includes("analyze") || p.includes("productivity") || p.includes("weekly review") || p.includes("progress")) {
    return {
      intent: "ANALYZE_PRODUCTIVITY",
      confidence: 0.89,
      parameters: { scope: "WEEKLY" },
      summaryText: "Intent detected: Perform productivity telemetry analysis.",
    };
  }

  return {
    intent: "UNKNOWN",
    confidence: 0.5,
    parameters: {},
    summaryText: "General AI query / conversation.",
  };
}
