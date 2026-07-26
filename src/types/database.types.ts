import type { HabitCategory, HabitPriority, HabitFrequency } from "@/features/missions/types";

export interface DatabaseSchema {
  public: {
    Tables: {
      habits: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          category: HabitCategory;
          priority: HabitPriority;
          xp: number;
          frequency: HabitFrequency;
          weekly_days: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          category: HabitCategory;
          priority: HabitPriority;
          xp: number;
          frequency: HabitFrequency;
          weekly_days?: string[];
          created_at?: string;
        };
        Update: {
          title?: string;
          description?: string | null;
          category?: HabitCategory;
          priority?: HabitPriority;
          xp?: number;
          frequency?: HabitFrequency;
          weekly_days?: string[];
        };
      };
      habit_completions: {
        Row: {
          id: string;
          habit_id: string;
          user_id: string;
          completed_on: string;
          completed_at: string;
        };
        Insert: {
          id?: string;
          habit_id: string;
          user_id: string;
          completed_on: string;
          completed_at?: string;
        };
      };
    };
  };
}
