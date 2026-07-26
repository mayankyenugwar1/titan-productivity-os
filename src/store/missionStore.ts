import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";
import type { Habit, HabitCategory, HabitCompletion, HabitFrequency, HabitInput, HabitPriority, Weekday } from "@/features/missions/types";
import { sanitizeCategory } from "@/constants/categories";

type HabitRow = {
  id: string;
  title: string;
  description: string | null;
  category: HabitCategory;
  priority: HabitPriority;
  xp: number;
  frequency: HabitFrequency;
  weekly_days: Weekday[];
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
    return {
      id: row.id,
      title: row.title,
      description: row.description ?? undefined,
      category: sanitizeCategory(row.category),
      priority: row.priority,
      xp: row.xp,
      frequency: row.frequency,
      weeklyDays: row.weekly_days ?? [],
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

    const payload = {
      user_id: targetUserId,
      title: input.title.trim(),
      description: input.description?.trim() || null,
      category: validCategory,
      priority: validPriority,
      xp: validXP,
      frequency: validFrequency,
      weekly_days: validFrequency === "weekly" ? input.weeklyDays : [],
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

    const payload = {
      title: input.title.trim(),
      description: input.description?.trim() || null,
      category: validCategory,
      priority: validPriority,
      xp: validXP,
      frequency: validFrequency,
      weekly_days: validFrequency === "weekly" ? input.weeklyDays : [],
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

    set({ error: null });
    const targetUserId = ensureValidUUID(rawUserId);
    const isNowCompleted = !habit.completed;
    const today = toDateKey(new Date());

    // Optimistic UI state update
    const nextHabits = state.habits.map((item) =>
      item.id === habitId ? { ...item, completed: isNowCompleted } : item
    );
    const nextCompletedToday = nextHabits.filter((h) => h.completed).length;
    const xpDelta = isNowCompleted ? habit.xp : -habit.xp;
    const nextTotalXP = Math.max(0, state.totalXP + xpDelta);
    const nextFocusScore = nextHabits.length ? Math.round((nextCompletedToday / nextHabits.length) * 100) : 0;
    const nextLevel = Math.floor(nextTotalXP / 500) + 1;

    set({
      habits: nextHabits,
      totalXP: nextTotalXP,
      focusScore: nextFocusScore,
      lastCompletedMission: isNowCompleted
        ? {
            title: habit.title,
            xpEarned: habit.xp,
            newTotalXP: nextTotalXP,
            newLevel: nextLevel,
            streak: state.streak,
          }
        : null,
    });

    const { error } = isNowCompleted
      ? await supabase.from("habit_completions").insert({ habit_id: habitId, user_id: targetUserId, completed_on: today })
      : await supabase
          .from("habit_completions")
          .delete()
          .eq("habit_id", habitId)
          .eq("user_id", targetUserId)
          .eq("completed_on", today);

    if (error) {
      console.warn("Supabase completions toggle warning:", error.message);
    }

    return true;
  },

  deleteHabit: async (rawUserId, habitId) => {
    set({ error: null });
    const targetUserId = ensureValidUUID(rawUserId);

    const { error } = await supabase.from("habits").delete().eq("id", habitId).eq("user_id", targetUserId);
    if (error) {
      console.warn("Supabase delete fallback:", error.message);
      set((state) => ({
        habits: state.habits.filter((h) => h.id !== habitId),
      }));
      return true;
    }

    await get().loadHabits(targetUserId);
    return true;
  },

  subscribeRealtime: (rawUserId) => {
    const existingChannel = get().realtimeChannel;
    if (existingChannel) return;

    const targetUserId = ensureValidUUID(rawUserId);

    const channel = supabase
      .channel(`titan-realtime-${targetUserId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "habits", filter: `user_id=eq.${targetUserId}` },
        () => {
          void get().loadHabits(targetUserId);
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "habit_completions", filter: `user_id=eq.${targetUserId}` },
        () => {
          void get().loadHabits(targetUserId);
        }
      )
      .subscribe();

    set({ realtimeChannel: channel });
  },

  unsubscribeRealtime: () => {
    const channel = get().realtimeChannel;
    if (channel) {
      void supabase.removeChannel(channel);
      set({ realtimeChannel: null });
    }
  },

  clearCompletionModal: () => set({ lastCompletedMission: null }),

  clear: () => {
    get().unsubscribeRealtime();
    set({ habits: [], totalXP: 0, streak: 0, focusScore: 0, loading: false, error: null, lastCompletedMission: null });
  },
}));
