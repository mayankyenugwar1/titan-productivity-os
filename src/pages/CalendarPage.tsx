import { useState } from "react";
import { useCalendar } from "@/hooks/time/useCalendar";
import { SectionHeader } from "@/components/ui";
import CalendarToolbar from "@/components/time/CalendarToolbar";
import CalendarSidebar from "@/components/time/CalendarSidebar";
import ConflictBanner from "@/components/time/ConflictBanner";
import TodayPlanner from "@/components/time/TodayPlanner";
import DayView from "@/components/time/DayView";
import WeekView from "@/components/time/WeekView";
import MonthView from "@/components/time/MonthView";
import AgendaView from "@/components/time/AgendaView";
import TimelineView from "@/components/time/TimelineView";
import QuickAddDialog from "@/components/time/QuickAddDialog";

export default function CalendarPage() {
  const {
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
    events,
    conflicts,
  } = useCalendar();

  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  const unscheduledEvents = events.filter((e) => !e.completed && !e.archived);

  return (
    <div className="space-y-8 py-4 font-mono text-zinc-100">
      <SectionHeader
        badge="Chrono Command Engine"
        title="TITAN Time Operating System"
        description="Scalable scheduling backbone integrating Mission Control, Today Planner, Conflict Detection, and Multi-View Chrono Grid."
      />

      {/* Conflict Warning Alerts */}
      <ConflictBanner conflicts={conflicts} />

      {/* Main Toolbar */}
      <CalendarToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onQuickAdd={() => setIsQuickAddOpen(true)}
      />

      {/* Main Body Grid */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar */}
        <CalendarSidebar
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          priorityFilter={priorityFilter}
          onPriorityChange={setPriorityFilter}
          unscheduledEvents={unscheduledEvents}
        />

        {/* Right Active View */}
        <main className="flex-1 min-w-0">
          {viewMode === "planner" && <TodayPlanner />}
          {viewMode === "day" && <DayView events={events} />}
          {viewMode === "week" && <WeekView events={events} />}
          {viewMode === "month" && <MonthView events={events} />}
          {viewMode === "agenda" && <AgendaView />}
          {viewMode === "timeline" && <TimelineView events={events} />}
        </main>
      </div>

      {/* Quick Add Dialog */}
      <QuickAddDialog open={isQuickAddOpen} onClose={() => setIsQuickAddOpen(false)} />
    </div>
  );
}
