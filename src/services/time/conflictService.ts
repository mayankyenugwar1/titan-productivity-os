import type { CalendarEvent } from "./calendarService";

export interface SchedulingConflict {
  id: string;
  eventId: string;
  conflictingEventId?: string;
  title: string;
  message: string;
  severity: "CRITICAL" | "WARNING";
}

export function detectSchedulingConflicts(events: CalendarEvent[]): SchedulingConflict[] {
  const conflicts: SchedulingConflict[] = [];

  for (let i = 0; i < events.length; i++) {
    const e1 = events[i];
    if (e1.completed || e1.archived) continue;

    // Check invalid duration
    if (e1.durationMins <= 0) {
      conflicts.push({
        id: `conf-dur-${e1.id}`,
        eventId: e1.id,
        title: "Invalid Duration",
        message: `Operation "${e1.title}" has a zero or negative duration.`,
        severity: "CRITICAL",
      });
    }

    // Compare with other events for time overlaps
    for (let j = i + 1; j < events.length; j++) {
      const e2 = events[j];
      if (e2.completed || e2.archived) continue;

      if (e1.startDate === e2.startDate) {
        const start1 = timeToMins(e1.startTime);
        const end1 = timeToMins(e1.endTime);
        const start2 = timeToMins(e2.startTime);
        const end2 = timeToMins(e2.endTime);

        if (start1 < end2 && start2 < end1) {
          conflicts.push({
            id: `conf-overlap-${e1.id}-${e2.id}`,
            eventId: e1.id,
            conflictingEventId: e2.id,
            title: "Double-Booking Overlap",
            message: `"${e1.title}" overlaps with "${e2.title}" between ${e1.startTime} and ${e1.endTime}.`,
            severity: "CRITICAL",
          });
        }
      }
    }
  }

  return conflicts;
}

function timeToMins(timeStr: string): number {
  const [h, m] = timeStr.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}
