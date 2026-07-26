import type { CalendarEvent } from "@/services/time/calendarService";

interface MonthViewProps {
  events: CalendarEvent[];
}

export default function MonthView({ events }: MonthViewProps) {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="rounded-3xl border border-zinc-800/80 bg-[#070709] p-6 shadow-2xl shadow-black font-mono space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#e5c158]">
          MONTHLY OPERATIONAL GRID
        </span>
        <span className="text-xs text-zinc-500 font-bold">MONTH VIEW</span>
      </div>

      <div className="grid grid-cols-7 gap-2 text-xs">
        {days.map((dayNum) => {
          const dayEvents = events.filter((_, idx) => (idx + 1) % 31 === dayNum % 31);
          return (
            <div
              key={dayNum}
              className="min-h-24 rounded-2xl border border-zinc-800/60 bg-[#0c0c0f] p-2 space-y-1.5 font-mono hover:border-[#d4af37]/40 transition"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-300">{dayNum}</span>
                {dayEvents.length > 0 && (
                  <span className="size-2 rounded-full bg-[#e5c158]" />
                )}
              </div>

              <div className="space-y-1">
                {dayEvents.slice(0, 2).map((ev) => (
                  <div key={ev.id} className="truncate rounded-md bg-zinc-800/80 px-1.5 py-0.5 text-[9px] font-bold text-zinc-200">
                    {ev.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <span className="text-[9px] font-bold text-[#e5c158]">+{dayEvents.length - 2} More</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
