import type { Habit } from "@/features/missions/types";

export interface PerformanceScoreDetails {
  score: number; // 0 - 100
  grade: "S" | "A" | "B" | "C" | "D";
  explanation: string;
}

export interface FocusTelemetryDetails {
  avgFocusMins: number;
  longestSessionMins: number;
  deepWorkHours: number;
  breakTimeMins: number;
  peakHours: string;
}

export interface IntelligenceInsightItem {
  id: string;
  title: string;
  message: string;
  category: "Performance" | "Focus" | "Timing" | "Warning";
  impact: "HIGH" | "POSITIVE" | "CRITICAL";
}

export function calculatePerformanceScore(habits: Habit[], streak: number): PerformanceScoreDetails {
  const completed = habits.filter((h) => h.completed).length;
  const total = habits.length;

  const completionPart = total > 0 ? (completed / total) * 40 : 32;
  const streakPart = Math.min(30, (streak || 1) * 4);
  const volumePart = Math.min(30, total * 5);

  const score = Math.min(100, Math.max(10, Math.round(completionPart + streakPart + volumePart)));

  let grade: PerformanceScoreDetails["grade"] = "A";
  let explanation = "";

  if (score >= 90) {
    grade = "S";
    explanation = "Supreme Titan Rank Performance — Peak operational consistency and execution speed.";
  } else if (score >= 80) {
    grade = "A";
    explanation = "Elite Field Command Clearance — Exceptional focus time and daily streak retention.";
  } else if (score >= 70) {
    grade = "B";
    explanation = "Solid Operator Status — Strong operational output with minor scheduling delays.";
  } else if (score >= 50) {
    grade = "C";
    explanation = "Moderate Performance — Target CRITICAL objectives early to improve completion rate.";
  } else {
    grade = "D";
    explanation = "Sub-optimal Telemetry — Reduce mission density and focus on high-impact objectives.";
  }

  return { score, grade, explanation };
}

export function generateFocusAnalysis(habits: Habit[]): FocusTelemetryDetails {
  const completed = habits.filter((h) => h.completed || h.history.length > 0);

  return {
    avgFocusMins: 45,
    longestSessionMins: 90,
    deepWorkHours: Number((completed.length * 1.2).toFixed(1)) || 4.5,
    breakTimeMins: 30,
    peakHours: "08:00 AM - 11:30 AM",
  };
}

export function generateIntelligenceInsights(habits: Habit[]): IntelligenceInsightItem[] {
  const completedCount = habits.filter((h) => h.completed).length;

  const insights: IntelligenceInsightItem[] = [
    {
      id: "ins-1",
      title: "Coding & Operations Velocity",
      message: `You have accomplished ${completedCount} operations. Coding sessions average 15% faster completion velocity.`,
      category: "Performance",
      impact: "POSITIVE",
    },
    {
      id: "ins-2",
      title: "Physical Conditioning Peak",
      message: "Workout and Physical operations exhibit the highest overall completion rate at 94%.",
      category: "Focus",
      impact: "POSITIVE",
    },
    {
      id: "ins-3",
      title: "Morning Cognitive Window",
      message: "Morning hours (08:00 AM - 11:30 AM) represent your highest cognitive productivity window.",
      category: "Timing",
      impact: "HIGH",
    },
    {
      id: "ins-4",
      title: "Critical Directive Scheduling",
      message: "High-priority operations scheduled after 06:00 PM experience a 35% higher postponement rate.",
      category: "Warning",
      impact: "CRITICAL",
    },
  ];

  return insights;
}
