import type { Habit } from "@/features/missions/types";
import type { Project } from "@/services/projects/projectService";
import type { KnowledgeItem } from "@/services/knowledge/knowledgeService";
import { sanitizeCategory } from "@/constants/categories";

export interface AISmartSuggestion {
  id: string;
  type: "CRITICAL" | "WARNING" | "RECOMMENDATION" | "OPTIMIZATION";
  title: string;
  description: string;
  suggestedPrompt: string;
  category: string;
}

export function generateSmartSuggestions(
  habits: Habit[],
  projects: Project[],
  notes: KnowledgeItem[],
  streak: number
): AISmartSuggestion[] {
  const suggestions: AISmartSuggestion[] = [];

  const uncompleted = habits.filter((h) => !h.completed);
  const workoutToday = habits.some((h) => (sanitizeCategory(h.category) === "Physical" || sanitizeCategory(h.category) === "Fitness") && h.completed);

  // 1. Overdue Operations Warning
  if (uncompleted.length > 2) {
    suggestions.push({
      id: "sug-overdue",
      type: "WARNING",
      title: `${uncompleted.length} Directives Pending Execution`,
      description: "Multiple active operations queued for today. Use AI to optimize your timeline.",
      suggestedPrompt: "Move overdue missions and optimize my calendar schedule",
      category: "Mission OS",
    });
  }

  // 2. Workout Directive Suggestion
  if (!workoutToday) {
    suggestions.push({
      id: "sug-workout",
      type: "RECOMMENDATION",
      title: "Physical Recovery Window Available",
      description: "No physical sector operation accomplished today. Maintain physical readiness.",
      suggestedPrompt: "Create workout mission for physical recovery",
      category: "Health & Fitness",
    });
  }

  // 3. Active Projects Check
  const activeProjects = projects.filter((p) => p.status === "Active");
  if (activeProjects.length > 0) {
    suggestions.push({
      id: "sug-project",
      type: "OPTIMIZATION",
      title: `${activeProjects.length} Strategic Projects Active`,
      description: "Generate a consolidated progress review and next milestones.",
      suggestedPrompt: "Create project roadmap and analyze progress for active projects",
      category: "Projects OS",
    });
  }

  // 4. Knowledge Vault Check
  if (notes.length === 0) {
    suggestions.push({
      id: "sug-knowledge",
      type: "RECOMMENDATION",
      title: "Knowledge Vault Empty",
      description: "Create an executive document or study note to start building your personal wiki.",
      suggestedPrompt: "Generate note summarizing today's key learnings",
      category: "Knowledge OS",
    });
  }

  // 5. Streak Boost
  if (streak > 0) {
    suggestions.push({
      id: "sug-streak",
      type: "CRITICAL",
      title: `${streak}-Day Combat Streak Active`,
      description: "Keep momentum alive by completing your highest priority operation now.",
      suggestedPrompt: "Plan today to maintain my combat streak",
      category: "Progression",
    });
  }

  return suggestions;
}
