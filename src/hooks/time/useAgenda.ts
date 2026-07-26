import { useMemo } from "react";
import { useCalendar } from "./useCalendar";
import type { CalendarEvent } from "@/services/time/calendarService";

export interface AgendaSections {
  morning: CalendarEvent[];
  afternoon: CalendarEvent[];
  evening: CalendarEvent[];
  night: CalendarEvent[];
  completed: CalendarEvent[];
}

export function useAgenda(): AgendaSections {
  const { events } = useCalendar();

  return useMemo(() => {
    const morning: CalendarEvent[] = [];
    const afternoon: CalendarEvent[] = [];
    const evening: CalendarEvent[] = [];
    const night: CalendarEvent[] = [];
    const completed: CalendarEvent[] = [];

    events.forEach((ev) => {
      if (ev.completed) {
        completed.push(ev);
        return;
      }

      const hour = parseInt(ev.startTime.split(":")[0] || "0", 10);
      if (hour >= 6 && hour < 12) {
        morning.push(ev);
      } else if (hour >= 12 && hour < 17) {
        afternoon.push(ev);
      } else if (hour >= 17 && hour < 21) {
        evening.push(ev);
      } else {
        night.push(ev);
      }
    });

    return { morning, afternoon, evening, night, completed };
  }, [events]);
}
