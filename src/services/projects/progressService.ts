import type { Goal, Project } from "./projectService";

export function calculateProjectProgress(project: Project): number {
  if (!project.milestones || project.milestones.length === 0) {
    return project.status === "Completed" ? 100 : 0;
  }
  const completed = project.milestones.filter((m) => m.completed).length;
  return Math.round((completed / project.milestones.length) * 100);
}

export function calculateGoalProgress(goal: Goal): number {
  if (!goal.keyResults || goal.keyResults.length === 0) return 0;

  const totalProgress = goal.keyResults.reduce((acc, kr) => {
    const krPercent = Math.min(100, Math.round((kr.currentValue / kr.targetValue) * 100));
    return acc + krPercent;
  }, 0);

  return Math.round(totalProgress / goal.keyResults.length);
}
