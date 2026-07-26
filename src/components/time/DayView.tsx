import type { CalendarEvent } from "@/services/time/calendarService";
import TimeBlock from "./TimeBlock";

interface DayViewProps {
  events: CalendarEvent[];
}

export default function DayView({ events }: DayViewProps) {
  const hours = [
    "08:00", "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00",
    "18:00", "19:00", "20:00"
  ];

  return (
    <div className="rounded-3xl border border-zinc-800/80 bg-[#070709] p-6 shadow-2xl shadow-black font-mono space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#e5c158]">
          DAY TIMELINE GRID (08:00 - 20:00)
        </span>
        <span className="text-xs text-zinc-500 font-bold">HOURLY CHRONO</span>
      </div>

      <div className="space-y-4">
        {hours.map((hour) => {
          const hourEvents = events.filter((e) => e.startTime.startsWith(hour.slice(0, 2)));
          return (
            <div key={hour} className="flex gap-4 border-t border-zinc-800/60 pt-3">
              <span className="w-14 text-xs font-bold text-zinc-400 shrink-0">{hour}</span>
              <div className="flex-1 space-y-2">
                {hourEvents.length === 0 ? (
                  <div className="h-9 rounded-xl border border-dashed border-zinc-800/60 bg-[#0c0c0f]/40 px-3 flex items-center text-[10px] text-zinc-600 font-bold">
                    AVAILABLE TIME SLOT
                  </div>
                ) : (
                  hourEvents.map((ev) => <TimeBlock key={ev.id} event={ev} />)
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
