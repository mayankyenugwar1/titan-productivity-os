import { ArrowDown, CheckCircle2, Play, Sliders, Trash2, Zap } from "lucide-react";
import type { Workflow } from "@/services/automation/workflowService";
import { TitanBadge, TitanButton } from "@/components/ui";

interface WorkflowCanvasProps {
  workflow: Workflow | null;
  onToggleEnabled?: () => void;
  onRunManually?: () => void;
  onDelete?: () => void;
}

export default function WorkflowCanvas({
  workflow,
  onToggleEnabled,
  onRunManually,
  onDelete,
}: WorkflowCanvasProps) {
  if (!workflow) {
    return (
      <div className="flex h-96 items-center justify-center rounded-3xl border border-zinc-800/80 bg-[#070709] p-8 text-center text-zinc-500 font-mono text-xs">
        No workflow selected. Select a workflow from the left sidebar or instantiate a template.
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-zinc-800/80 bg-[#070709] p-6.5 shadow-2xl shadow-black font-mono space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#e5c158]">
            VISUAL WORKFLOW CANVAS BUILDER
          </span>
          <h3 className="text-lg font-bold text-white font-sans">{workflow.name}</h3>
        </div>

        <div className="flex items-center gap-2">
          <TitanBadge variant={workflow.enabled ? "gold" : "zinc"} size="sm">
            {workflow.enabled ? "LIVE ENGINE" : "PAUSED ENGINE"}
          </TitanBadge>

          {onRunManually && (
            <TitanButton
              size="sm"
              variant="secondary"
              leftIcon={<Play className="size-3.5 text-emerald-400" />}
              onClick={onRunManually}
            >
              RUN NOW
            </TitanButton>
          )}

          {onToggleEnabled && (
            <TitanButton size="sm" variant="outline" onClick={onToggleEnabled}>
              {workflow.enabled ? "PAUSE" : "ACTIVATE"}
            </TitanButton>
          )}

          {onDelete && (
            <TitanButton size="sm" variant="danger" leftIcon={<Trash2 className="size-3.5" />} onClick={onDelete}>
              DELETE
            </TitanButton>
          )}
        </div>
      </div>

      {/* Visual Node Flow */}
      <div className="space-y-4 max-w-xl mx-auto py-4">
        {/* Node 1: Trigger Node */}
        <div className="rounded-2xl border border-[#d4af37]/40 bg-[#0d0d10] p-4.5 space-y-2 shadow-xl shadow-black">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#e5c158] flex items-center gap-1.5">
              <Zap className="size-4" /> TRIGGER EVENT NODE
            </span>
            <TitanBadge variant="gold" size="sm">
              INPUT
            </TitanBadge>
          </div>
          <p className="font-sans font-bold text-sm text-white">{workflow.trigger.label}</p>
          <p className="text-[11px] text-zinc-400 font-mono">Event Type: {workflow.trigger.eventType}</p>
        </div>

        {/* Connector Arrow */}
        <div className="flex justify-center text-[#e5c158]">
          <ArrowDown className="size-5 animate-bounce" />
        </div>

        {/* Node 2: Condition Node */}
        {workflow.conditions && workflow.conditions.length > 0 && (
          <>
            <div className="rounded-2xl border border-sky-400/40 bg-[#0c0c14] p-4.5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-sky-400 flex items-center gap-1.5">
                  <Sliders className="size-4" /> CONDITION EVALUATOR NODE
                </span>
                <TitanBadge variant="zinc" size="sm">
                  LOGIC GATE
                </TitanBadge>
              </div>

              {workflow.conditions.map((cond, idx) => (
                <div key={idx} className="font-sans text-xs text-zinc-300">
                  <span className="font-mono text-sky-300 font-bold">{cond.field}</span> {cond.operator} "{cond.value}"
                </div>
              ))}
            </div>

            <div className="flex justify-center text-sky-400">
              <ArrowDown className="size-5" />
            </div>
          </>
        )}

        {/* Node 3: Action Nodes */}
        <div className="space-y-3">
          {workflow.actions.map((act, idx) => (
            <div key={idx} className="rounded-2xl border border-emerald-500/40 bg-[#09120c] p-4.5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="size-4" /> ACTION EXECUTION NODE #{idx + 1}
                </span>
                <TitanBadge variant="green" size="sm">
                  OUTPUT
                </TitanBadge>
              </div>
              <p className="font-sans font-bold text-sm text-white">{act.label}</p>
              <p className="text-[11px] text-zinc-400 font-mono">Action Type: {act.actionType}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
