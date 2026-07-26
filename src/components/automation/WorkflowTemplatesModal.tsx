import { AnimatePresence, motion } from "framer-motion";
import { LayoutTemplate, Plus, X, Zap } from "lucide-react";
import { WORKFLOW_TEMPLATES, type WorkflowTemplate } from "@/services/automation/templateService";
import { TitanBadge } from "@/components/ui";
import { dialogEntrance } from "@/animations/motionSystem";

interface WorkflowTemplatesModalProps {
  open: boolean;
  onClose: () => void;
  onSelectTemplate: (template: WorkflowTemplate) => void;
}

export default function WorkflowTemplatesModal({ open, onClose, onSelectTemplate }: WorkflowTemplatesModalProps) {
  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xl font-mono">
        <motion.div
          variants={dialogEntrance}
          initial="initial"
          animate="animate"
          exit="exit"
          className="relative w-full max-w-2xl rounded-3xl border border-[#d4af37]/40 bg-[#0d0d10] p-6.5 shadow-2xl shadow-black space-y-6"
        >
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl border border-[#d4af37]/30 bg-[#d4af37]/10 text-[#e5c158]">
                <LayoutTemplate className="size-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#e5c158]">
                  WORKFLOW TEMPLATE GALLERY
                </span>
                <h3 className="text-lg font-bold text-white font-sans">
                  Instantiate Pre-Built Automation Protocol
                </h3>
              </div>
            </div>

            <button onClick={onClose} className="rounded-xl p-2 text-zinc-500 hover:text-white">
              <X className="size-5" />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 text-xs font-mono">
            {WORKFLOW_TEMPLATES.map((tmpl) => (
              <div
                key={tmpl.id}
                onClick={() => {
                  onSelectTemplate(tmpl);
                  onClose();
                }}
                className="group rounded-2xl border border-zinc-800/80 bg-[#070709] p-4.5 space-y-2 cursor-pointer transition duration-300 hover:border-[#d4af37]/40 hover:bg-[#111116]"
              >
                <div className="flex items-center justify-between">
                  <TitanBadge variant="gold" size="sm">
                    {tmpl.category}
                  </TitanBadge>
                  <Plus className="size-4 text-[#e5c158] opacity-0 group-hover:opacity-100 transition" />
                </div>

                <h4 className="font-sans font-bold text-sm text-zinc-100">{tmpl.name}</h4>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">{tmpl.description}</p>

                <div className="flex items-center gap-1.5 pt-2 text-[10px] text-sky-400 font-mono">
                  <Zap className="size-3" /> Trigger: {tmpl.workflowData.trigger.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
