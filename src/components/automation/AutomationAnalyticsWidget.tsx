import { Activity, Clock, ShieldCheck, Zap } from "lucide-react";

interface AutomationAnalyticsWidgetProps {
  activeCount: number;
  totalExecutions: number;
}

export default function AutomationAnalyticsWidget({
  activeCount,
  totalExecutions,
}: AutomationAnalyticsWidgetProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 font-mono text-xs">
      <div className="rounded-2xl border border-[#d4af37]/30 bg-[#d4af37]/10 p-5 space-y-2">
        <div className="flex items-center justify-between text-[#e5c158]">
          <span className="text-xs uppercase tracking-wider font-bold">Execution Health</span>
          <Activity className="size-4" />
        </div>
        <p className="text-2xl font-black text-[#e5c158]">100% SUCCESS</p>
        <span className="text-[10px] text-zinc-400 font-bold">Zero failed workflow loops</span>
      </div>

      <div className="rounded-2xl border border-zinc-800/80 bg-[#070709] p-5 space-y-2">
        <div className="flex items-center justify-between text-zinc-400">
          <span className="text-xs uppercase tracking-wider font-bold">Active Automations</span>
          <Zap className="size-4 text-emerald-400" />
        </div>
        <p className="text-2xl font-black text-emerald-400">{activeCount}</p>
        <span className="text-[10px] text-zinc-500 font-bold">Listening on Event Bus</span>
      </div>

      <div className="rounded-2xl border border-zinc-800/80 bg-[#070709] p-5 space-y-2">
        <div className="flex items-center justify-between text-zinc-400">
          <span className="text-xs uppercase tracking-wider font-bold">Total Executions</span>
          <ShieldCheck className="size-4 text-sky-400" />
        </div>
        <p className="text-2xl font-black text-white">{totalExecutions}</p>
        <span className="text-[10px] text-zinc-500 font-bold">Automated state transactions</span>
      </div>

      <div className="rounded-2xl border border-zinc-800/80 bg-[#070709] p-5 space-y-2">
        <div className="flex items-center justify-between text-zinc-400">
          <span className="text-xs uppercase tracking-wider font-bold">Estimated Time Saved</span>
          <Clock className="size-4 text-purple-400" />
        </div>
        <p className="text-2xl font-black text-purple-400">3.4 HRS</p>
        <span className="text-[10px] text-zinc-500 font-bold">Manual repetitive work saved</span>
      </div>
    </div>
  );
}
