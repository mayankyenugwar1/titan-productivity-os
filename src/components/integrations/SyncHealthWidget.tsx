import { Activity, Clock, RefreshCw, ShieldCheck } from "lucide-react";
import type { SyncHealthTelemetry } from "@/services/integrations/syncEngine";
import { TitanButton } from "@/components/ui";

interface SyncHealthWidgetProps {
  telemetry: SyncHealthTelemetry;
  isSyncing: boolean;
  onSyncAll: () => void;
}

export default function SyncHealthWidget({
  telemetry,
  isSyncing,
  onSyncAll,
}: SyncHealthWidgetProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 font-mono text-xs">
      <div className="rounded-2xl border border-[#d4af37]/30 bg-[#d4af37]/10 p-5 space-y-2">
        <div className="flex items-center justify-between text-[#e5c158]">
          <span className="text-xs uppercase tracking-wider font-bold">Sync Health</span>
          <Activity className="size-4" />
        </div>
        <p className="text-2xl font-black text-[#e5c158]">{telemetry.overallHealth}</p>
        <span className="text-[10px] text-zinc-400 font-bold">All integration pipelines nominal</span>
      </div>

      <div className="rounded-2xl border border-zinc-800/80 bg-[#070709] p-5 space-y-2">
        <div className="flex items-center justify-between text-zinc-400">
          <span className="text-xs uppercase tracking-wider font-bold">Connected Integrations</span>
          <ShieldCheck className="size-4 text-emerald-400" />
        </div>
        <p className="text-2xl font-black text-emerald-400">
          {telemetry.connectedCount} / {telemetry.totalProviders}
        </p>
        <span className="text-[10px] text-zinc-500 font-bold">Active authentication tokens</span>
      </div>

      <div className="rounded-2xl border border-zinc-800/80 bg-[#070709] p-5 space-y-2">
        <div className="flex items-center justify-between text-zinc-400">
          <span className="text-xs uppercase tracking-wider font-bold">Last Sync Telemetry</span>
          <Clock className="size-4 text-sky-400" />
        </div>
        <p className="text-lg font-black text-white">{telemetry.lastSyncedAt}</p>
        <span className="text-[10px] text-zinc-500 font-bold">Automatic background loop</span>
      </div>

      <div className="flex items-center justify-center rounded-2xl border border-zinc-800/80 bg-[#070709] p-5">
        <TitanButton
          size="md"
          disabled={isSyncing}
          leftIcon={<RefreshCw className={`size-4 ${isSyncing ? "animate-spin" : ""}`} />}
          onClick={onSyncAll}
          className="w-full justify-center"
        >
          {isSyncing ? "SYNCING WORKSPACE..." : "SYNC ALL PROVIDERS"}
        </TitanButton>
      </div>
    </div>
  );
}
