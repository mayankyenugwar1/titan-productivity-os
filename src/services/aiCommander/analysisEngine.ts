import type { Habit } from "@/features/missions/types";

export interface WorkloadWarning {
  id: string;
  type: "OVERLOAD" | "NO_CRITICAL" | "EXCESSIVE_TIME" | "DIFFICULTY_SPIKE";
  title: string;
  message: string;
  severity: "high" | "medium" | "low";
}

export interface WorkloadTelemetry {
  activeCount: number;
  completedCount: number;
  totalCount: number;
  criticalCount: number;
  estimatedWorkloadMins: number;
  recommendedStartTime: string;
  recommendedBreakCount: number;
  estimatedFinishTime: string;
  productivityRating: "OPTIMAL" | "EXCELLENT" | "HIGH" | "MODERATE";
  completionProbability: number;
  warnings: WorkloadWarning[];
}

export function analyzeWorkload(habits: Habit[]): WorkloadTelemetry {
  const activeMissions = habits.filter((h) => !h.completed);
  const completedMissions = habits.filter((h) => h.completed);

  const activeCount = activeMissions.length;
  const completedCount = completedMissions.length;
  const totalCount = habits.length;

  const criticalCount = activeMissions.filter((h) => h.priority === "High").length;

  const getMins = (p: string) => (p === "High" ? 90 : p === "Medium" ? 45 : 20);
  const estimatedWorkloadMins = activeMissions.reduce((sum, h) => sum + getMins(h.priority), 0);

  const recommendedBreakCount = Math.max(1, Math.floor(estimatedWorkloadMins / 60));

  // Times
  const startHour = 8;
  const recommendedStartTime = `${startHour.toString().padStart(2, "0")}:00 AM`;

  const totalDurationWithBreaks = estimatedWorkloadMins + recommendedBreakCount * 15;
  const finishHour = startHour + Math.floor(totalDurationWithBreaks / 60);
  const finishMin = totalDurationWithBreaks % 60;
  const period = finishHour >= 12 ? "PM" : "AM";
  const displayHour = finishHour > 12 ? finishHour - 12 : finishHour;
  const estimatedFinishTime = `${displayHour.toString().padStart(2, "0")}:${finishMin.toString().padStart(2, "0")} ${period}`;

  // Productivity Rating & Probability
  const completionProbability = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 88;
  const productivityRating: WorkloadTelemetry["productivityRating"] =
    completionProbability >= 75 ? "OPTIMAL" : completionProbability >= 50 ? "EXCELLENT" : "HIGH";

  // Warnings Detection
  const warnings: WorkloadWarning[] = [];

  if (activeCount > 8) {
    warnings.push({
      id: "warn-1",
      type: "OVERLOAD",
      title: "Excessive Mission Volume",
      message: `Operator, you have ${activeCount} active missions scheduled today. Consider delegating or postponing non-essential tasks.`,
      severity: "high",
    });
  }

  if (estimatedWorkloadMins > 360) {
    warnings.push({
      id: "warn-2",
      type: "EXCESSIVE_TIME",
      title: "Workload Ceiling Exceeded",
      message: `Estimated workload is ${(estimatedWorkloadMins / 60).toFixed(1)} hours. Risk of cognitive exhaustion is high.`,
      severity: "high",
    });
  }

  if (activeCount > 0 && criticalCount === 0) {
    warnings.push({
      id: "warn-3",
      type: "NO_CRITICAL",
      title: "No High-Priority Targets Set",
      message: "Zero CRITICAL priority operations identified today. Ensure key focus objectives are assigned proper priority weight.",
      severity: "medium",
    });
  }

  return {
    activeCount,
    completedCount,
    totalCount,
    criticalCount,
    estimatedWorkloadMins,
    recommendedStartTime,
    recommendedBreakCount,
    estimatedFinishTime,
    productivityRating,
    completionProbability,
    warnings,
  };
}
