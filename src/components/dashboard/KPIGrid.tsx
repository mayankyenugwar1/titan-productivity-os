import {
  CheckCircle2,
  Target,
  Trophy,
  Zap,
} from "lucide-react";

import KPICard from "./KPICard";

import { useHabitStore } from "@/store/habitStore";

export default function KPIGrid() {
  const {
    habits,
    totalXP,
    streak,
  } = useHabitStore();

  const completedToday = habits.filter(
    (habit) => habit.completed
  ).length;

  const activeMissions = habits.filter(
    (habit) => !habit.completed
  ).length;

  const level = Math.floor(totalXP / 500) + 1;

  return (
    <section className="mt-10">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.35em] text-yellow-400">
          Performance Overview
        </p>

        <h2 className="mt-2 text-3xl font-black text-white">
          Mission Analytics
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <KPICard
          title="Total XP"
          value={totalXP}
          icon={Zap}
          accent="gold"
        />

        <KPICard
          title="Current Level"
          value={level}
          icon={Trophy}
          accent="purple"
        />

        <KPICard
          title="Active Missions"
          value={activeMissions}
          icon={Target}
          accent="blue"
        />

        <KPICard
          title="Completed Today"
          value={completedToday}
          icon={CheckCircle2}
          accent="green"
        />
      </div>

      <div className="mt-6">
        <KPICard
          title="Current Streak"
          value={`${streak} Days`}
          icon={Trophy}
          accent="gold"
        />
      </div>
    </section>
  );
}