import { safeISOString } from "@/utils/safeDate";

export type ProviderCategory =
  | "Calendar & Tasks"
  | "Developer & Code"
  | "Productivity & Wiki"
  | "Communication & Alerts"
  | "Email & Intelligence";

export type ConnectionStatus = "CONNECTED" | "DISCONNECTED" | "SYNCING" | "FAILED" | "EXPIRED";

export interface IntegrationProviderInfo {
  id: string;
  name: string;
  category: ProviderCategory;
  description: string;
  iconName: string;
  status: ConnectionStatus;
  lastSyncedAt?: string;
  capabilities: string[];
  requiresAuth: boolean;
}

export const SUPPORTED_PROVIDERS: IntegrationProviderInfo[] = [
  {
    id: "google-calendar",
    name: "Google Calendar",
    category: "Calendar & Tasks",
    description: "Two-way synchronization for events, time blocks, and scheduled directives.",
    iconName: "Calendar",
    status: "CONNECTED",
    lastSyncedAt: safeISOString(new Date(Date.now() - 1800000)),
    capabilities: ["Two-Way Event Sync", "Conflict Detection", "Time Blocking"],
    requiresAuth: true,
  },
  {
    id: "github",
    name: "GitHub Workspace",
    category: "Developer & Code",
    description: "Link repositories, import issues as tactical missions, and track commit activity.",
    iconName: "GitBranch",
    status: "CONNECTED",
    lastSyncedAt: safeISOString(new Date(Date.now() - 3600000)),
    capabilities: ["Issue Import", "PR Tracking", "Commit Telemetry"],
    requiresAuth: true,
  },
  {
    id: "notion",
    name: "Notion Vault",
    category: "Productivity & Wiki",
    description: "Bidirectional document sync and Knowledge OS page importing.",
    iconName: "BookOpen",
    status: "CONNECTED",
    lastSyncedAt: safeISOString(new Date(Date.now() - 7200000)),
    capabilities: ["Page Import", "Vault Export", "Database Mapping"],
    requiresAuth: true,
  },
  {
    id: "slack",
    name: "Slack Intelligence",
    category: "Communication & Alerts",
    description: "Publish workflow alerts, mission completions, and daily AI executive briefings.",
    iconName: "MessageSquare",
    status: "DISCONNECTED",
    capabilities: ["Workflow Alerts", "Daily Briefings", "Command Bot"],
    requiresAuth: true,
  },
  {
    id: "discord",
    name: "Discord Ops Bot",
    category: "Communication & Alerts",
    description: "Stream achievement unlocks and team combat notifications into Discord channels.",
    iconName: "MessageCircle",
    status: "DISCONNECTED",
    capabilities: ["Achievement Streams", "Combat Alerts", "Webhook Push"],
    requiresAuth: true,
  },
  {
    id: "gmail",
    name: "Gmail Intelligence",
    category: "Email & Intelligence",
    description: "AI-powered email meeting detection and automatic mission directive extraction.",
    iconName: "Mail",
    status: "DISCONNECTED",
    capabilities: ["Meeting Extraction", "Task Parsing", "AI Email Digest"],
    requiresAuth: true,
  },
  {
    id: "outlook",
    name: "Microsoft Outlook",
    category: "Email & Intelligence",
    description: "Sync enterprise calendar events and email action items into TITAN.",
    iconName: "Mail",
    status: "DISCONNECTED",
    capabilities: ["Outlook Calendar Sync", "Email Digest"],
    requiresAuth: true,
  },
  {
    id: "apple-reminders",
    name: "Apple Reminders",
    category: "Calendar & Tasks",
    description: "Sync mobile reminders into Mission Control tactical directives queue.",
    iconName: "CheckSquare",
    status: "DISCONNECTED",
    capabilities: ["Mobile Task Sync", "Priority Sync"],
    requiresAuth: false,
  },
  {
    id: "microsoft-todo",
    name: "Microsoft To Do",
    category: "Calendar & Tasks",
    description: "Enterprise task synchronization with Microsoft 365 ecosystem.",
    iconName: "ListTodo",
    status: "DISCONNECTED",
    capabilities: ["Enterprise Task Sync", "Outlook Sync"],
    requiresAuth: true,
  },
];
