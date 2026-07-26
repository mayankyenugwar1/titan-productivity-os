import type { Habit } from "@/features/missions/types";

export interface ProductivityInsight {
  id: string;
  category: "PEAK_PERFORMANCE" | "BEHAVIORAL_PATTERN" | "STREAK_MOMENTUM" | "FOCUS_RECOMMENDATION";
  title: string;
  description: string;
  metricBadge: string;
  severity: "POSITIVE" | "NEUTRAL" | "ACTION_REQUIRED";
}

export function generateProductivityInsights(
  habits: Habit[],
  streak: number,
  focusScore: number
): ProductivityInsight[] {
  const insights: ProductivityInsight[] = [];
  const completedCount = habits.filter((h) => h.completed).length;

  // Peak performance window
  insights.push({
    id: "ins-1",
    category: "PEAK_PERFORMANCE",
    title: "Morning Focus Velocity Peak",
    description: `Telemetry indicates ${completedCount} completed operation(s) during morning focus window.`,
    metricBadge: `${completedCount} Ops Done`,
    severity: "POSITIVE",
  });

  // Streak Momentum
  if (streak > 0) {
    insights.push({
      id: "ins-2",
      category: "STREAK_MOMENTUM",
      title: `${streak}-Day Continuous Combat Streak`,
      description: `You have maintained active operational execution for ${streak} consecutive days. Streak multiplier active.`,
      metricBadge: `${streak} Days Active`,
      severity: "POSITIVE",
    });
  }

  // Focus Score Analysis
  if (focusScore >= 70) {
    insights.push({
      id: "ins-3",
      category: "FOCUS_RECOMMENDATION",
      title: "Optimal Daily Focus Velocity",
      description: `Your focus index is currently at ${focusScore}%. Keep executing active directives in Mission Control.`,
      metricBadge: `${focusScore}% Focus`,
      severity: "POSITIVE",
    });
  } else {
    insights.push({
      id: "ins-3-action",
      category: "FOCUS_RECOMMENDATION",
      title: "Focus Velocity Acceleration Opportunity",
      description: "Focus score is below optimal. Consider starting a 25-minute Focus Timer on pending directives.",
      metricBadge: "Action Recommended",
      severity: "ACTION_REQUIRED",
    });
  }

  return insights;
}
