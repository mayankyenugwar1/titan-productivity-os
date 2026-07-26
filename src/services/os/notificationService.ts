export type NotificationType =
  | "MISSION_COMPLETE"
  | "ACHIEVEMENT_UNLOCKED"
  | "LEVEL_UP"
  | "CHALLENGE_COMPLETE"
  | "AI_RECOMMENDATION"
  | "STREAK_MILESTONE"
  | "FORECAST_WARNING";

export interface TITANNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
}

export function getInitialNotifications(): TITANNotification[] {
  return [
    {
      id: "notif-1",
      title: "System Clearance Granted",
      message: "Welcome Operator. TITAN OS Core Engine Version 5.0 is fully operational.",
      type: "LEVEL_UP",
      read: false,
      createdAt: "10 mins ago",
    },
    {
      id: "notif-2",
      title: "Daily Challenge Accomplished",
      message: "Directive 'Triple Execution' completed. +150 XP and 🪙 +30 Coins credited.",
      type: "CHALLENGE_COMPLETE",
      read: false,
      createdAt: "25 mins ago",
    },
    {
      id: "notif-3",
      title: "AI Commander Recommendation",
      message: "Morning cognitive peak active. Execute highest priority operation first.",
      type: "AI_RECOMMENDATION",
      read: true,
      createdAt: "1 hour ago",
    },
    {
      id: "notif-4",
      title: "Achievement Unlocked",
      message: "Clearance badge 'First Mission' unlocked (+50 XP, 🪙 +10 Coins).",
      type: "ACHIEVEMENT_UNLOCKED",
      read: true,
      createdAt: "2 hours ago",
    },
  ];
}
