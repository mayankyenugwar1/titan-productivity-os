import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Command, Sparkles, Zap } from "lucide-react";
import { TitanBadge, TitanButton } from "@/components/ui";
import { loadDemoWorkspaceData } from "@/services/demo/demoWorkspaceService";

interface OnboardingModalProps {
  open: boolean;
  onClose: () => void;
}

export default function OnboardingModal({ open, onClose }: OnboardingModalProps) {
  const [demoLoaded, setDemoLoaded] = useState(false);

  if (!open) return null;

  const handleLoadDemo = () => {
    loadDemoWorkspaceData("local_user");
    setDemoLoaded(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-xl font-mono text-zinc-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative max-w-xl w-full rounded-3xl border border-[#d4af37]/50 bg-[#0d0d10] p-7 shadow-2xl shadow-black space-y-6"
        >
          {/* Header Badge */}
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="size-5 text-[#e5c158]" />
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#e5c158]">
                WELCOME TO TITAN V1.0
              </span>
            </div>
            <TitanBadge variant="gold" size="sm">
              RELEASE EDITION
            </TitanBadge>
          </div>

          {/* Body Content */}
          <div className="space-y-3 font-sans">
            <h3 className="text-xl font-bold text-white">Autonomous Productivity Operating System</h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              TITAN unifies Mission Control, Time OS, Knowledge Second Brain, Projects & OKRs, Universal Automations, and an AI Commander into one executive workspace.
            </p>
          </div>

          {/* Quick Shortcuts & Features */}
          <div className="grid gap-3 sm:grid-cols-2 text-xs font-mono">
            <div className="rounded-2xl border border-zinc-800 bg-[#070709] p-3.5 space-y-1">
              <span className="flex items-center gap-1.5 text-[#e5c158] font-bold">
                <Command className="size-4" /> Global Command Palette
              </span>
              <p className="text-zinc-400 text-[11px] font-sans">Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-white">Ctrl+K</kbd> anywhere to search & execute commands.</p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-[#070709] p-3.5 space-y-1">
              <span className="flex items-center gap-1.5 text-[#e5c158] font-bold">
                <Bot className="size-4" /> AI Agent Commander
              </span>
              <p className="text-zinc-400 text-[11px] font-sans">AI Agent executes actions across all 13 workspace modules.</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800/80 pt-4">
            <TitanButton
              size="md"
              leftIcon={<Zap className="size-4" />}
              onClick={handleLoadDemo}
            >
              {demoLoaded ? "DEMO DATA LOADED!" : "LOAD DEMO WORKSPACE"}
            </TitanButton>

            <TitanButton
              size="md"
              variant="outline"
              onClick={onClose}
            >
              ENTER BLANK WORKSPACE
            </TitanButton>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
