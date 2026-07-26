import type { Habit } from "@/features/missions/types";
import { calculateLevel } from "./xpEngineService";
import { sanitizeCategory } from "@/constants/categories";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: "Mission" | "Streak" | "XP" | "Specialty" | "Level" | "Economy";
  requirement: number;
  progress: number;
  unlocked: boolean;
  unlockedAt?: string;
  xpReward: number;
  coinReward: number;
}

export function evaluateAchievements(habits: Habit[], totalXP: number, streak: number): Achievement[] {
  const completedMissions = habits.filter((h) => h.completed || h.history.length > 0);
  const completedCount = completedMissions.length;
  const currentLevel = calculateLevel(totalXP);

  const physicalCount = habits.filter((h) => (sanitizeCategory(h.category) === "Physical" || sanitizeCategory(h.category) === "Fitness") && (h.completed || h.history.length > 0)).length;
  const codingCount = habits.filter((h) => (sanitizeCategory(h.category) === "Operations" || sanitizeCategory(h.category) === "Coding") && (h.completed || h.history.length > 0)).length;
  const studyCount = habits.filter((h) => (sanitizeCategory(h.category) === "Knowledge" || sanitizeCategory(h.category) === "Reading") && (h.completed || h.history.length > 0)).length;
  const criticalCount = habits.filter((h) => h.priority === "High" && (h.completed || h.history.length > 0)).length;
  const totalCoins = Math.round(totalXP / 10);

  const rawAchievements: Omit<Achievement, "progress" | "unlocked">[] = [
    { id: "ach-1", title: "First Mission", description: "Accomplish your initial tactical operation.", iconName: "Target", category: "Mission", requirement: 1, xpReward: 50, coinReward: 10 },
    { id: "ach-2", title: "Mission Specialist", description: "Accomplish 10 tactical operations.", iconName: "ShieldCheck", category: "Mission", requirement: 10, xpReward: 150, coinReward: 30 },
    { id: "ach-3", title: "Century Operator", description: "Accomplish 100 tactical operations.", iconName: "Award", category: "Mission", requirement: 100, xpReward: 1000, coinReward: 200 },
    { id: "ach-4", title: "Level 5 Operative", description: "Reach Operator Clearance Level 5.", iconName: "Trophy", category: "Level", requirement: 5, xpReward: 200, coinReward: 40 },
    { id: "ach-5", title: "Level 10 Commander", description: "Reach Operator Clearance Level 10.", iconName: "Trophy", category: "Level", requirement: 10, xpReward: 500, coinReward: 100 },
    { id: "ach-6", title: "3-Day Combat Streak", description: "Maintain daily operation execution for 3 consecutive days.", iconName: "Zap", category: "Streak", requirement: 3, xpReward: 100, coinReward: 20 },
    { id: "ach-[#07]", title: "7-Day Combat Streak", description: "Maintain daily operation execution for 7 consecutive days.", iconName: "Zap", category: "Streak", requirement: 7, xpReward: 300, coinReward: 60 },
    { id: "ach-8", title: "14-Day Combat Streak", description: "Maintain daily operation execution for 14 consecutive days.", iconName: "Zap", category: "Streak", requirement: 14, xpReward: 600, coinReward: 120 },
    { id: "ach-9", title: "30-Day Legend Streak", description: "Maintain daily operation execution for 30 consecutive days.", iconName: "Zap", category: "Streak", requirement: 30, xpReward: 1500, coinReward: 300 },
    { id: "ach-10", title: "XP Accumulator (1,000 XP)", description: "Earn a cumulative total of 1,000 XP.", iconName: "Flame", category: "XP", requirement: 1000, xpReward: 100, coinReward: 25 },
    { id: "ach-11", title: "XP Dominator (5,000 XP)", description: "Earn a cumulative total of 5,000 XP.", iconName: "Flame", category: "XP", requirement: 5000, xpReward: 500, coinReward: 100 },
    { id: "ach-12", title: "XP Master (10,000 XP)", description: "Earn a cumulative total of 10,000 XP.", iconName: "Flame", category: "XP", requirement: 10000, xpReward: 1000, coinReward: 250 },
    { id: "ach-13", title: "Physical Specialist", description: "Complete 5 Physical or Fitness sector operations.", iconName: "Activity", category: "Specialty", requirement: 5, xpReward: 150, coinReward: 30 },
    { id: "ach-14", title: "Code Operative", description: "Complete 5 Coding or Operations sector operations.", iconName: "Code", category: "Specialty", requirement: 5, xpReward: 150, coinReward: 30 },
    { id: "ach-15", title: "Knowledge Scholar", description: "Complete 5 Knowledge or Reading sector operations.", iconName: "BookOpen", category: "Specialty", requirement: 5, xpReward: 150, coinReward: 30 },
    { id: "ach-16", title: "Critical Executioner", description: "Complete 5 High-Priority critical operations.", iconName: "ShieldAlert", category: "Specialty", requirement: 5, xpReward: 200, coinReward: 40 },
    { id: "ach-17", title: "Coin Wealthy (100 Coins)", description: "Accumulate 100 Titan Coins in your operational vault.", iconName: "Coins", category: "Economy", requirement: 100, xpReward: 100, coinReward: 20 },
    { id: "ach-18", title: "Titan Economy Tycoon", description: "Accumulate 500 Titan Coins in your operational vault.", iconName: "Coins", category: "Economy", requirement: 500, xpReward: 500, coinReward: 100 },
  ];

  return rawAchievements.map((ach) => {
    let currentVal = 0;

    switch (ach.category) {
      case "Mission":
        currentVal = completedCount;
        break;
      case "Level":
        currentVal = currentLevel;
        break;
      case "Streak":
        currentVal = streak;
        break;
      case "XP":
        currentVal = totalXP;
        break;
      case "Economy":
        currentVal = totalCoins;
        break;
      case "Specialty":
        if (ach.id === "ach-13") currentVal = physicalCount;
        else if (ach.id === "ach-14") currentVal = codingCount;
        else if (ach.id === "ach-15") currentVal = studyCount;
        else if (ach.id === "ach-16") currentVal = criticalCount;
        break;
      default:
        currentVal = 0;
    }

    const progress = Math.min(ach.requirement, currentVal);
    const unlocked = currentVal >= ach.requirement;

    return {
      ...ach,
      progress,
      unlocked,
      unlockedAt: unlocked ? new Date().toISOString() : undefined,
    };
  });
}
