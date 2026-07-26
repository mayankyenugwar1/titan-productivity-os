import { CheckCircle2, History, XCircle } from "lucide-react";
import type { SyncLogEntry } from "@/services/integrations/syncEngine";
import { TitanBadge } from "@/components/ui";

interface SyncHistoryPanelProps {
  logs: SyncLogEntry[];
}

export default function SyncHistoryPanel({ logs }: SyncHistoryPanelProps) {
  return (
    <div className="rounded-3xl border border-zinc-800/80 bg-[#070709] p-6 shadow-2xl shadow-black font-mono space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2">
          <History className="size-4 text-[#e5c158]" />
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#e5c158]">
            SYNC ENGINE AUDIT LOG TRAIL
          </span>
        </div>
        <TitanBadge variant="gold" size="sm">
          {logs.length} ENTRIES
        </TitanBadge>
      </div>

      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 text-xs">
        {logs.map((log) => (
          <div
            key={log.id}
            className="flex items-center justify-between rounded-2xl border border-zinc-800/80 bg-[#0c0c0f] p-3.5"
          >
            <div className="flex items-center gap-3">
              {log.status === "SUCCESS" ? (
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="size-4 text-red-400 shrink-0" />
              )}
              <div>
                <span className="font-bold text-[#e5c158] font-sans">{log.providerName}</span>
                <p className="text-[11px] text-zinc-300 font-sans">{log.message}</p>
              </div>
            </div>

            <span className="text-[10px] text-zinc-500 font-bold shrink-0">{log.timestamp}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
