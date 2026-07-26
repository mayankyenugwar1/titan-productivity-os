import { useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { TitanButton } from "@/components/ui";
import { PROMPT_TEMPLATES } from "@/services/ai/promptService";

interface AIComposerProps {
  onSend: (prompt: string) => void;
  loading: boolean;
}

export default function AIComposer({ onSend, loading }: AIComposerProps) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || loading) return;
    onSend(text.trim());
    setText("");
  };

  const handleTemplateClick = (templateText: string) => {
    onSend(templateText);
  };

  return (
    <div className="space-y-3 font-mono">
      {/* Quick Action Prompt Chips */}
      <div className="flex flex-wrap gap-2 text-xs">
        {PROMPT_TEMPLATES.map((tmpl) => (
          <button
            key={tmpl.id}
            onClick={() => handleTemplateClick(tmpl.templateText)}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-[#0c0c0f] px-3 py-1.5 font-bold text-zinc-300 hover:border-[#d4af37]/40 hover:text-white transition disabled:opacity-50"
          >
            <Sparkles className="size-3 text-[#e5c158]" />
            <span>{tmpl.name}</span>
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Ask AI Commander (e.g., 'Plan my day' or 'Summarize productivity')..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={loading}
          className="flex-1 rounded-2xl border border-zinc-800 bg-[#0c0c0f] px-4 py-3 text-xs text-white placeholder-zinc-500 focus:border-[#d4af37] focus:outline-none disabled:opacity-50"
        />

        <TitanButton
          size="md"
          type="submit"
          loading={loading}
          leftIcon={<Send className="size-4" />}
        >
          SEND
        </TitanButton>
      </form>
    </div>
  );
}
