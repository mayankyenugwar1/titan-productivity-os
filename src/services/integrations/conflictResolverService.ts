import { safeTime } from "@/utils/safeDate";

export interface SyncConflictRecord {
  id: string;
  providerId: string;
  providerName: string;
  recordTitle: string;
  localVersion: {
    title: string;
    updatedAt: string;
    status: string;
  };
  remoteVersion: {
    title: string;
    updatedAt: string;
    status: string;
  };
  timestamp: string;
}

export const INITIAL_CONFLICTS: SyncConflictRecord[] = [
  {
    id: "conf-1",
    providerId: "google-calendar",
    providerName: "Google Calendar",
    recordTitle: "Codebase Refactoring Session",
    localVersion: {
      title: "Codebase Refactoring Session (Completed)",
      updatedAt: "Today 10:30",
      status: "Accomplished (+150 XP)",
    },
    remoteVersion: {
      title: "Codebase Refactoring Session",
      updatedAt: "Today 09:00",
      status: "Scheduled",
    },
    timestamp: safeTime(new Date()),
  },
];

export function resolveConflict(
  conflict: SyncConflictRecord,
  strategy: "CLIENT_WINS" | "REMOTE_WINS" | "MERGE"
): string {
  if (strategy === "CLIENT_WINS") {
    return `Resolved conflict for "${conflict.recordTitle}": Local state preserved.`;
  }
  if (strategy === "REMOTE_WINS") {
    return `Resolved conflict for "${conflict.recordTitle}": Remote provider state applied.`;
  }
  return `Resolved conflict for "${conflict.recordTitle}": Merged local and remote properties.`;
}
