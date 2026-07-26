import type { Habit } from "@/features/missions/types";
import { calculateMissionXP } from "./xpEngineService";

export interface CoinTelemetry {
  currentCoins: number;
  todaysCoins: number;
  lifetimeCoins: number;
}

export function calculateCoinTelemetry(habits: Habit[], totalXP: number): CoinTelemetry {
  const completedToday = habits.filter((h) => h.completed);
  const todaysCoins = completedToday.reduce((sum, h) => sum + Math.round(calculateMissionXP(h) / 10), 0);
  const lifetimeCoins = Math.round(Math.max(0, totalXP) / 10);
  const currentCoins = lifetimeCoins;

  return {
    currentCoins,
    todaysCoins,
    lifetimeCoins,
  };
}
