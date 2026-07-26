import { useMemo } from "react";
import { useIntegrationStore } from "@/store/integrationStore";
import { calculateSyncHealth } from "@/services/integrations/syncEngine";

export function useIntegrations() {
  const {
    providers,
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
  } = useIntegrationStore();

  const syncHealth = useMemo(() => {
    return calculateSyncHealth(providers);
  }, [providers]);

  const filteredProviders = useMemo(() => {
    if (selectedCategory === "ALL") return providers;
    return providers.filter((p) => p.category === selectedCategory);
  }, [providers, selectedCategory]);

  return {
    providers,
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
  };
}
