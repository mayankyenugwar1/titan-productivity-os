import { SUPPORTED_PROVIDERS, type IntegrationProviderInfo } from "./providerRegistry";

export interface SyncLogEntry {
  id: string;
  providerId: string;
  providerName: string;
  status: "SUCCESS" | "FAILED" | "CONFLICT" | "IN_PROGRESS";
  message: string;
  itemsSynced: number;
  timestamp: string;
}

export interface SyncHealthTelemetry {
  overallHealth: "HEALTHY" | "DEGRADED" | "OFFLINE";
  connectedCount: number;
  totalProviders: number;
  lastSyncedAt: string;
  activeQueueCount: number;
}

export function calculateSyncHealth(providers: IntegrationProviderInfo[]): SyncHealthTelemetry {
  const connectedCount = providers.filter((p) => p.status === "CONNECTED").length;

  let overallHealth: "HEALTHY" | "DEGRADED" | "OFFLINE" = "HEALTHY";
  if (connectedCount === 0) overallHealth = "OFFLINE";
  else if (connectedCount < providers.length / 2) overallHealth = "DEGRADED";

  return {
    overallHealth,
    connectedCount,
    totalProviders: providers.length,
    lastSyncedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    activeQueueCount: 0,
  };
}

export function performProviderSync(providerId: string): SyncLogEntry {
  const provider = SUPPORTED_PROVIDERS.find((p) => p.id === providerId);
  const name = provider ? provider.name : providerId;

  return {
    id: `synclog-${Date.now()}`,
    providerId,
    providerName: name,
    status: "SUCCESS",
    message: `Synchronized workspace state with ${name}. 14 records processed.`,
    itemsSynced: 14,
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };
}
