import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
  Habit,
  HabitCategory,
  HabitPriority,
} from "@/features/habits/types";

interface HabitStore {
  habits: Habit[];
  totalXP: number;
  streak: number;
  focusScore: number;

  addHabit: (
    title: string,
    xp: number,
    category: HabitCategory,
    priority: HabitPriority,
    description?: string
  ) => void;

  toggleHabit: (id: string) => void;

  deleteHabit: (id: string) => void;
}

export const useHabitStore = create<HabitStore>()(
  persist(
    (set) => ({
      habits: [
        {
          id: crypto.randomUUID(),
          title: "Morning Workout",
          description: "Chest + Cardio",
          category: "Fitness",
          priority: "High",
          xp: 100,
          completed: false,
          createdAt: new Date(),
        },
        {
          id: crypto.randomUUID(),
          title: "Read 20 Pages",
          category: "Reading",
          priority: "Medium",
          xp: 50,
          completed: false,
          createdAt: new Date(),
        },
      ],

      totalXP: 0,

      streak: 1,

      focusScore: 100,

      addHabit: (
        title,
        xp,
        category,
        priority,
        description
      ) =>
        set((state) => ({
          habits: [
            ...state.habits,
            {
              id: crypto.randomUUID(),
              title,
              description,
              category,
              priority,
              xp,
              completed: false,
              createdAt: new Date(),
            },
          ],
        })),

      toggleHabit: (id) =>
        set((state) => {
          let gainedXP = 0;

          const habits = state.habits.map((habit) => {
            if (habit.id !== id) return habit;

            if (!habit.completed) {
              gainedXP = habit.xp;
            }

            return {
              ...habit,
              completed: !habit.completed,
              completedAt: !habit.completed
                ? new Date()
                : undefined,
            };
          });

          return {
            habits,
            totalXP: state.totalXP + gainedXP,
          };
        }),

      deleteHabit: (id) =>
        set((state) => ({
          habits: state.habits.filter(
            (habit) => habit.id !== id
          ),
        })),
    }),
    {
      name: "titan-productivity-storage",
    }
  )
);