export interface PromptTemplate {
  id: string;
  name: string;
  category: "Planning" | "Review" | "Optimization" | "Decomposition";
  templateText: string;
}

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: "tmpl-plan-day",
    name: "Generate Daily Execution Plan",
    category: "Planning",
    templateText: "Generate an optimal daily execution sequence for my active operations based on high cognitive morning windows.",
  },
  {
    id: "tmpl-productivity-review",
    name: "Productivity & Velocity Review",
    category: "Review",
    templateText: "Analyze my completion velocity, active combat streak, and sector focus allocation over the past 7 days.",
  },
  {
    id: "tmpl-[#d4af37]-opt",
    name: "Schedule & Time Optimization",
    category: "Optimization",
    templateText: "Detect potential double-bookings and suggest free time slots to prevent operational burnout.",
  },
  {
    id: "tmpl-breakdown",
    name: "Decompose Objective into Directives",
    category: "Decomposition",
    templateText: "Decompose a complex project goal into 3 high-impact sub-operation directives.",
  },
];

export function getPromptById(id: string): string {
  const found = PROMPT_TEMPLATES.find((t) => t.id === id);
  return found ? found.templateText : "Analyze active operations telemetry.";
}
