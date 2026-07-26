import { useState } from "react";
import { Sparkles, Zap } from "lucide-react";
import { TitanButton } from "@/components/ui";

interface AIWorkflowGeneratorBarProps {
  onGenerate: (prompt: string) => void;
}

export default function AIWorkflowGeneratorBar({ onGenerate }: AIWorkflowGeneratorBarProps) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onGenerate(prompt.trim());
    setPrompt("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap items-center gap-3 rounded-3xl border border-[#d4af37]/40 bg-[#0d0d10] p-5 shadow-2xl shadow-black font-mono text-xs"
    >
      <div className="flex items-center gap-2 text-[#e5c158] font-bold shrink-0">
        <Sparkles className="size-4" />
        <span>AI WORKFLOW GENERATOR:</span>
      </div>

      <input
        type="text"
        placeholder="Describe workflow naturally (e.g., 'When I complete a mission, award XP and generate a summary note')"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="flex-1 min-w-[280px] rounded-2xl border border-zinc-800 bg-[#070709] px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-[#d4af37] focus:outline-none"
      />

      <TitanButton
        size="sm"
        type="submit"
        disabled={!prompt.trim()}
        leftIcon={<Zap className="size-3.5" />}
      >
        GENERATE WORKFLOW
      </TitanButton>
    </form>
  );
}
