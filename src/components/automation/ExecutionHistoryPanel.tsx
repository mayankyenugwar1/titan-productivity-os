import { Activity, CheckCircle2, Terminal, XCircle } from "lucide-react";
import type { ExecutionRecord } from "@/services/automation/workflowService";
import { TitanBadge } from "@/components/ui";

interface ExecutionHistoryPanelProps {
  history: ExecutionRecord[];
}

export default function ExecutionHistoryPanel({ history }: ExecutionHistoryPanelProps) {
  return (
    <div className="rounded-3xl border border-zinc-800/80 bg-[#070709] p-6 shadow-2xl shadow-black font-mono space-y-4 text-xs">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="size-4 text-[#e5c158]" />
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#e5c158]">
            WORKFLOW EXECUTION AUDIT LOGS
          </span>
        </div>
        <TitanBadge variant="gold" size="sm">
          {history.length} EXECUTION RECORDS
        </TitanBadge>
      </div>

      <div className="space-y-3">
        {history.length === 0 ? (
          <p className="text-xs text-zinc-500 italic p-4 text-center">No execution audit logs found.</p>
        ) : (
          history.map((rec) => (
            <div key={rec.id} className="rounded-2xl border border-zinc-800/60 bg-[#0c0c0f] p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-zinc-200">
                  {rec.status === "SUCCESS" ? (
                    <CheckCircle2 className="size-4 text-emerald-400" />
                  ) : (
                    <XCircle className="size-4 text-red-400" />
                  )}
                  <span className="font-sans text-sm">{rec.workflowName}</span>
                </div>
                <div className="flex items-center gap-3 font-mono text-[10px] text-zinc-500">
                  <span>{rec.durationMs}ms</span>
                  <span>{new Date(rec.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>

              <div className="space-y-1 rounded-xl bg-[#070709] p-3 text-[11px] font-mono text-zinc-400 border border-zinc-900">
                <div className="flex items-center gap-1.5 text-[#e5c158] font-bold mb-1">
                  <Terminal className="size-3" /> System Dispatch Trace:
                </div>
                {rec.logs.map((log, idx) => (
                  <p key={idx} className="text-zinc-300">
                    &gt; {log}
                  </p>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
