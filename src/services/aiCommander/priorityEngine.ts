import type { Habit } from "@/features/missions/types";
import { calculateDynamicXP } from "@/features/missions/types";

export interface PrioritizedMissionStep {
  step: number;
  habit: Habit;
  title: string;
  category: string;
  durationStr: string;
  xpYield: number;
  reasoning: string;
}

export function generateSmartPrioritization(habits: Habit[]): PrioritizedMissionStep[] {
  if (habits.length === 0) return [];

  // Sort by priority weight, XP yield, and completion status
  const sorted = [...habits].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;

    const priorityWeight = (p: string) => (p === "High" ? 3 : p === "Medium" ? 2 : 1);
    const pDiff = priorityWeight(b.priority) - priorityWeight(a.priority);
    if (pDiff !== 0) return pDiff;

    return calculateDynamicXP(b) - calculateDynamicXP(a);
  });

  return sorted.slice(0, 4).map((habit, index) => {
    const xp = calculateDynamicXP(habit);
    const durationStr = habit.priority === "High" ? "90 min" : habit.priority === "Medium" ? "45 min" : "20 min";

    let reasoning = "";
    if (index === 0) {
      reasoning = "Highest priority & XP payload — execute during morning cognitive peak for maximum yield.";
    } else if (index === 1) {
      reasoning = "High-impact follow-up operation — maintain momentum immediately after primary objective.";
    } else if (index === 2) {
      reasoning = "Mid-day focus target — ideal for execution prior to scheduled tactical break.";
    } else {
      reasoning = "Secondary operational objective — execute in late afternoon window.";
    }

    return {
      step: index + 1,
      habit,
      title: habit.title,
      category: habit.category,
      durationStr,
      xpYield: xp,
      reasoning,
    };
  });
}
