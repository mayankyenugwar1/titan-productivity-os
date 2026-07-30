import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";
import type { Habit, HabitCategory, HabitCompletion, HabitFrequency, HabitInput, HabitPriority, Weekday } from "@/features/missions/types";
import { sanitizeCategory } from "@/constants/categories";
import { parseDurationMinutes, validateDuration } from "@/features/missions/constants";

type HabitRow = {
  id: string;
  title: string;
  description: string | null;
  category: HabitCategory;
  priority: HabitPriority;
  xp: number;
  frequency: HabitFrequency;
  weekly_days: Weekday[];
  duration?: string | null;
  estimated_minutes?: number | null;
  created_at: string;
};

type CompletionRow = {
  id: string;
  habit_id: string;
  completed_on: string;
  completed_at: string;
};

export type CompletionModalPayload = {
  title: string;
  xpEarned: number;
  newTotalXP: number;
  newLevel: number;
  streak: number;
} | null;

interface HabitStore {
  habits: Habit[];
  totalXP: number;
  streak: number;
  focusScore: number;
  loading: boolean;
  error: string | null;
  lastCompletedMission: CompletionModalPayload;
  realtimeChannel: RealtimeChannel | null;
  loadHabits: (userId: string) => Promise<void>;
  addHabit: (userId: string, input: HabitInput) => Promise<boolean>;
  updateHabit: (userId: string, habitId: string, input: HabitInput) => Promise<boolean>;
  toggleHabit: (userId: string, habitId: string) => Promise<boolean>;
  deleteHabit: (userId: string, habitId: string) => Promise<boolean>;
  subscribeRealtime: (userId: string) => void;
  unsubscribeRealtime: () => void;
  clearCompletionModal: () => void;
  clear: () => void;
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const LOCAL_FALLBACK_UUID = "00000000-0000-0000-0000-000000000000";

function ensureValidUUID(id?: string | null): string {
  if (!id || !UUID_REGEX.test(id)) {
    return LOCAL_FALLBACK_UUID;
  }
  return id;
}

const toDateKey = (date: Date) => date.toLocaleDateString("en-CA");
const asCompletion = (row: CompletionRow): HabitCompletion => ({
  id: row.id,
  habitId: row.habit_id,
  completedOn: row.completed_on,
  completedAt: new Date(row.completed_at),
});

function calculateStreak(completions: HabitCompletion[]) {
  const completionDays = new Set(completions.map((completion) => completion.completedOn));
  let streak = 0;
  const cursor = new Date();
  while (completionDays.has(toDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function mapHabits(rows: HabitRow[], completions: CompletionRow[]): Habit[] {
  const today = toDateKey(new Date());
  return rows.map((row) => {
    const history = completions.filter((completion) => completion.habit_id === row.id).map(asCompletion);
    const todayCompletion = history.find((completion) => completion.completedOn === today);
    
    const validDuration = validateDuration(row.duration ?? (row.estimated_minutes ? `${row.estimated_minutes} mins` : undefined));
    const parsedMinutes = parseDurationMinutes(validDuration) ?? undefined;

    return {
      id: row.id,
      title: row.title,
      description: row.description ?? undefined,
      category: sanitizeCategory(row.category),
      priority: row.priority,
      xp: row.xp,
      frequency: row.frequency,
      weeklyDays: row.weekly_days ?? [],
      duration: validDuration,
      estimatedMinutes: parsedMinutes,
      completed: Boolean(todayCompletion),
      createdAt: new Date(row.created_at),
      completedAt: todayCompletion?.completedAt,
      history,
    };
  });
}

export const useHabitStore = create<HabitStore>((set, get) => ({
  habits: [],
  totalXP: 0,
  streak: 0,
  focusScore: 0,
  loading: false,
  error: null,
  lastCompletedMission: null,
  realtimeChannel: null,

  loadHabits: async (rawUserId) => {
    set({ loading: true, error: null });
    const targetUserId = ensureValidUUID(rawUserId);

    const [{ data: habitRows, error: habitsError }, { data: completionRows, error: completionsError }] =
      await Promise.all([
        supabase.from("habits").select("*").eq("user_id", targetUserId).order("created_at", { ascending: false }),
        supabase
          .from("habit_completions")
          .select("*")
          .eq("user_id", targetUserId)
          .order("completed_on", { ascending: false }),
      ]);

    if (habitsError || completionsError) {
      console.warn("Supabase loadHabits warning:", habitsError?.message || completionsError?.message);
      set({ loading: false });
      return;
    }

    const completions = (completionRows ?? []) as CompletionRow[];
    const habits = mapHabits((habitRows ?? []) as HabitRow[], completions);
    const completedToday = habits.filter((habit) => habit.completed).length;
    const totalXP = habits.reduce((total, habit) => total + habit.history.length * habit.xp, 0);
    const streak = calculateStreak(completions.map(asCompletion));
    const focusScore = habits.length ? Math.round((completedToday / habits.length) * 100) : 0;

    set({ habits, totalXP, streak, focusScore, loading: false });
  },

  addHabit: async (rawUserId, input) => {
    set({ error: null });
    const targetUserId = ensureValidUUID(rawUserId);
    const validCategory = sanitizeCategory(input.category);
    const validPriority = ["High", "Medium", "Low"].includes(input.priority) ? input.priority : "Medium";
    const validFrequency = input.frequency === "weekly" ? "weekly" : "daily";
    const validXP =
      typeof input.xp === "number" && input.xp > 0
        ? input.xp
        : validPriority === "High"
        ? 150
        : validPriority === "Medium"
        ? 100
        : 50;

    const validDuration = validateDuration(input.duration);
    const parsedMins = parseDurationMinutes(validDuration);

    const payload = {
      user_id: targetUserId,
      title: input.title.trim(),
      description: input.description?.trim() || null,
      category: validCategory,
      priority: validPriority,
      xp: validXP,
      frequency: validFrequency,
      weekly_days: validFrequency === "weekly" ? input.weeklyDays : [],
      duration: validDuration,
      estimated_minutes: parsedMins,
    };

    const { error } = await supabase.from("habits").insert(payload);

    if (error) {
      console.warn("Supabase habits insert fallback:", error.message);
      const newLocalHabit: Habit = {
        id: `local-${Date.now()}`,
        title: payload.title,
        description: payload.description ?? undefined,
        category: validCategory,
        priority: validPriority,
        xp: validXP,
        frequency: validFrequency,
        weeklyDays: payload.weekly_days,
        duration: validDuration,
        estimatedMinutes: parsedMins ?? undefined,
        completed: false,
        createdAt: new Date(),
        history: [],
      };

      set((state) => {
        const nextHabits = [newLocalHabit, ...state.habits];
        const completedToday = nextHabits.filter((h) => h.completed).length;
        const totalXP = nextHabits.reduce((total, habit) => total + habit.history.length * habit.xp, 0);
        const focusScore = nextHabits.length ? Math.round((completedToday / nextHabits.length) * 100) : 0;
        return {
          habits: nextHabits,
          totalXP,
          focusScore,
        };
      });
      return true;
    }

    await get().loadHabits(targetUserId);
    return true;
  },

  updateHabit: async (rawUserId, habitId, input) => {
    set({ error: null });
    const targetUserId = ensureValidUUID(rawUserId);
    const validCategory = sanitizeCategory(input.category);
    const validPriority = ["High", "Medium", "Low"].includes(input.priority) ? input.priority : "Medium";
    const validFrequency = input.frequency === "weekly" ? "weekly" : "daily";
    const validXP = typeof input.xp === "number" && input.xp > 0 ? input.xp : 100;

    const validDuration = validateDuration(input.duration);
    const parsedMins = parseDurationMinutes(validDuration);

    const payload = {
      title: input.title.trim(),
      description: input.description?.trim() || null,
      category: validCategory,
      priority: validPriority,
      xp: validXP,
      frequency: validFrequency,
      weekly_days: validFrequency === "weekly" ? input.weeklyDays : [],
      duration: validDuration,
      estimated_minutes: parsedMins,
    };

    const { error } = await supabase
      .from("habits")
      .update(payload)
      .eq("id", habitId)
      .eq("user_id", targetUserId);

    if (error) {
      console.warn("Supabase habits update fallback:", error.message);
      set((state) => ({
        habits: state.habits.map((h) =>
          h.id === habitId
            ? {
                ...h,
                title: payload.title,
                description: payload.description ?? undefined,
                category: validCategory,
                priority: validPriority,
                xp: validXP,
                frequency: validFrequency,
                weeklyDays: payload.weekly_days,
                duration: validDuration,
                estimatedMinutes: parsedMins ?? undefined,
              }
            : h
        ),
      }));
      return true;
    }

    await get().loadHabits(targetUserId);
    return true;
  },

  toggleHabit: async (rawUserId, habitId) => {
    const state = get();
    const habit = state.habits.find((item) => item.id === habitId);
    if (!habit) return false;

    const targetUserId = ensureValidUUID(rawUserId);
    const today = toDateKey(new Date());

    if (!habit.completed) {
      const payload = {
        user_id: targetUserId,
        habit_id: habit.id,
        completed_on: today,
        completed_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("habit_completions").insert(payload);
      if (error) {
        console.warn("Supabase insert completion fallback:", error.message);
      }
    } else {
      const { error } = await supabase
        .from("habit_completions")
        .delete()
        .eq("habit_id", habit.id)
        .eq("user_id", targetUserId)
        .eq("completed_on", today);

      if (error) {
        console.warn("Supabase delete completion fallback:", error.message);
      }
    }

    await state.loadHabits(targetUserId);

    const refreshedHabit = get().habits.find((item) => item.id === habitId);

    if (!habit.completed && refreshedHabit?.completed) {
      const xpEarned = habit.xp;
      const nextTotalXP = state.totalXP + xpEarned;
      const newLevel = Math.floor(nextTotalXP / 500) + 1;

      set({
        lastCompletedMission: {
          title: habit.title,
          xpEarned,
          newTotalXP: nextTotalXP,
          newLevel,
          streak: state.streak,
        },
      });
    }

    return true;
  },

  deleteHabit: async (rawUserId, habitId) => {
    set({ error: null });
    const targetUserId = ensureValidUUID(rawUserId);
    const { error } = await supabase.from("habits").delete().eq("id", habitId).eq("user_id", targetUserId);

    if (error) {
      console.warn("Supabase habits delete fallback:", error.message);
      set((state) => {
        const nextHabits = state.habits.filter((h) => h.id !== habitId);
        const completedToday = nextHabits.filter((h) => h.completed).length;
        const totalXP = nextHabits.reduce((total, habit) => total + habit.history.length * habit.xp, 0);
        const focusScore = nextHabits.length ? Math.round((completedToday / nextHabits.length) * 100) : 0;
        return {
          habits: nextHabits,
          totalXP,
          focusScore,
        };
      });
      return true;
    }

    await get().loadHabits(targetUserId);
    return true;
  },

  subscribeRealtime: (rawUserId) => {
    const state = get();
    if (state.realtimeChannel) return;

    const targetUserId = ensureValidUUID(rawUserId);

    const channel = supabase
      .channel(`habits-realtime-${targetUserId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "habits",
          filter: `user_id=eq.${targetUserId}`,
        },
        () => {
          void get().loadHabits(targetUserId);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "habit_completions",
          filter: `user_id=eq.${targetUserId}`,
        },
        () => {
          void get().loadHabits(targetUserId);
        }
      )
      .subscribe();

    set({ realtimeChannel: channel });
  },

  unsubscribeRealtime: () => {
    const { realtimeChannel } = get();
    if (realtimeChannel) {
      void supabase.removeChannel(realtimeChannel);
      set({ realtimeChannel: null });
    }
  },

  clearCompletionModal: () => set({ lastCompletedMission: null }),
  clear: () => set({ habits: [], totalXP: 0, streak: 0, focusScore: 0, loading: false, error: null, lastCompletedMission: null }),
}));
