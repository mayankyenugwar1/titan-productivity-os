import { Calendar, Clock } from "lucide-react";
import type { TimeBlockScheduleItem } from "@/services/ai/plannerService";
import { TitanBadge } from "@/components/ui";

interface PlannerScheduleWidgetProps {
  schedule: TimeBlockScheduleItem[];
}

export default function PlannerScheduleWidget({ schedule }: PlannerScheduleWidgetProps) {
  if (schedule.length === 0) return null;

  return (
    <div className="rounded-3xl border border-zinc-800/80 bg-[#070709] p-6 shadow-2xl shadow-black font-mono space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="size-4 text-[#e5c158]" />
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#e5c158]">
            SMART TIME-BLOCK SCHEDULE
          </span>
        </div>
        <TitanBadge variant="gold" size="sm">
          {schedule.length} TIME SLOTS
        </TitanBadge>
      </div>

      <div className="space-y-2.5 text-xs">
        {schedule.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-2xl border border-zinc-800/80 bg-[#0c0c0f] p-3.5"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-[#e5c158] font-bold text-[11px] w-20 shrink-0">
                <Clock className="size-3" /> {item.timeSlot}
              </div>
              <div>
                <h5 className="font-sans font-bold text-white text-xs">{item.title}</h5>
                <span className="text-[10px] text-zinc-500 font-bold">{item.category}</span>
              </div>
            </div>

            <TitanBadge variant={item.priority === "High" ? "red" : "gold"} size="sm">
              {item.durationMins} MINS
            </TitanBadge>
          </div>
        ))}
      </div>
    </div>
  );
}
