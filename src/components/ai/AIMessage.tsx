import { Bot, User, Zap } from "lucide-react";
import type { AIMessageItem } from "@/store/aiStore";
import { TitanBadge } from "@/components/ui";

interface AIMessageProps {
  message: AIMessageItem;
}

export default function AIMessage({ message }: AIMessageProps) {
  const isAssistant = message.sender === "assistant";

  return (
    <div
      className={`flex items-start gap-3.5 font-mono ${
        isAssistant ? "justify-start" : "justify-end"
      }`}
    >
      {isAssistant && (
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-[#d4af37]/30 bg-[#d4af37]/10 text-[#e5c158]">
          <Bot className="size-5" />
        </div>
      )}

      <div
        className={`max-w-2xl space-y-2 rounded-2xl border p-4.5 text-xs ${
          isAssistant
            ? "border-zinc-800/80 bg-[#0c0c0f] text-zinc-100 shadow-xl shadow-black"
            : "border-[#d4af37]/40 bg-[#d4af37]/10 text-white shadow-xl shadow-black"
        }`}
      >
        <div className="flex items-center justify-between border-b border-zinc-800/60 pb-2">
          <span className="font-bold text-zinc-400">
            {isAssistant ? "AI COMMANDER" : "OPERATOR"}
          </span>
          <span className="text-[10px] text-zinc-500">{message.timestamp}</span>
        </div>

        <p className="font-sans text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>

        {message.intent && message.intent.intent !== "UNKNOWN" && (
          <div className="flex items-center gap-2 pt-2 border-t border-zinc-800/60">
            <Zap className="size-3.5 text-[#e5c158]" />
            <TitanBadge variant="gold" size="sm">
              {message.intent.summaryText}
            </TitanBadge>
          </div>
        )}
      </div>

      {!isAssistant && (
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-[#121217] text-zinc-400">
          <User className="size-5" />
        </div>
      )}
    </div>
  );
}
