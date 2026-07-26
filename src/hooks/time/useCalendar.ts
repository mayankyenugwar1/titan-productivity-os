import { useState, useMemo } from "react";
import { useHabitStore } from "@/store/missionStore";
import { getCalendarEventsFromHabits } from "@/services/time/calendarService";
import { detectSchedulingConflicts, type SchedulingConflict } from "@/services/time/conflictService";

export type CalendarViewMode = "day" | "week" | "month" | "agenda" | "timeline" | "planner";

export function useCalendar() {
  const { habits } = useHabitStore();

  const [viewMode, setViewMode] = useState<CalendarViewMode>("week");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const rawEvents = useMemo(() => getCalendarEventsFromHabits(habits), [habits]);

  const filteredEvents = useMemo(() => {
    return rawEvents.filter((ev) => {
      if (categoryFilter !== "ALL" && ev.category !== categoryFilter) return false;
      if (priorityFilter !== "ALL" && ev.priority !== priorityFilter) return false;
      if (searchQuery.trim() && !ev.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [rawEvents, categoryFilter, priorityFilter, searchQuery]);

  const conflicts: SchedulingConflict[] = useMemo(() => {
    return detectSchedulingConflicts(rawEvents);
  }, [rawEvents]);

  return {
    viewMode,
    setViewMode,
    selectedDate,
    setSelectedDate,
    categoryFilter,
    setCategoryFilter,
    priorityFilter,
    setPriorityFilter,
    searchQuery,
    setSearchQuery,
    events: filteredEvents,
    allEvents: rawEvents,
    conflicts,
  };
}
