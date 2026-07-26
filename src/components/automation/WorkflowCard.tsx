import { Activity, Play, Power, Trash2, Zap } from "lucide-react";
import type { Workflow } from "@/services/automation/workflowService";
import { TitanBadge } from "@/components/ui";

interface WorkflowCardProps {
  workflow: Workflow;
  isActive: boolean;
  onSelect: () => void;
  onToggle: () => void;
  onRunManually: () => void;
  onDelete: () => void;
}

export default function WorkflowCard({
  workflow,
  isActive,
  onSelect,
  onToggle,
  onRunManually,
  onDelete,
}: WorkflowCardProps) {
  return (
    <div
      onClick={onSelect}
      className={`group rounded-2xl border p-4 space-y-3 cursor-pointer transition duration-300 ${
        isActive
          ? "border-[#d4af37]/40 bg-[#d4af37]/10 shadow-xl shadow-black font-mono"
          : "border-zinc-800/80 bg-[#0c0c0f] hover:border-zinc-700 font-mono"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="size-4 text-[#e5c158]" />
          <TitanBadge variant={workflow.enabled ? "gold" : "zinc"} size="sm">
            {workflow.enabled ? "ACTIVE" : "PAUSED"}
          </TitanBadge>
        </div>

        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            className={`p-1.5 rounded-xl border transition ${
              workflow.enabled
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                : "border-zinc-800 text-zinc-500"
            }`}
            title="Toggle Workflow Active Status"
          >
            <Power className="size-3.5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onRunManually();
            }}
            className="p-1.5 rounded-xl border border-[#d4af37]/40 bg-[#d4af37]/10 text-[#e5c158] hover:bg-[#d4af37] hover:text-zinc-950 transition"
            title="Trigger Manual Execution"
          >
            <Play className="size-3.5 fill-current" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1.5 rounded-xl text-zinc-500 hover:text-red-400"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </div>

      <h4 className="font-sans font-bold text-sm text-zinc-100">{workflow.name}</h4>
      <p className="text-xs text-zinc-400 font-sans line-clamp-2">{workflow.description}</p>

      <div className="flex items-center justify-between border-t border-zinc-800/60 pt-2 text-[10px] text-zinc-400">
        <span className="flex items-center gap-1 font-mono">
          <Activity className="size-3 text-sky-400" /> {workflow.runCount} Executions
        </span>
        <span className="font-mono text-zinc-500">
          {workflow.lastRunAt ? new Date(workflow.lastRunAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Never run"}
        </span>
      </div>
    </div>
  );
}
