import type { AIProvider, StructuredIntent } from "./AIProvider";

export class MockProvider implements AIProvider {
  id = "LOCAL" as const;
  name = "Wayne Core Local Intelligence Engine";

  async sendMessage(prompt: string, contextPayload: any): Promise<string> {
    const q = prompt.toLowerCase();
    const habitCount = contextPayload?.habits?.length || 0;
    const completedCount = contextPayload?.habits?.filter((h: any) => h.completed)?.length || 0;
    const streak = contextPayload?.streak || 0;

    if (q.includes("plan") || q.includes("schedule")) {
      return `[WAYNE OS INTELLIGENCE] Daily Plan Analysis:\nYou have ${habitCount} assigned operations. I recommend executing high-priority directives first during your morning cognitive window (08:00 AM - 11:30 AM). Expected focus payload: ${completedCount * 110} XP.`;
    }

    if (q.includes("overdue") || q.includes("warning")) {
      return `[WAYNE OS INTELLIGENCE] Telemetry Alert:\nActive combat streak: ${streak} Days. Ensure high-impact operations scheduled after 06:00 PM are reviewed to prevent postponement.`;
    }

    if (q.includes("summary") || q.includes("summarize")) {
      return `[WAYNE OS INTELLIGENCE] Executive Summary:\nCompletion Rate: ${habitCount > 0 ? Math.round((completedCount / habitCount) * 100) : 100}%. Systems operational. All clearance metrics nominal.`;
    }

    return `[WAYNE OS INTELLIGENCE] Command Acknowledged:\nProcessing directive "${prompt}". Telemetry context loaded (${habitCount} operations, ${streak} day streak). Proceeding with execution.`;
  }

  async detectIntent(input: string): Promise<StructuredIntent> {
    const q = input.toLowerCase();

    if (q.includes("create") || q.includes("add mission") || q.includes("new operation")) {
      return {
        intent: "CREATE_MISSION",
        confidence: 0.95,
        parameters: { rawText: input },
        summaryText: "Intent Detected: Create New Mission Directive",
      };
    }

    if (q.includes("plan") || q.includes("generate plan")) {
      return {
        intent: "GENERATE_PLAN",
        confidence: 0.92,
        parameters: { timeframe: "daily" },
        summaryText: "Intent Detected: Generate Daily Execution Plan",
      };
    }

    if (q.includes("prioritize") || q.includes("priority")) {
      return {
        intent: "PRIORITIZE_TASKS",
        confidence: 0.88,
        parameters: {},
        summaryText: "Intent Detected: Optimize Priority Order",
      };
    }

    if (q.includes("summarize") || q.includes("summary")) {
      return {
        intent: "SUMMARIZE_DAY",
        confidence: 0.9,
        parameters: {},
        summaryText: "Intent Detected: Summarize Daily Operational Status",
      };
    }

    return {
      intent: "UNKNOWN",
      confidence: 0.5,
      parameters: {},
      summaryText: "General Operator Query",
    };
  }
}
