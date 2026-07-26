import type { Habit } from "@/features/missions/types";

export interface TimeBlockGroup {
  id: string;
  blockName: string;
  timeRange: string;
  intensity: "HIGH" | "MEDIUM" | "LIGHT";
  missions: Habit[];
  suggestedBreakMins: number;
}

export function generateTimeBlocks(habits: Habit[]): TimeBlockGroup[] {
  const active = habits.filter((h) => !h.completed);

  const morningMissions = active.filter((h) => h.priority === "High" || h.category === "Operations");
  const afternoonMissions = active.filter((h) => (h.priority === "Medium" || h.category === "Knowledge") && !morningMissions.includes(h));
  const eveningMissions = active.filter((h) => !morningMissions.includes(h) && !afternoonMissions.includes(h));

  return [
    {
      id: "tb-1",
      blockName: "Morning Peak Focus Block",
      timeRange: "08:00 AM - 11:30 AM",
      intensity: "HIGH",
      missions: morningMissions.length > 0 ? morningMissions : active.slice(0, 2),
      suggestedBreakMins: 20,
    },
    {
      id: "tb-2",
      blockName: "Afternoon Deep Work Block",
      timeRange: "12:30 PM - 04:00 PM",
      intensity: "MEDIUM",
      missions: afternoonMissions.length > 0 ? afternoonMissions : active.slice(2, 4),
      suggestedBreakMins: 15,
    },
    {
      id: "tb-3",
      blockName: "Evening Recovery & Review Block",
      timeRange: "05:00 PM - 08:00 PM",
      intensity: "LIGHT",
      missions: eveningMissions.length > 0 ? eveningMissions : active.slice(4),
      suggestedBreakMins: 10,
    },
  ];
}
