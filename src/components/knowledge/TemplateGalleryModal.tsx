import { AnimatePresence, motion } from "framer-motion";
import { LayoutTemplate, Plus, X } from "lucide-react";
import { KNOWLEDGE_TEMPLATES, type KnowledgeTemplate } from "@/services/knowledge/templateService";
import { TitanBadge } from "@/components/ui";
import { dialogEntrance } from "@/animations/motionSystem";

interface TemplateGalleryModalProps {
  open: boolean;
  onClose: () => void;
  onSelectTemplate: (template: KnowledgeTemplate) => void;
}

export default function TemplateGalleryModal({ open, onClose, onSelectTemplate }: TemplateGalleryModalProps) {
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
                  KNOWLEDGE TEMPLATE GALLERY
                </span>
                <h3 className="text-lg font-bold text-white font-sans">
                  Select Pre-Configured Directive Template
                </h3>
              </div>
            </div>

            <button onClick={onClose} className="rounded-xl p-2 text-zinc-500 hover:text-white">
              <X className="size-5" />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 text-xs font-mono">
            {KNOWLEDGE_TEMPLATES.map((tmpl) => (
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
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
