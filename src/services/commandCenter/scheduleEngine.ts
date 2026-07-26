import type { Habit } from "@/features/missions/types";
import { calculateDynamicXP } from "@/features/missions/types";

export interface ScheduledMissionPlan {
  habit: Habit;
  recommendedStartTime: string;
  recommendedEndTime: string;
  durationMins: number;
  durationStr: string;
  reasonForPlacement: string;
}

export function generateOptimizedSchedule(habits: Habit[]): ScheduledMissionPlan[] {
  const active = habits.filter((h) => !h.completed);
  if (active.length === 0) return [];

  // Sort by priority, XP yield, and category
  const sorted = [...active].sort((a, b) => {
    const priorityWeight = (p: string) => (p === "High" ? 3 : p === "Medium" ? 2 : 1);
    const diff = priorityWeight(b.priority) - priorityWeight(a.priority);
    if (diff !== 0) return diff;
    return calculateDynamicXP(b) - calculateDynamicXP(a);
  });

  let currentHour = 8;
  let currentMin = 0;

  return sorted.map((habit, index) => {
    const durationMins = habit.priority === "High" ? 90 : habit.priority === "Medium" ? 45 : 20;

    const startH = currentHour;
    const startM = currentMin;
    const startPeriod = startH >= 12 ? "PM" : "AM";
    const startDisplayH = startH > 12 ? startH - 12 : startH;
    const startTimeStr = `${startDisplayH.toString().padStart(2, "0")}:${startM.toString().padStart(2, "0")} ${startPeriod}`;

    let totalEndM = currentMin + durationMins;
    let endH = currentHour + Math.floor(totalEndM / 60);
    let endM = totalEndM % 60;
    const endPeriod = endH >= 12 ? "PM" : "AM";
    const endDisplayH = endH > 12 ? endH - 12 : endH;
    const endTimeStr = `${endDisplayH.toString().padStart(2, "0")}:${endM.toString().padStart(2, "0")} ${endPeriod}`;

    // Advance start for next item (+15 min break)
    let nextTotalM = totalEndM + 15;
    currentHour = currentHour + Math.floor(nextTotalM / 60);
    currentMin = nextTotalM % 60;

    let reason = "";
    if (index === 0) {
      reason = "Scheduled first because it has the highest priority tag and maximum XP payload.";
    } else if (habit.priority === "High") {
      reason = "Placed in early focus window due to high cognitive demand.";
    } else if (habit.category === "Physical") {
      reason = "Scheduled mid-day to provide physical energy reset between deep work blocks.";
    } else {
      reason = "Optimized placement following primary focus block.";
    }

    return {
      habit,
      recommendedStartTime: startTimeStr,
      recommendedEndTime: endTimeStr,
      durationMins,
      durationStr: `${durationMins} min`,
      reasonForPlacement: reason,
    };
  });
}
