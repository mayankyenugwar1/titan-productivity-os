import {
  ArrowRight,
  CheckCircle2,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

import TitanButton from "@/components/ui/TitanButton";
import TitanProgress from "@/components/ui/TitanProgress";

import {
  fadeUp,
  staggerContainer,
} from "@/animations/motion";

import { useHabitStore } from "@/store/habitStore";

export default function HeroBanner() {
  const user = "Mayank";

  const { habits, totalXP, streak } = useHabitStore();

  const completedToday = habits.filter(
    (habit) => habit.completed
  ).length;

  const progress =
    habits.length === 0
      ? 0
      : (completedToday / habits.length) * 100;

  const level = Math.floor(totalXP / 500) + 1;

  const completedHabits = habits.filter(
    (habit) => habit.completed
  );

  const pendingHabits = habits.filter(
    (habit) => !habit.completed
  );

  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="relative overflow-hidden rounded-[32px] border border-zinc-800 bg-gradient-to-br from-zinc-950 via-black to-zinc-900 p-10"
    >
      <div className="absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-yellow-400/5 blur-[120px]" />
      <div className="absolute -left-40 -bottom-40 h-[350px] w-[350px] rounded-full bg-yellow-500/5 blur-[120px]" />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative"
      >
        {/* Header */}

        <motion.div
          variants={fadeUp}
          className="flex items-center justify-between"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-yellow-400">
              Mission Control
            </p>

            <h1 className="mt-4 text-5xl font-black text-white">
              Welcome back,
              <span className="block text-yellow-400">
                {user}
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-lg text-zinc-400">
              Every disciplined action today compounds into
              tomorrow's success.
            </p>
          </div>

          <motion.div
            whileHover={{
              scale: 1.05,
              y: -4,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
            }}
            className="hidden lg:flex items-center gap-3 rounded-2xl border border-yellow-400/20 bg-yellow-400/10 px-5 py-3"
          >
            <Trophy className="h-5 w-5 text-yellow-400" />

            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                Level
              </p>

              <p className="text-2xl font-bold text-white">
                {level}
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Progress */}

        <motion.div
          variants={fadeUp}
          className="mt-10"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-400">
              Mission Progress
            </span>

            <span className="text-sm font-semibold text-yellow-400">
              {Math.round(progress)}%
            </span>
          </div>

          <TitanProgress value={progress} />
        </motion.div>

        {/* Bottom Grid */}

        <motion.div
          variants={fadeUp}
          className="mt-10 grid gap-8 lg:grid-cols-2"
        >
          {/* Objectives */}

          <div>
            <p className="mb-5 text-xs uppercase tracking-[0.35em] text-yellow-400">
              Today's Objectives
            </p>

            <div className="space-y-4">
              {completedHabits.map((habit) => (
                <motion.div
                  key={habit.id}
                  whileHover={{
                    x: 6,
                  }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="h-5 w-5 text-green-500" />

                  <span className="text-zinc-200">
                    {habit.title}
                  </span>
                </motion.div>
              ))}

              {pendingHabits.map((habit) => (
                <motion.div
                  key={habit.id}
                  whileHover={{
                    x: 6,
                  }}
                  className="flex items-center gap-3"
                >
                  <Target className="h-5 w-5 text-yellow-400" />

                  <span className="text-zinc-400">
                    {habit.title}
                  </span>
                </motion.div>
              ))}

              {habits.length === 0 && (
                <p className="text-zinc-500">
                  No missions created yet.
                </p>
              )}
            </div>
          </div>

          {/* Stats */}

          <div className="grid grid-cols-3 gap-4">
            {[
              {
                label: "XP",
                value: totalXP,
                icon: Zap,
              },
              {
                label: "Streak",
                value: streak,
                icon: Trophy,
              },
              {
                label: "Completed",
                value: `${completedToday}/${habits.length}`,
                icon: Target,
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.label}
                  whileHover={{
                    y: -8,
                    scale: 1.03,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 250,
                  }}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5"
                >
                  <Icon className="mb-3 h-5 w-5 text-yellow-400" />

                  <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                    {item.label}
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-white">
                    {item.value}
                  </h3>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Buttons */}

        <motion.div
          variants={fadeUp}
          className="mt-10 flex flex-wrap gap-4"
        >
          <TitanButton>
            Continue Mission
            <ArrowRight className="ml-2 h-5 w-5" />
          </TitanButton>

          <TitanButton variant="secondary">
            View Performance
          </TitanButton>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}