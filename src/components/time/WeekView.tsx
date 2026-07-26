import type { CalendarEvent } from "@/services/time/calendarService";
import TimeBlock from "./TimeBlock";

interface WeekViewProps {
  events: CalendarEvent[];
}

export default function WeekView({ events }: WeekViewProps) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="rounded-3xl border border-zinc-800/80 bg-[#070709] p-6 shadow-2xl shadow-black font-mono space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#e5c158]">
          7-DAY OPERATIONAL MATRIX
        </span>
        <span className="text-xs text-zinc-500 font-bold">WEEKLY TELEMETRY</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-7 text-xs">
        {days.map((day, idx) => {
          const dayEvents = events.filter((_, i) => i % 7 === idx);
          return (
            <div key={day} className="rounded-2xl border border-zinc-800/70 bg-[#0c0c0f] p-3 space-y-2">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                <span className="font-bold text-white">{day}</span>
                <span className="text-[10px] text-[#e5c158] font-bold">{dayEvents.length} Tasks</span>
              </div>

              <div className="space-y-2">
                {dayEvents.length === 0 ? (
                  <p className="text-[10px] text-zinc-600 italic">Clear</p>
                ) : (
                  dayEvents.map((ev) => <TimeBlock key={ev.id} event={ev} />)
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
