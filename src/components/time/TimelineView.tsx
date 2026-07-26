import type { CalendarEvent } from "@/services/time/calendarService";
import { TitanBadge } from "@/components/ui";

interface TimelineViewProps {
  events: CalendarEvent[];
}

export default function TimelineView({ events }: TimelineViewProps) {
  return (
    <div className="rounded-3xl border border-zinc-800/80 bg-[#070709] p-6 shadow-2xl shadow-black font-mono space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#e5c158]">
          GANTT CHRONO TIMELINE VISUALIZATION
        </span>
        <TitanBadge variant="gold" size="sm">
          TIMELINE
        </TitanBadge>
      </div>

      <div className="space-y-4">
        {events.map((ev) => {
          const widthPercent = Math.min(100, Math.max(20, (ev.durationMins / 120) * 100));
          return (
            <div key={ev.id} className="space-y-1.5 border-b border-zinc-800/60 pb-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white font-sans">{ev.title}</span>
                <span className="text-zinc-400 font-bold">{ev.startTime} - {ev.endTime} ({ev.durationMins} mins)</span>
              </div>

              <div className="h-4 w-full rounded-full bg-zinc-900 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#d4af37] to-[#e5c158] transition-all duration-500"
                  style={{ width: `${widthPercent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
