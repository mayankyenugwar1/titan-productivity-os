import { BookOpen, Calendar, CheckSquare, FolderPlus, Sparkles, Target, Zap } from "lucide-react";

interface QuickCommandGridProps {
  onExecute?: (commandPrompt: string) => void;
  onSelectPrompt?: (prompt: string) => void;
  onSelectCommand?: (prompt: string) => void;
}

export default function QuickCommandGrid({ onExecute, onSelectPrompt, onSelectCommand }: QuickCommandGridProps) {
  const handler = onExecute || onSelectPrompt || onSelectCommand || (() => {});

  const commands = [
    { label: "PLAN TODAY", icon: Calendar, prompt: "Plan my day and generate optimized time blocks" },
    { label: "WEEKLY REVIEW", icon: CheckSquare, prompt: "Generate a comprehensive weekly review of my progress and XP" },
    { label: "CREATE MISSION", icon: Target, prompt: "Create a new high priority tactical operation" },
    { label: "OPTIMIZE CALENDAR", icon: Calendar, prompt: "Move overdue missions and optimize my calendar schedule" },
    { label: "CREATE PROJECT", icon: FolderPlus, prompt: "Create project roadmap for strategic execution" },
    { label: "SUMMARIZE NOTES", icon: BookOpen, prompt: "Generate note summarizing key insights in Knowledge Vault" },
    { label: "TRIGGER WORKFLOW", icon: Zap, prompt: "Trigger workflow automation across Event Bus" },
    { label: "ANALYZE PROGRESS", icon: Sparkles, prompt: "Analyze productivity telemetry and focus score" },
  ];

  return (
    <div className="rounded-3xl border border-zinc-800/80 bg-[#070709] p-6 shadow-2xl shadow-black font-mono space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-[#e5c158]" />
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#e5c158]">
            AI AGENT QUICK COMMANDS
          </span>
        </div>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {commands.map((cmd) => {
          const IconComp = cmd.icon;
          return (
            <button
              key={cmd.label}
              onClick={() => handler(cmd.prompt)}
              className="flex items-center gap-2.5 rounded-2xl border border-zinc-800/80 bg-[#0c0c0f] p-3 text-left transition duration-200 hover:border-[#d4af37]/40 hover:bg-[#111116]"
            >
              <div className="flex size-7 shrink-0 items-center justify-center rounded-xl border border-[#d4af37]/30 bg-[#d4af37]/10 text-[#e5c158]">
                <IconComp className="size-3.5" />
              </div>
              <span className="text-xs font-bold text-zinc-200">{cmd.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
