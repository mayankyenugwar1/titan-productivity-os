import type { Habit } from "@/features/missions/types";

export interface AIRecommendationItem {
  id: string;
  title: string;
  actionText: string;
  reasoning: string;
  category: "Deep Work" | "Break" | "Prioritization" | "Conditioning";
  impact: "HIGH" | "MEDIUM" | "CRITICAL";
}

export function generateRecommendations(habits: Habit[]): AIRecommendationItem[] {
  const activeMissions = habits.filter((h) => !h.completed);
  const recommendations: AIRecommendationItem[] = [];

  const highPriority = activeMissions.find((h) => h.priority === "High");
  if (highPriority) {
    recommendations.push({
      id: "rec-1",
      title: "Start with Deep Work",
      actionText: `Execute "${highPriority.title}" during your first morning session.`,
      reasoning: "Cognitive energy and focus capacity are highest during morning hours.",
      category: "Deep Work",
      impact: "CRITICAL",
    });
  } else {
    recommendations.push({
      id: "rec-1",
      title: "Designate Primary Target",
      actionText: "Assign CRITICAL priority weight to your primary objective.",
      reasoning: "Having a single core objective improves daily completion probability by 40%.",
      category: "Prioritization",
      impact: "HIGH",
    });
  }

  if (activeMissions.length >= 3) {
    recommendations.push({
      id: "rec-2",
      title: "Scheduled Tactical Break",
      actionText: "Take a 15-minute break after completing your 2nd operation.",
      reasoning: "Sustained focus over 90 continuous minutes degrades decision precision.",
      category: "Break",
      impact: "HIGH",
    });
  }

  const workoutMission = activeMissions.find((h) => h.category === "Physical" || h.category === "Fitness");
  if (workoutMission) {
    recommendations.push({
      id: "rec-3",
      title: "Physical Conditioning Alignment",
      actionText: `Execute "${workoutMission.title}" before late evening hours.`,
      reasoning: "Mid-day physical conditioning releases endorphins and optimizes evening focus.",
      category: "Conditioning",
      impact: "MEDIUM",
    });
  } else {
    recommendations.push({
      id: "rec-3",
      title: "Postpone Low-Impact Tasks",
      actionText: "Filter out optional tasks until CRITICAL directives are accomplished.",
      reasoning: "Preventing task switching preserves mental bandwidth for core payloads.",
      category: "Prioritization",
      impact: "MEDIUM",
    });
  }

  return recommendations;
}
