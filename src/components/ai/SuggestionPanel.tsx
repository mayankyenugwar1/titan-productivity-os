import { Lightbulb } from "lucide-react";
import type { AISmartSuggestion } from "@/services/ai/reasoningService";
import { TitanBadge } from "@/components/ui";

interface SuggestionPanelProps {
  suggestions: AISmartSuggestion[];
  onSelectSuggestion: (prompt: string) => void;
}

export default function SuggestionPanel({ suggestions, onSelectSuggestion }: SuggestionPanelProps) {
  if (suggestions.length === 0) return null;

  return (
    <div className="rounded-3xl border border-zinc-800/80 bg-[#070709] p-6 shadow-2xl shadow-black font-mono space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="size-4 text-[#e5c158]" />
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#e5c158]">
            AI REASONING & SMART SUGGESTIONS
          </span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {suggestions.map((sug) => (
          <div
            key={sug.id}
            onClick={() => onSelectSuggestion(sug.suggestedPrompt)}
            className="cursor-pointer rounded-2xl border border-zinc-800/80 bg-[#0c0c0f] p-4 space-y-2 transition duration-200 hover:border-[#d4af37]/50 hover:bg-[#111116]"
          >
            <div className="flex items-center justify-between">
              <TitanBadge variant={sug.type === "WARNING" ? "red" : "gold"} size="sm">
                {sug.category}
              </TitanBadge>
              <span className="text-[10px] text-zinc-500 font-bold uppercase">{sug.type}</span>
            </div>

            <h5 className="font-sans font-bold text-xs text-white">{sug.title}</h5>
            <p className="font-sans text-xs text-zinc-400 leading-relaxed">{sug.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
