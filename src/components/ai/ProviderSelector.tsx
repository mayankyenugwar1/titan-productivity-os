import type { ProviderId } from "@/services/ai/providers/AIProvider";
import { TitanBadge } from "@/components/ui";

interface ProviderSelectorProps {
  activeProviderId: ProviderId;
  onProviderChange: (id: ProviderId) => void;
}

export default function ProviderSelector({ activeProviderId, onProviderChange }: ProviderSelectorProps) {
  const providers: { id: ProviderId; name: string }[] = [
    { id: "LOCAL", name: "Local Wayne Core Engine" },
    { id: "OPENAI", name: "OpenAI GPT-4o" },
    { id: "GEMINI", name: "Google Gemini 1.5 Pro" },
    { id: "CLAUDE", name: "Anthropic Claude 3.5 Sonnet" },
  ];

  return (
    <div className="flex items-center gap-3 font-mono text-xs">
      <span className="text-zinc-400 font-bold uppercase tracking-wider hidden sm:inline">Provider:</span>
      <select
        value={activeProviderId}
        onChange={(e) => onProviderChange(e.target.value as ProviderId)}
        className="rounded-xl border border-zinc-800 bg-[#0c0c0f] px-3 py-1.5 text-white focus:border-[#d4af37] focus:outline-none"
      >
        {providers.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
      <TitanBadge variant="gold" size="sm">
        ACTIVE
      </TitanBadge>
    </div>
  );
}
