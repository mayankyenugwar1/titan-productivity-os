import type { Habit } from "@/features/missions/types";
import type { Project, Goal } from "@/services/projects/projectService";
import type { KnowledgeItem } from "@/services/knowledge/knowledgeService";
import type { Workflow } from "@/services/automation/workflowService";
import { getProgressionDetails } from "@/services/xpEngineService";

export interface ExtendedAIContextPayload {
  habits: Habit[];
  projectsCount: number;
  goalsCount: number;
  notesCount: number;
  workflowsCount: number;
  activeMissionsCount: number;
  completedMissionsCount: number;
  totalXP: number;
  streak: number;
  focusScore: number;
  level: number;
  rank: string;
  timestamp: string;
}

export type AIContextPayload = ExtendedAIContextPayload;

export function assembleExtendedAIContext(
  habits: Habit[],
  projects: Project[],
  goals: Goal[],
  notes: KnowledgeItem[],
  workflows: Workflow[],
  totalXP: number,
  streak: number,
  focusScore: number
): ExtendedAIContextPayload {
  const progression = getProgressionDetails(totalXP);
  const activeMissionsCount = habits.filter((h) => !h.completed).length;
  const completedMissionsCount = habits.filter((h) => h.completed).length;

  return {
    habits,
    projectsCount: projects.length,
    goalsCount: goals.length,
    notesCount: notes.length,
    workflowsCount: workflows.length,
    activeMissionsCount,
    completedMissionsCount,
    totalXP,
    streak,
    focusScore,
    level: progression.level,
    rank: progression.rank,
    timestamp: new Date().toISOString(),
  };
}

export function assembleAIContext(
  habits: Habit[],
  totalXP: number,
  streak: number,
  focusScore: number
): ExtendedAIContextPayload {
  return assembleExtendedAIContext(habits, [], [], [], [], totalXP, streak, focusScore);
}
