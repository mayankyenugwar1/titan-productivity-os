import { CheckCircle2, History, XCircle } from "lucide-react";
import type { ExecutionRecord } from "@/store/automationStore";
import { TitanBadge } from "@/components/ui";

interface ExecutionLogTableProps {
  history: ExecutionRecord[];
}

export default function ExecutionLogTable({ history }: ExecutionLogTableProps) {
  return (
    <div className="rounded-3xl border border-zinc-800/80 bg-[#070709] p-6 shadow-2xl shadow-black font-mono space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2">
          <History className="size-4 text-[#e5c158]" />
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#e5c158]">
            WORKFLOW EXECUTION AUDIT HISTORY
          </span>
        </div>
        <TitanBadge variant="gold" size="sm">
          {history.length} RUNS
        </TitanBadge>
      </div>

      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 text-xs">
        {history.map((record) => (
          <div
            key={record.id}
            className="flex items-center justify-between rounded-2xl border border-zinc-800/80 bg-[#0c0c0f] p-3.5"
          >
            <div className="flex items-center gap-3">
              {record.status === "SUCCESS" ? (
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="size-4 text-red-400 shrink-0" />
              )}
              <div>
                <h5 className="font-sans font-bold text-white text-xs">{record.workflowName}</h5>
                <p className="text-[10px] text-zinc-400 font-mono">
                  {record.logs ? record.logs.join(" • ") : "Executed successfully"}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] text-[#e5c158] font-bold">{record.durationMs} ms</span>
              <p className="text-[10px] text-zinc-500 font-bold">{new Date(record.timestamp).toLocaleTimeString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
