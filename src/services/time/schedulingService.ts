import type { CalendarEvent } from "./calendarService";

export interface FreeSlotSuggestion {
  startDate: string;
  startTime: string;
  endTime: string;
  durationMins: number;
}

export function suggestFreeSlot(events: CalendarEvent[], durationMins = 60): FreeSlotSuggestion {
  const todayStr = new Date().toISOString().split("T")[0];

  // Default to 14:00 if free
  const busyEndMins = events.reduce((max, e) => {
    const [h, m] = e.endTime.split(":").map(Number);
    const end = (h || 0) * 60 + (m || 0);
    return end > max ? end : max;
  }, 10 * 60);

  const startMins = Math.min(18 * 60, busyEndMins + 30);
  const endMins = startMins + durationMins;

  const startH = Math.floor(startMins / 60).toString().padStart(2, "0");
  const startM = (startMins % 60).toString().padStart(2, "0");
  const endH = Math.floor(endMins / 60).toString().padStart(2, "0");
  const endM = (endMins % 60).toString().padStart(2, "0");

  return {
    startDate: todayStr,
    startTime: `${startH}:${startM}`,
    endTime: `${endH}:${endM}`,
    durationMins,
  };
}

export function findEmptyTimeSlots(events: CalendarEvent[]): string[] {
  const hours = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"];
  const busyStarts = new Set(events.map((e) => e.startTime));
  return hours.filter((h) => !busyStarts.has(h));
}

export function optimizeOrder(events: CalendarEvent[]): CalendarEvent[] {
  // Sort high priority first, then earliest start time
  return [...events].sort((a, b) => {
    if (a.priority === "High" && b.priority !== "High") return -1;
    if (a.priority !== "High" && b.priority === "High") return 1;
    return a.startTime.localeCompare(b.startTime);
  });
}
