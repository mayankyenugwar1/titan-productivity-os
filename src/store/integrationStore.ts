import { create } from "zustand";
import { SUPPORTED_PROVIDERS, type IntegrationProviderInfo } from "@/services/integrations/providerRegistry";
import { performProviderSync, type SyncLogEntry } from "@/services/integrations/syncEngine";
import { INITIAL_CONFLICTS, resolveConflict, type SyncConflictRecord } from "@/services/integrations/conflictResolverService";

interface IntegrationStoreState {
  providers: IntegrationProviderInfo[];
  syncLogs: SyncLogEntry[];
  conflicts: SyncConflictRecord[];
  isSyncing: boolean;
  selectedCategory: string;

  setSelectedCategory: (category: string) => void;
  connectProvider: (providerId: string) => void;
  disconnectProvider: (providerId: string) => void;
  syncProvider: (providerId: string) => void;
  syncAll: () => void;
  resolveConflictItem: (conflictId: string, strategy: "CLIENT_WINS" | "REMOTE_WINS" | "MERGE") => void;
}

export const useIntegrationStore = create<IntegrationStoreState>((set, get) => ({
  providers: SUPPORTED_PROVIDERS,
  syncLogs: [
    {
      id: "synclog-init-1",
      providerId: "google-calendar",
      providerName: "Google Calendar",
      status: "SUCCESS",
      message: "Synchronized 8 event directives.",
      itemsSynced: 8,
      timestamp: new Date(Date.now() - 1800000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
    {
      id: "synclog-init-2",
      providerId: "github",
      providerName: "GitHub Workspace",
      status: "SUCCESS",
      message: "Pulled 4 pull request reviews into Mission Control.",
      itemsSynced: 4,
      timestamp: new Date(Date.now() - 3600000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ],
  conflicts: INITIAL_CONFLICTS,
  isSyncing: false,
  selectedCategory: "ALL",

  setSelectedCategory: (category) => set({ selectedCategory: category }),

  connectProvider: (providerId) => {
    set((state) => ({
      providers: state.providers.map((p) =>
        p.id === providerId
          ? { ...p, status: "CONNECTED", lastSyncedAt: new Date().toISOString() }
          : p
      ),
    }));
  },

  disconnectProvider: (providerId) => {
    set((state) => ({
      providers: state.providers.map((p) =>
        p.id === providerId ? { ...p, status: "DISCONNECTED", lastSyncedAt: undefined } : p
      ),
    }));
  },

  syncProvider: (providerId) => {
    set({ isSyncing: true });
    const logEntry = performProviderSync(providerId);

    setTimeout(() => {
      set((state) => ({
        isSyncing: false,
        syncLogs: [logEntry, ...state.syncLogs],
        providers: state.providers.map((p) =>
          p.id === providerId ? { ...p, status: "CONNECTED", lastSyncedAt: new Date().toISOString() } : p
        ),
      }));
    }, 600);
  },

  syncAll: () => {
    set({ isSyncing: true });
    const connected = get().providers.filter((p) => p.status === "CONNECTED");
    const newLogs = connected.map((p) => performProviderSync(p.id));

    setTimeout(() => {
      set((state) => ({
        isSyncing: false,
        syncLogs: [...newLogs, ...state.syncLogs],
        providers: state.providers.map((p) =>
          p.status === "CONNECTED" ? { ...p, lastSyncedAt: new Date().toISOString() } : p
        ),
      }));
    }, 1000);
  },

  resolveConflictItem: (conflictId, strategy) => {
    const conflict = get().conflicts.find((c) => c.id === conflictId);
    if (!conflict) return;

    const resMessage = resolveConflict(conflict, strategy);

    set((state) => ({
      conflicts: state.conflicts.filter((c) => c.id !== conflictId),
      syncLogs: [
        {
          id: `synclog-conf-${Date.now()}`,
          providerId: conflict.providerId,
          providerName: conflict.providerName,
          status: "SUCCESS",
          message: resMessage,
          itemsSynced: 1,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
        ...state.syncLogs,
      ],
    }));
  },
}));
