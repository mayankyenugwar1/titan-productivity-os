import { Activity, Brain, CheckCircle2, Lightbulb } from "lucide-react";
import type { MemoryItem } from "@/services/ai/memoryService";

interface MemoryTimelineProps {
  memory: MemoryItem[];
}

export default function MemoryTimeline({ memory }: MemoryTimelineProps) {
  return (
    <div className="rounded-3xl border border-zinc-800/80 bg-[#070709] p-6 shadow-2xl shadow-black font-mono space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Brain className="size-4 text-[#e5c158]" />
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#e5c158]">
            AI SESSION MEMORY OVERVIEW
          </span>
        </div>
      </div>

      <div className="space-y-3 text-xs">
        {memory.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 rounded-2xl border border-zinc-800/80 bg-[#0c0c0f] p-3.5"
          >
            {item.type === "ACTION_EXECUTED" ? (
              <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : item.type === "INSIGHT_STORED" ? (
              <Lightbulb className="size-4 text-[#e5c158] shrink-0 mt-0.5" />
            ) : (
              <Activity className="size-4 text-sky-400 shrink-0 mt-0.5" />
            )}

            <div className="space-y-0.5">
              <div className="flex items-center justify-between text-xs">
                <h5 className="font-sans font-bold text-white text-xs">{item.title}</h5>
                <span className="text-[10px] text-zinc-500 font-bold">{item.timestamp}</span>
              </div>
              <p className="font-sans text-xs text-zinc-400">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
