import { useIntegrations } from "@/hooks/integrations/useIntegrations";
import { SectionHeader } from "@/components/ui";
import SyncHealthWidget from "@/components/integrations/SyncHealthWidget";
import ConflictResolverModal from "@/components/integrations/ConflictResolverModal";
import ProviderCard from "@/components/integrations/ProviderCard";
import SyncHistoryPanel from "@/components/integrations/SyncHistoryPanel";

export default function IntegrationsPage() {
  const {
    filteredProviders,
    syncHealth,
    syncLogs,
    conflicts,
    isSyncing,
    selectedCategory,
    setSelectedCategory,
    connectProvider,
    disconnectProvider,
    syncProvider,
    syncAll,
    resolveConflictItem,
  } = useIntegrations();

  const categories = [
    "ALL",
    "Calendar & Tasks",
    "Developer & Code",
    "Productivity & Wiki",
    "Communication & Alerts",
    "Email & Intelligence",
  ];

  return (
    <div className="space-y-8 py-4 font-mono text-zinc-100">
      <SectionHeader
        badge="Universal Synchronization Engine"
        title="Integrations Hub & Sync Control"
        description="Connect third-party productivity platforms into TITAN's centralized Integration Layer with automated background sync and conflict resolution."
      />

      {/* Sync Telemetry Header */}
      <SyncHealthWidget telemetry={syncHealth} isSyncing={isSyncing} onSyncAll={syncAll} />

      {/* Conflict Resolution Section */}
      <ConflictResolverModal conflicts={conflicts} onResolve={resolveConflictItem} />

      {/* Control Bar: Categories */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-zinc-800/80 bg-[#070709] p-5 shadow-2xl shadow-black">
        <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-zinc-800 bg-[#0c0c0f] p-1.5 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-3 py-1.5 font-bold transition ${
                selectedCategory === cat
                  ? "border border-[#d4af37]/40 bg-[#d4af37] text-zinc-950 shadow-md"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-zinc-400 font-bold uppercase tracking-wider">
          <span>INTEGRATION PROVIDERS ({filteredProviders.length} AVAILABLE)</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProviders.map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              onConnect={connectProvider}
              onDisconnect={disconnectProvider}
              onSync={syncProvider}
              isSyncing={isSyncing}
            />
          ))}
        </div>
      </div>

      {/* Audit Log Trail */}
      <SyncHistoryPanel logs={syncLogs} />
    </div>
  );
}
