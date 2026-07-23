import {
  Award,
  CheckCircle2,
  Flame,
  TrendingUp,
} from "lucide-react";

import { useHabitStore } from "@/store/habitStore";

export default function StatsCards() {
  const {
    habits,
    totalXP,
    streak,
    focusScore,
  } = useHabitStore();

  const completedToday = habits.filter(
    (habit) => habit.completed
  ).length;

  const totalMissions = habits.length;

  const activeMissions = habits.filter(
    (habit) => !habit.completed
  ).length;

  const level = Math.floor(totalXP / 500) + 1;

  const xpToNextLevel = 500 - (totalXP % 500);

  const stats = [
    {
      title: "LEVEL",
      value: level,
      subtitle: `${xpToNextLevel} XP to next level`,
      icon: Award,
    },
    {
      title: "TOTAL XP",
      value: totalXP,
      subtitle: `${completedToday} mission${
        completedToday !== 1 ? "s" : ""
      } completed today`,
      icon: TrendingUp,
    },
    {
      title: "STREAK",
      value: `${streak} Days`,
      subtitle: "Keep the momentum alive",
      icon: Flame,
    },
    {
      title: "ACTIVE MISSIONS",
      value: `${activeMissions}/${totalMissions}`,
      subtitle:
        activeMissions === 0
          ? "All missions completed 🎉"
          : "Ready for action",
      icon: CheckCircle2,
    },
    {
      title: "FOCUS SCORE",
      value: `${focusScore}%`,
      subtitle:
        focusScore >= 90
          ? "Excellent Focus"
          : focusScore >= 75
          ? "Good Progress"
          : "Needs Improvement",
      icon: Award,
    },
  ];

  return (
    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="
              group
              relative
              overflow-hidden
              rounded-3xl
              border
              border-zinc-800
              bg-zinc-900/60
              p-6
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-yellow-400/30
              hover:shadow-[0_0_30px_rgba(250,204,21,0.08)]
            "
          >
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-yellow-400/5 blur-3xl transition-all duration-300 group-hover:bg-yellow-400/10" />

            <div className="relative">
              <div className="flex items-center justify-between">
                <span className="text-xs tracking-[0.3em] text-zinc-500">
                  {stat.title}
                </span>

                <div className="rounded-xl border border-yellow-400/20 bg-yellow-400/10 p-2">
                  <Icon className="h-5 w-5 text-yellow-400 transition-transform duration-300 group-hover:scale-110" />
                </div>
              </div>

              <h2 className="mt-6 text-4xl font-black text-white">
                {stat.value}
              </h2>

              <p className="mt-3 text-sm text-zinc-500">
                {stat.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </section>
  );
}