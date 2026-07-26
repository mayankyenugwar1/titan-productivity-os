import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";
import type { CalendarViewMode } from "@/hooks/time/useCalendar";
import { TitanButton } from "@/components/ui";

interface CalendarToolbarProps {
  viewMode: CalendarViewMode;
  onViewModeChange: (mode: CalendarViewMode) => void;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onQuickAdd: () => void;
}

export default function CalendarToolbar({
  viewMode,
  onViewModeChange,
  selectedDate,
  onDateChange,
  searchQuery,
  onSearchChange,
  onQuickAdd,
}: CalendarToolbarProps) {
  const handlePrev = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() - 7);
    onDateChange(next);
  };

  const handleNext = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 7);
    onDateChange(next);
  };

  const formattedDate = selectedDate.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  const views: { id: CalendarViewMode; label: string }[] = [
    { id: "planner", label: "TODAY PLANNER" },
    { id: "day", label: "DAY" },
    { id: "week", label: "WEEK" },
    { id: "month", label: "MONTH" },
    { id: "agenda", label: "AGENDA" },
    { id: "timeline", label: "TIMELINE" },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-zinc-800/80 bg-[#070709] p-5 shadow-2xl shadow-black font-mono">
      {/* Date Navigation */}
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl border border-[#d4af37]/30 bg-[#d4af37]/10 text-[#e5c158]">
          <CalendarIcon className="size-5" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#e5c158]">
            CHRONO NAVIGATION
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <button onClick={handlePrev} className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white">
              <ChevronLeft className="size-4" />
            </button>
            <h3 className="text-base font-bold text-white font-sans">{formattedDate}</h3>
            <button onClick={handleNext} className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white">
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-zinc-800 bg-[#0c0c0f] p-1.5 text-xs">
        {views.map((v) => (
          <button
            key={v.id}
            onClick={() => onViewModeChange(v.id)}
            className={`rounded-xl px-3 py-1.5 font-bold transition ${
              viewMode === v.id
                ? "border border-[#d4af37]/40 bg-[#d4af37] text-zinc-950 shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* Search & Quick Add */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 size-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-44 rounded-xl border border-zinc-800 bg-[#0c0c0f] py-2 pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:border-[#d4af37] focus:outline-none"
          />
        </div>

        <TitanButton size="sm" leftIcon={<Plus className="size-4" />} onClick={onQuickAdd}>
          QUICK SCHEDULE
        </TitanButton>
      </div>
    </div>
  );
}
