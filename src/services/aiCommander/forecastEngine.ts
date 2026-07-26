import type { Habit } from "@/features/missions/types";
import { calculateDynamicXP } from "@/features/missions/types";

export interface FocusScoreBreakdown {
  score: number; // 0 - 100
  rating: "PEAK FOCUS" | "HIGH FOCUS" | "MODERATE FOCUS" | "LOW FOCUS";
  explanation: string;
}

export interface ProductivityForecast {
  completionRateForecast: number;
  expectedXP: number;
  expectedCoins: number;
  likelyFinishTime: string;
  confidenceLevel: string;
}

export function calculateFocusScore(habits: Habit[]): FocusScoreBreakdown {
  if (habits.length === 0) {
    return {
      score: 92,
      rating: "PEAK FOCUS",
      explanation: "No active cognitive load detected. System ready for peak focus allocation.",
    };
  }

  const completed = habits.filter((h) => h.completed).length;
  const total = habits.length;

  const baseRate = total > 0 ? (completed / total) * 50 : 35;
  const criticalCount = habits.filter((h) => h.priority === "High").length;
  const balanceBonus = criticalCount > 0 && criticalCount <= 3 ? 30 : 15;
  const volumeBonus = total <= 6 ? 20 : 10;

  const score = Math.min(100, Math.max(10, Math.round(baseRate + balanceBonus + volumeBonus)));

  let rating: FocusScoreBreakdown["rating"] = "HIGH FOCUS";
  let explanation = "";

  if (score >= 85) {
    rating = "PEAK FOCUS";
    explanation = "Optimal balance of high-priority targets and manageable duration payload.";
  } else if (score >= 70) {
    rating = "HIGH FOCUS";
    explanation = "Strong focus allocation. High probability of complete workload execution.";
  } else if (score >= 50) {
    rating = "MODERATE FOCUS";
    explanation = "Moderate workload density. Maintain structured focus mode sessions.";
  } else {
    rating = "LOW FOCUS";
    explanation = "High mission volume detected. Consider prioritizing top CRITICAL targets.";
  }

  return { score, rating, explanation };
}

export function generateProductivityForecast(habits: Habit[]): ProductivityForecast {
  const activeMissions = habits.filter((h) => !h.completed);
  const completedMissions = habits.filter((h) => h.completed);

  const expectedXP = activeMissions.reduce((sum, h) => sum + calculateDynamicXP(h), 0);
  const expectedCoins = Math.round(expectedXP / 10);

  const completionRateForecast =
    habits.length > 0 ? Math.round(((completedMissions.length + 1) / habits.length) * 100) : 90;

  return {
    completionRateForecast: Math.min(100, completionRateForecast),
    expectedXP,
    expectedCoins,
    likelyFinishTime: "06:45 PM",
    confidenceLevel: "HIGH CONFIDENCE (93%)",
  };
}
