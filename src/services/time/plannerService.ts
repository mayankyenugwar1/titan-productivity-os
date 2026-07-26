import type { CalendarEvent } from "./calendarService";

export interface PlannerMetrics {
  currentMission: CalendarEvent | null;
  nextMission: CalendarEvent | null;
  freeTimeHours: number;
  busyTimeHours: number;
  totalFocusHours: number;
  breakTimeMins: number;
  completionPercent: number;
}

export function calculatePlannerMetrics(events: CalendarEvent[]): PlannerMetrics {
  const active = events.filter((e) => !e.archived);
  const completed = active.filter((e) => e.completed);

  const busyMins = active.reduce((sum, e) => sum + (e.durationMins || 45), 0);
  const busyTimeHours = Number((busyMins / 60).toFixed(1));
  const freeTimeHours = Number(Math.max(0, 10 - busyTimeHours).toFixed(1));
  const totalFocusHours = Number((busyTimeHours * 0.85).toFixed(1));
  const breakTimeMins = active.length * 15;

  const currentMission = active.find((e) => !e.completed) || null;
  const pendingMissions = active.filter((e) => !e.completed);
  const nextMission = pendingMissions.length > 1 ? pendingMissions[1] : null;

  const completionPercent = active.length > 0 ? Math.round((completed.length / active.length) * 100) : 0;

  return {
    currentMission,
    nextMission,
    freeTimeHours,
    busyTimeHours,
    totalFocusHours,
    breakTimeMins,
    completionPercent,
  };
}
