import type { Habit } from "@/features/missions/types";

export interface CalendarEvent {
  id: string;
  missionId: string;
  title: string;
  description?: string;
  category: string;
  priority: "High" | "Medium" | "Low";
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  durationMins: number;
  completed: boolean;
  archived?: boolean;
  recurrenceRule?: "none" | "daily" | "weekdays" | "weekends" | "weekly" | "monthly" | "yearly";
}

export function habitToCalendarEvent(habit: Habit, index = 0): CalendarEvent {
  const todayStr = new Date().toISOString().split("T")[0];
  const startHour = 8 + (index * 2) % 10;
  const startTime = `${startHour.toString().padStart(2, "0")}:00`;
  const durationMins = habit.priority === "High" ? 90 : habit.priority === "Medium" ? 60 : 30;

  const endHour = startHour + Math.floor(durationMins / 60);
  const endMin = (durationMins % 60).toString().padStart(2, "0");
  const endTime = `${endHour.toString().padStart(2, "0")}:${endMin}`;

  return {
    id: `event-${habit.id}`,
    missionId: habit.id,
    title: habit.title,
    description: habit.description,
    category: habit.category,
    priority: habit.priority,
    startDate: todayStr,
    endDate: todayStr,
    startTime,
    endTime,
    durationMins,
    completed: Boolean(habit.completed),
    archived: Boolean(habit.archived),
    recurrenceRule: habit.frequency === "weekly" ? "weekly" : "daily",
  };
}

export function getCalendarEventsFromHabits(habits: Habit[]): CalendarEvent[] {
  return habits.map((h, idx) => habitToCalendarEvent(h, idx));
}
