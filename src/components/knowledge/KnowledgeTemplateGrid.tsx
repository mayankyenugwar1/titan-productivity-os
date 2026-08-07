import { LayoutTemplate, Plus } from "lucide-react";
import { safeDateString } from "@/utils/safeDate";
import { TitanBadge, TitanButton } from "@/components/ui";

export interface KnowledgeTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  initialContent: string;
}

export const KNOWLEDGE_TEMPLATES: KnowledgeTemplate[] = [
  {
    id: "kt-1",
    name: "Executive Meeting Notes",
    category: "Operations",
    description: "Template for capturing agenda, action items, owner assignments, and key decisions.",
    initialContent: `# Executive Meeting Notes\n\n**Date:** ${safeDateString(new Date())}\n**Attendees:** Operator, Team\n\n## Agenda\n1. Strategic Objectives\n2. Blockers & Risks\n\n## Action Items\n- [ ] Task 1\n- [ ] Task 2`,
  },
  {
    id: "kt-2",
    name: "Research Vault Synthesis",
    category: "Research",
    description: "Deep dive research template with methodology, sources, hypotheses, and findings.",
    initialContent: `# Research Synthesis\n\n## Topic Overview\nProvide high-level research summary.\n\n## Key Hypotheses\n- Hypothesis 1\n- Hypothesis 2\n\n## Findings & Data\nDetailed analysis details here.`,
  },
  {
    id: "kt-3",
    name: "Project Architecture Specs",
    category: "Document",
    description: "Technical specification document for system architecture and API design.",
    initialContent: `# Architecture Spec\n\n## System Architecture\n- Overview\n- Layered Diagram\n\n## Database Schema\n- Tables\n- Constraints`,
  },
];

interface KnowledgeTemplateGridProps {
  onUseTemplate: (template: KnowledgeTemplate) => void;
}

export default function KnowledgeTemplateGrid({ onUseTemplate }: KnowledgeTemplateGridProps) {
  return (
    <div className="rounded-3xl border border-zinc-800/80 bg-[#070709] p-6 shadow-2xl shadow-black font-mono space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2">
          <LayoutTemplate className="size-4 text-[#e5c158]" />
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#e5c158]">
            KNOWLEDGE VAULT TEMPLATE MARKETPLACE
          </span>
        </div>
        <TitanBadge variant="gold" size="sm">
          {KNOWLEDGE_TEMPLATES.length} TEMPLATES
        </TitanBadge>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {KNOWLEDGE_TEMPLATES.map((tmpl) => (
          <div
            key={tmpl.id}
            className="flex flex-col justify-between rounded-2xl border border-zinc-800/80 bg-[#0c0c0f] p-4.5 space-y-3"
          >
            <div>
              <div className="flex items-center justify-between text-xs">
                <TitanBadge variant="zinc" size="sm">
                  {tmpl.category}
                </TitanBadge>
              </div>
              <h5 className="mt-2 font-sans font-bold text-sm text-white">{tmpl.name}</h5>
              <p className="mt-1 font-sans text-xs text-zinc-400 leading-relaxed">{tmpl.description}</p>
            </div>

            <div className="pt-2 border-t border-zinc-800/80">
              <TitanButton
                size="sm"
                variant="outline"
                className="w-full justify-center"
                leftIcon={<Plus className="size-3.5" />}
                onClick={() => onUseTemplate(tmpl)}
              >
                INSTANTIATE NOTE
              </TitanButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
