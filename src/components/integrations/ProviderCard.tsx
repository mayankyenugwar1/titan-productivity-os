import {
  BookOpen,
  Calendar,
  CheckSquare,
  GitBranch,
  ListTodo,
  Mail,
  MessageCircle,
  MessageSquare,
  RefreshCw,
  Zap,
} from "lucide-react";
import type { IntegrationProviderInfo } from "@/services/integrations/providerRegistry";
import { TitanBadge, TitanButton } from "@/components/ui";

const ICON_MAP: Record<string, any> = {
  Calendar,
  GitBranch,
  BookOpen,
  MessageSquare,
  MessageCircle,
  Mail,
  CheckSquare,
  ListTodo,
};

interface ProviderCardProps {
  provider: IntegrationProviderInfo;
  onConnect: (id: string) => void;
  onDisconnect: (id: string) => void;
  onSync: (id: string) => void;
  isSyncing: boolean;
}

export default function ProviderCard({
  provider,
  onConnect,
  onDisconnect,
  onSync,
  isSyncing,
}: ProviderCardProps) {
  const IconComp = ICON_MAP[provider.iconName] || Zap;
  const isConnected = provider.status === "CONNECTED";

  return (
    <div
      className={`relative flex flex-col justify-between rounded-3xl border p-6 space-y-4 font-mono transition duration-300 ${
        isConnected
          ? "border-[#d4af37]/40 bg-[#0d0d10] shadow-xl shadow-black hover:border-[#d4af37]"
          : "border-zinc-800/80 bg-[#070709] hover:border-zinc-700"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex size-11 items-center justify-center rounded-2xl border ${
              isConnected
                ? "border-[#d4af37]/40 bg-[#d4af37]/15 text-[#e5c158]"
                : "border-zinc-800 bg-zinc-900 text-zinc-500"
            }`}
          >
            <IconComp className="size-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <TitanBadge variant={isConnected ? "gold" : "zinc"} size="sm">
                {provider.status}
              </TitanBadge>
              <span className="text-[10px] text-zinc-500 font-bold uppercase">{provider.category}</span>
            </div>
            <h4 className="mt-1 font-sans text-base font-bold text-white">{provider.name}</h4>
          </div>
        </div>
      </div>

      <p className="text-xs text-zinc-400 font-sans leading-relaxed">{provider.description}</p>

      {/* Capabilities Badges */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {provider.capabilities.map((cap) => (
          <span
            key={cap}
            className="rounded-lg border border-zinc-800 bg-[#0c0c0f] px-2 py-1 text-[10px] font-bold text-zinc-400"
          >
            {cap}
          </span>
        ))}
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between border-t border-zinc-800/80 pt-4 text-xs">
        {isConnected ? (
          <>
            <TitanButton
              size="sm"
              variant="outline"
              disabled={isSyncing}
              leftIcon={<RefreshCw className={`size-3.5 ${isSyncing ? "animate-spin" : ""}`} />}
              onClick={() => onSync(provider.id)}
            >
              SYNC NOW
            </TitanButton>

            <TitanButton size="sm" variant="danger" onClick={() => onDisconnect(provider.id)}>
              DISCONNECT
            </TitanButton>
          </>
        ) : (
          <TitanButton size="sm" onClick={() => onConnect(provider.id)}>
            CONNECT PROVIDER
          </TitanButton>
        )}
      </div>
    </div>
  );
}
