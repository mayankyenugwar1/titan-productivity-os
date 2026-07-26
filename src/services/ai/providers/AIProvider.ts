export type ProviderId = "LOCAL" | "OPENAI" | "GEMINI" | "CLAUDE";

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

export interface StructuredIntent {
  intent: AgentIntentType;
  confidence: number;
  parameters: Record<string, any>;
  summaryText: string;
}

export interface AIProvider {
  id: ProviderId;
  name: string;
  sendMessage(prompt: string, contextPayload: any, apiKey?: string): Promise<string>;
  detectIntent(input: string): Promise<StructuredIntent>;
}
