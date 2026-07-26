import type { Habit } from "@/features/missions/types";

export interface TimeBlockScheduleItem {
  id: string;
  timeSlot: string;
  title: string;
  category: string;
  priority: "High" | "Medium" | "Low";
  durationMins: number;
  isCompleted: boolean;
}

export function generateSmartSchedule(habits: Habit[]): TimeBlockScheduleItem[] {
  const pending = habits.filter((h) => !h.completed);
  const timeSlots = ["08:30 AM", "10:00 AM", "01:30 PM", "03:30 PM", "05:00 PM"];

  return pending.slice(0, 5).map((habit, index) => ({
    id: `tb-${habit.id}`,
    timeSlot: timeSlots[index % timeSlots.length],
    title: habit.title,
    category: habit.category,
    priority: habit.priority,
    durationMins: habit.priority === "High" ? 45 : 30,
    isCompleted: false,
  }));
}
