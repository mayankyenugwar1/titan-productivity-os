import type { Habit } from "@/features/missions/types";
import {
  calculateKeyMetrics,
  calculateCategoryBreakdown,
  type KeyMetricsTelemetry,
  type CategoryTelemetry,
} from "./statisticsEngine";
import {
  calculatePerformanceScore,
  generateFocusAnalysis,
  generateIntelligenceInsights,
  type PerformanceScoreDetails,
  type FocusTelemetryDetails,
  type IntelligenceInsightItem,
} from "./insightEngine";

export interface AnalyticsData {
  metrics: KeyMetricsTelemetry;
  categories: CategoryTelemetry[];
  performance: PerformanceScoreDetails;
  focus: FocusTelemetryDetails;
  insights: IntelligenceInsightItem[];
}

export function getAnalyticsData(habits: Habit[], totalXP: number, streak: number): AnalyticsData {
  const metrics = calculateKeyMetrics(habits, totalXP, streak);
  const categories = calculateCategoryBreakdown(habits);
  const performance = calculatePerformanceScore(habits, streak);
  const focus = generateFocusAnalysis(habits);
  const insights = generateIntelligenceInsights(habits);

  return {
    metrics,
    categories,
    performance,
    focus,
    insights,
  };
}
