import { LayoutTemplate, Plus } from "lucide-react";
import { WORKFLOW_TEMPLATES, type WorkflowTemplate } from "@/services/automation/workflowTemplateService";
import { TitanBadge, TitanButton } from "@/components/ui";

interface TemplateMarketplaceGridProps {
  onUseTemplate: (template: WorkflowTemplate) => void;
}

export default function TemplateMarketplaceGrid({ onUseTemplate }: TemplateMarketplaceGridProps) {
  return (
    <div className="rounded-3xl border border-zinc-800/80 bg-[#070709] p-6 shadow-2xl shadow-black font-mono space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2">
          <LayoutTemplate className="size-4 text-[#e5c158]" />
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#e5c158]">
            WORKFLOW TEMPLATE MARKETPLACE
          </span>
        </div>
        <TitanBadge variant="gold" size="sm">
          {WORKFLOW_TEMPLATES.length} TEMPLATES
        </TitanBadge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {WORKFLOW_TEMPLATES.map((tmpl) => (
          <div
            key={tmpl.id}
            className="flex flex-col justify-between rounded-2xl border border-zinc-800/80 bg-[#0c0c0f] p-4.5 space-y-3"
          >
            <div>
              <div className="flex items-center justify-between text-xs">
                <TitanBadge variant="zinc" size="sm">
                  {tmpl.category}
                </TitanBadge>
                <span className="text-[10px] text-zinc-500 font-bold">{tmpl.trigger}</span>
              </div>
              <h5 className="mt-2 font-sans font-bold text-sm text-white">{tmpl.name}</h5>
              <p className="mt-1 font-sans text-xs text-zinc-400 leading-relaxed">{tmpl.description}</p>
            </div>

            <div className="flex items-center justify-between border-t border-zinc-800/80 pt-3 text-xs">
              <span className="text-[10px] text-zinc-500 font-bold">{tmpl.actionsCount} ACTIONS</span>
              <TitanButton
                size="sm"
                variant="outline"
                leftIcon={<Plus className="size-3.5" />}
                onClick={() => onUseTemplate(tmpl)}
              >
                USE TEMPLATE
              </TitanButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
