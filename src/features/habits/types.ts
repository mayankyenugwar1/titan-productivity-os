export type HabitCategory =
  | "Fitness"
  | "Study"
  | "Coding"
  | "Reading"
  | "Health"
  | "Mindfulness"
  | "Finance"
  | "Personal";

export type HabitPriority =
  | "Low"
  | "Medium"
  | "High";

export interface Habit {
  id: string;

  title: string;

  description?: string;

  category: HabitCategory;

  priority: HabitPriority;

  xp: number;

  completed: boolean;

  createdAt: Date;

  completedAt?: Date;
}