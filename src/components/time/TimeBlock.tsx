import { Check, Clock } from "lucide-react";
import type { CalendarEvent } from "@/services/time/calendarService";
import { TitanBadge } from "@/components/ui";

interface TimeBlockProps {
  event: CalendarEvent;
}

export default function TimeBlock({ event }: TimeBlockProps) {
  const getBorderColor = (priority: string) => {
    if (priority === "High") return "border-red-500/40 bg-red-500/10";
    if (priority === "Medium") return "border-[#d4af37]/40 bg-[#d4af37]/10";
    return "border-sky-400/40 bg-sky-400/10";
  };

  return (
    <div
      className={`group relative rounded-2xl border p-3.5 space-y-1.5 transition duration-300 shadow-lg ${getBorderColor(
        event.priority
      )} ${event.completed ? "opacity-60 line-through" : "hover:scale-[1.01]"}`}
    >
      <div className="flex items-center justify-between font-mono text-xs">
        <div className="flex items-center gap-2">
          <Clock className="size-3.5 text-[#e5c158]" />
          <span className="font-bold text-white">
            {event.startTime} - {event.endTime}
          </span>
        </div>
        <TitanBadge variant={event.priority === "High" ? "red" : "gold"} size="sm">
          {event.category}
        </TitanBadge>
      </div>

      <h4 className="font-sans font-bold text-sm text-zinc-100">{event.title}</h4>

      {event.description && (
        <p className="text-xs text-zinc-300 font-sans line-clamp-1">{event.description}</p>
      )}

      {event.completed && (
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold pt-1">
          <Check className="size-4 stroke-[3]" />
          <span>OPERATION ACCOMPLISHED</span>
        </div>
      )}
    </div>
  );
}
