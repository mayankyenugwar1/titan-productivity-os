import { Filter, Layers } from "lucide-react";
import { TitanBadge } from "@/components/ui";
import type { CalendarEvent } from "@/services/time/calendarService";
import { ALLOWED_CATEGORIES } from "@/constants/categories";

interface CalendarSidebarProps {
  categoryFilter: string;
  onCategoryChange: (cat: string) => void;
  priorityFilter: string;
  onPriorityChange: (p: string) => void;
  unscheduledEvents: CalendarEvent[];
}

export default function CalendarSidebar({
  categoryFilter,
  onCategoryChange,
  priorityFilter,
  onPriorityChange,
  unscheduledEvents,
}: CalendarSidebarProps) {
  const categories = ["ALL", ...ALLOWED_CATEGORIES];
  const priorities = ["ALL", "High", "Medium", "Low"];

  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-6 font-mono text-zinc-100">
      {/* Category Filter Widget */}
      <div className="rounded-3xl border border-zinc-800/80 bg-[#070709] p-5 shadow-2xl shadow-black space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Filter className="size-4 text-[#e5c158]" />
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#e5c158]">
              SECTOR FILTERS
            </span>
          </div>
          <TitanBadge variant="gold" size="sm">
            FILTERS
          </TitanBadge>
        </div>

        <div className="space-y-2 text-xs">
          <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
            Category Sector
          </span>
          <div className="space-y-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`w-full rounded-xl px-3 py-1.5 text-left font-bold transition ${
                  categoryFilter === cat
                    ? "border border-[#d4af37]/40 bg-[#d4af37]/15 text-[#e5c158]"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Priority Filter */}
        <div className="space-y-2 text-xs border-t border-zinc-800/80 pt-3">
          <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
            Priority Clearance
          </span>
          <div className="flex flex-wrap gap-1">
            {priorities.map((p) => (
              <button
                key={p}
                onClick={() => onPriorityChange(p)}
                className={`rounded-xl px-2.5 py-1 font-bold text-[11px] transition ${
                  priorityFilter === p
                    ? "border border-[#d4af37]/40 bg-[#d4af37] text-zinc-950"
                    : "border border-zinc-800 bg-[#0c0c0f] text-zinc-400 hover:text-white"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Unscheduled Queue Widget */}
      <div className="rounded-3xl border border-zinc-800/80 bg-[#070709] p-5 shadow-2xl shadow-black space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="size-4 text-sky-400" />
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-sky-400">
              UNSCHEDULED QUEUE
            </span>
          </div>
          <TitanBadge variant="blue" size="sm">
            {unscheduledEvents.length}
          </TitanBadge>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {unscheduledEvents.length === 0 ? (
            <p className="text-xs text-zinc-500 italic p-2 text-center">Queue is empty.</p>
          ) : (
            unscheduledEvents.map((ev) => (
              <div
                key={ev.id}
                className="rounded-2xl border border-zinc-800/60 bg-[#0c0c0f] p-3 space-y-1 hover:border-zinc-700 transition"
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-[#e5c158]">{ev.category}</span>
                  <span className="text-zinc-500">{ev.durationMins}m</span>
                </div>
                <h5 className="font-sans font-bold text-xs text-zinc-200 truncate">{ev.title}</h5>
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );
}
