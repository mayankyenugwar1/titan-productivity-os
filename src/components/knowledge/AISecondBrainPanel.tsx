import { useMemo } from "react";
import type { KnowledgeItem } from "@/services/knowledge/knowledgeService";
import { generateAINoteSummary } from "@/services/knowledge/knowledgeIntelligenceService";
import { TitanBadge } from "@/components/ui";
import { Brain, HelpCircle, Lightbulb, Sparkles } from "lucide-react";

interface AISecondBrainPanelProps {
  note: KnowledgeItem | null;
}

export default function AISecondBrainPanel({ note }: AISecondBrainPanelProps) {
  const summaryResult = useMemo(() => {
    if (!note) return null;
    return generateAINoteSummary(note);
  }, [note]);

  if (!note || !summaryResult) {
    return (
      <div className="rounded-3xl border border-zinc-800/80 bg-[#070709] p-8 text-center text-zinc-500 font-mono text-xs space-y-2">
        <Brain className="mx-auto size-10 text-zinc-700" />
        <p className="text-sm font-bold text-zinc-400">AI Second Brain Assistant Standby</p>
        <p className="text-xs">Select a note to generate AI summaries, key points, and flashcards.</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-[#d4af37]/40 bg-[#0d0d10] p-6 shadow-2xl shadow-black font-mono space-y-4 text-xs">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-[#e5c158]" />
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#e5c158]">
            AI SECOND BRAIN INTELLIGENCE
          </span>
        </div>
        <TitanBadge variant="gold" size="sm">
          ANALYZED
        </TitanBadge>
      </div>

      <div className="space-y-3">
        <h4 className="font-sans font-bold text-sm text-white">Summary of "{note.title}"</h4>
        <p className="font-sans text-xs text-zinc-300 leading-relaxed">{summaryResult.shortSummary}</p>

        {/* Key Points */}
        <div className="space-y-1.5 pt-2 border-t border-zinc-800/80">
          <span className="text-[10px] font-bold uppercase text-[#e5c158] tracking-wider flex items-center gap-1">
            <Lightbulb className="size-3" /> KEY INSIGHTS & TAKEAWAYS
          </span>
          <ul className="space-y-1 text-zinc-300 font-sans">
            {summaryResult.keyPoints.map((pt, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-[#e5c158]">•</span>
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Generated Flashcards */}
        {summaryResult.generatedFlashcards.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-zinc-800/80">
            <span className="text-[10px] font-bold uppercase text-sky-400 tracking-wider flex items-center gap-1">
              <HelpCircle className="size-3" /> AI GENERATED RECALL FLASHCARD
            </span>
            <div className="rounded-2xl border border-zinc-800 bg-[#070709] p-3 space-y-1 font-sans">
              <p className="font-bold text-white text-xs">Q: {summaryResult.generatedFlashcards[0].question}</p>
              <p className="text-zinc-400 text-xs">A: {summaryResult.generatedFlashcards[0].answer}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
