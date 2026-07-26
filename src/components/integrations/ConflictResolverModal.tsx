import { AlertTriangle, Check } from "lucide-react";
import type { SyncConflictRecord } from "@/services/integrations/conflictResolverService";
import { TitanBadge, TitanButton } from "@/components/ui";

interface ConflictResolverModalProps {
  conflicts: SyncConflictRecord[];
  onResolve: (id: string, strategy: "CLIENT_WINS" | "REMOTE_WINS" | "MERGE") => void;
}

export default function ConflictResolverModal({ conflicts, onResolve }: ConflictResolverModalProps) {
  if (conflicts.length === 0) return null;

  return (
    <div className="rounded-3xl border border-amber-500/40 bg-amber-950/10 p-6 shadow-2xl shadow-black font-mono space-y-4">
      <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="size-4 text-amber-400" />
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-amber-400">
            SYNC CONFLICT RESOLUTION REQUIRED
          </span>
        </div>
        <TitanBadge variant="red" size="sm">
          {conflicts.length} CONFLICTS
        </TitanBadge>
      </div>

      <div className="space-y-4">
        {conflicts.map((conf) => (
          <div key={conf.id} className="rounded-2xl border border-zinc-800 bg-[#070709] p-4.5 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#e5c158]">{conf.providerName}</span>
              <span className="text-[10px] text-zinc-500">{conf.timestamp}</span>
            </div>

            <h5 className="font-sans font-bold text-sm text-white">Record: "{conf.recordTitle}"</h5>

            <div className="grid gap-3 sm:grid-cols-2 text-xs">
              <div className="rounded-xl border border-zinc-800 bg-[#0c0c0f] p-3 space-y-1">
                <span className="text-[10px] font-bold text-sky-400 uppercase">LOCAL VERSION (TITAN)</span>
                <p className="font-sans text-xs text-white">{conf.localVersion.title}</p>
                <p className="text-[10px] text-zinc-500">Status: {conf.localVersion.status}</p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-[#0c0c0f] p-3 space-y-1">
                <span className="text-[10px] font-bold text-purple-400 uppercase">REMOTE VERSION (PROVIDER)</span>
                <p className="font-sans text-xs text-white">{conf.remoteVersion.title}</p>
                <p className="text-[10px] text-zinc-500">Status: {conf.remoteVersion.status}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-800/80">
              <TitanButton
                size="sm"
                leftIcon={<Check className="size-3.5" />}
                onClick={() => onResolve(conf.id, "CLIENT_WINS")}
              >
                KEEP LOCAL VERSION
              </TitanButton>
              <TitanButton
                size="sm"
                variant="outline"
                onClick={() => onResolve(conf.id, "REMOTE_WINS")}
              >
                APPLY REMOTE VERSION
              </TitanButton>
              <TitanButton
                size="sm"
                variant="secondary"
                onClick={() => onResolve(conf.id, "MERGE")}
              >
                AUTO-MERGE
              </TitanButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
