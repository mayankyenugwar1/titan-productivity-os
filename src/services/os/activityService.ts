import type { Habit } from "@/features/missions/types";
import { calculateDynamicXP } from "@/features/missions/types";

export interface ActivityFeedItem {
  id: string;
  title: string;
  description: string;
  type: "CREATED" | "STARTED" | "COMPLETED" | "LEVEL_UP" | "ACHIEVEMENT" | "COIN_EARNED" | "XP_EARNED";
  timestamp: string;
  category?: string;
  xpValue?: number;
}

export function generateActivityFeed(habits: Habit[]): ActivityFeedItem[] {
  const items: ActivityFeedItem[] = [];

  habits.forEach((habit) => {
    const xp = calculateDynamicXP(habit);

    if (habit.completed) {
      items.push({
        id: `act-comp-${habit.id}`,
        title: `Operation Complete: ${habit.title}`,
        description: `Accomplished operation in ${habit.category} sector yielding +${xp} XP.`,
        type: "COMPLETED",
        timestamp: habit.completedAt ? new Date(habit.completedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Today",
        category: habit.category,
        xpValue: xp,
      });
    }

    items.push({
      id: `act-create-${habit.id}`,
      title: `Directive Created: ${habit.title}`,
      description: `Assigned priority ${habit.priority.toUpperCase()} in ${habit.category} sector.`,
      type: "CREATED",
      timestamp: "Today",
      category: habit.category,
    });
  });

  items.push({
    id: "act-level-1",
    title: "Clearance Level Up",
    description: "Operator promoted to Clearance Level 2 in Wayne OS Engine.",
    type: "LEVEL_UP",
    timestamp: "Yesterday",
  });

  return items;
}
