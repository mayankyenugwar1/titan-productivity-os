import { AlertTriangle, ShieldAlert } from "lucide-react";
import type { SchedulingConflict } from "@/services/time/conflictService";

interface ConflictBannerProps {
  conflicts: SchedulingConflict[];
  onDismiss?: () => void;
}

export default function ConflictBanner({ conflicts }: ConflictBannerProps) {
  if (conflicts.length === 0) return null;

  return (
    <div className="rounded-3xl border border-red-500/40 bg-gradient-to-r from-red-500/15 via-[#0d0d10] to-[#09090b] p-5 shadow-2xl shadow-black font-mono space-y-3">
      <div className="flex items-center justify-between border-b border-red-500/30 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl border border-red-500/40 bg-red-500/20 text-red-400">
            <ShieldAlert className="size-5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-red-400">
              CONFLICT DETECTION WARNING
            </span>
            <h3 className="text-sm font-bold text-white font-sans">
              {conflicts.length} Overlapping Schedule Directives Detected
            </h3>
          </div>
        </div>
      </div>

      <div className="space-y-2 text-xs">
        {conflicts.map((c) => (
          <div key={c.id} className="flex items-start gap-2 text-red-300 font-sans">
            <AlertTriangle className="size-4 shrink-0 text-red-400 mt-0.5" />
            <span>{c.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
