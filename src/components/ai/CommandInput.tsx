import { useState } from "react";
import { Send, Trash2 } from "lucide-react";
import { TitanButton } from "@/components/ui";

interface CommandInputProps {
  onSend: (prompt: string) => void;
  onClear: () => void;
  loading?: boolean;
  isThinking?: boolean;
}

export default function CommandInput({ onSend, onClear, loading, isThinking }: CommandInputProps) {
  const [prompt, setPrompt] = useState("");
  const disabled = Boolean(loading || isThinking);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || disabled) return;
    onSend(prompt.trim());
    setPrompt("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3 font-mono">
      <input
        type="text"
        placeholder="Issue AI Agent command or ask a question... (e.g. 'Plan my day' or 'Create workout mission')"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        disabled={disabled}
        className="flex-1 rounded-2xl border border-zinc-800 bg-[#070709] px-4 py-3 text-xs text-white placeholder-zinc-500 focus:border-[#d4af37] focus:outline-none"
      />

      <TitanButton size="sm" type="submit" disabled={disabled || !prompt.trim()} leftIcon={<Send className="size-3.5" />}>
        EXECUTE
      </TitanButton>

      <TitanButton size="sm" variant="outline" type="button" onClick={onClear} leftIcon={<Trash2 className="size-3.5" />}>
        CLEAR
      </TitanButton>
    </form>
  );
}
