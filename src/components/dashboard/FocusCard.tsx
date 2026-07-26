import { Brain } from "lucide-react";
import type { FocusTelemetry } from "@/services/commandCenter/dashboardService";
import WidgetContainer from "./WidgetContainer";

interface FocusCardProps {
  telemetry: FocusTelemetry;
}

export default function FocusCard({ telemetry }: FocusCardProps) {
  return (
    <WidgetContainer title="FOCUS ENGINE TELEMETRY" badge="DEEP WORK" icon={Brain}>
      <div className="space-y-4 text-xs font-mono">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-zinc-800 bg-[#0c0c0f] p-3.5 space-y-1">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Deep Work Time</span>
            <p className="text-xl font-black text-sky-400">{telemetry.deepWorkHours} Hours</p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-[#0c0c0f] p-3.5 space-y-1">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Est. Productive</span>
            <p className="text-xl font-black text-emerald-400">{telemetry.productiveHours} Hours</p>
          </div>
        </div>

        <div className="space-y-2 border-t border-zinc-800/60 pt-3">
          <div className="flex items-center justify-between text-zinc-400">
            <span>Longest Focus Session</span>
            <span className="font-bold text-white">{telemetry.longestSessionMins} Mins</span>
          </div>
          <div className="flex items-center justify-between text-zinc-400">
            <span>Context Switch Interrupts</span>
            <span className="font-bold text-emerald-400">{telemetry.interruptedSessions}</span>
          </div>
        </div>
      </div>
    </WidgetContainer>
  );
}
