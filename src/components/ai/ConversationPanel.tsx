import { Bot, CheckCircle2, User, XCircle, Zap } from "lucide-react";
import type { AIMessageItem } from "@/store/aiStore";
import type { ExecutionProposal } from "@/services/ai/executionService";
import { TitanBadge, TitanButton } from "@/components/ui";

interface ConversationPanelProps {
  messages: AIMessageItem[];
  proposals?: ExecutionProposal[];
  isThinking: boolean;
  isStreaming?: boolean;
  onConfirmProposal: (proposalId: string) => void;
  onRejectProposal: (proposalId: string) => void;
}

export default function ConversationPanel({
  messages,
  isThinking,
  onConfirmProposal,
  onRejectProposal,
}: ConversationPanelProps) {
  return (
    <div className="flex flex-col h-[520px] rounded-3xl border border-zinc-800/80 bg-[#070709] p-6 shadow-2xl shadow-black font-mono space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <Bot className="size-4 text-[#e5c158]" />
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#e5c158]">
            AI COMMANDER INTERACTIVE STREAM
          </span>
        </div>
        <TitanBadge variant="gold" size="sm">
          READY
        </TitanBadge>
      </div>

      {/* Stream messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-zinc-500 font-sans space-y-2">
            <Bot className="size-10 text-zinc-700" />
            <p className="text-sm font-bold text-zinc-400">AI Commander Standby</p>
            <p className="text-xs max-w-xs">
              Type a prompt or click a quick command to execute AI intelligence directives across TITAN.
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "assistant" && (
                <div className="flex size-8 shrink-0 items-center justify-center rounded-xl border border-[#d4af37]/40 bg-[#d4af37]/10 text-[#e5c158]">
                  <Bot className="size-4" />
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-2xl p-4 space-y-2 ${
                  msg.sender === "user"
                    ? "bg-[#d4af37] text-zinc-950 font-bold"
                    : "border border-zinc-800/80 bg-[#0c0c0f] text-zinc-100"
                }`}
              >
                <div className="flex items-center justify-between text-[10px] opacity-70 border-b border-white/10 pb-1">
                  <span>{msg.sender === "user" ? "OPERATOR DIRECTIVE" : "TITAN INTELLIGENCE"}</span>
                  <span>{msg.timestamp}</span>
                </div>

                <p className="font-sans text-xs leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                {/* Proposal Execution Gate */}
                {msg.proposal && (
                  <div className="mt-3 rounded-xl border border-[#d4af37]/40 bg-[#070709] p-3.5 space-y-2 text-white font-mono">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-[#e5c158] flex items-center gap-1">
                        <Zap className="size-3" /> {msg.proposal.title}
                      </span>
                      <TitanBadge variant={msg.proposal.status === "EXECUTED" ? "green" : "gold"} size="sm">
                        {msg.proposal.status}
                      </TitanBadge>
                    </div>

                    <p className="font-sans text-xs text-zinc-300">{msg.proposal.description}</p>

                    {msg.proposal.status === "PENDING" && (
                      <div className="flex gap-2 pt-1">
                        <TitanButton
                          size="sm"
                          leftIcon={<CheckCircle2 className="size-3.5" />}
                          onClick={() => onConfirmProposal(msg.proposal!.id)}
                        >
                          CONFIRM & EXECUTE
                        </TitanButton>

                        <TitanButton
                          size="sm"
                          variant="danger"
                          leftIcon={<XCircle className="size-3.5" />}
                          onClick={() => onRejectProposal(msg.proposal!.id)}
                        >
                          REJECT
                        </TitanButton>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {msg.sender === "user" && (
                <div className="flex size-8 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400">
                  <User className="size-4" />
                </div>
              )}
            </div>
          ))
        )}

        {isThinking && (
          <div className="flex items-center gap-2 text-xs text-[#e5c158] font-bold py-2 animate-pulse">
            <Bot className="size-4 animate-spin" /> Reasoning workspace state...
          </div>
        )}
      </div>
    </div>
  );
}
