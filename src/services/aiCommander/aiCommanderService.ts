import type { Habit } from "@/features/missions/types";
import { analyzeWorkload, type WorkloadTelemetry } from "./analysisEngine";
import { generateSmartPrioritization, type PrioritizedMissionStep } from "./priorityEngine";
import {
  calculateFocusScore,
  generateProductivityForecast,
  type FocusScoreBreakdown,
  type ProductivityForecast,
} from "./forecastEngine";
import { generateRecommendations, type AIRecommendationItem } from "./recommendationEngine";

export interface AICommanderBriefing {
  greeting: string;
  telemetry: WorkloadTelemetry;
  prioritizedSteps: PrioritizedMissionStep[];
  focusScore: FocusScoreBreakdown;
  forecast: ProductivityForecast;
  recommendations: AIRecommendationItem[];
  provider: "LOCAL_ENGINE" | "OPENAI" | "CLAUDE" | "GEMINI";
}

export function generateAICommanderBriefing(habits: Habit[]): AICommanderBriefing {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning, Operator." : hour < 18 ? "Good Afternoon, Operator." : "Good Evening, Operator.";

  const telemetry = analyzeWorkload(habits);
  const prioritizedSteps = generateSmartPrioritization(habits);
  const focusScore = calculateFocusScore(habits);
  const forecast = generateProductivityForecast(habits);
  const recommendations = generateRecommendations(habits);

  return {
    greeting,
    telemetry,
    prioritizedSteps,
    focusScore,
    forecast,
    recommendations,
    provider: "LOCAL_ENGINE",
  };
}
