import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";
import type { Habit, HabitCategory, HabitCompletion, HabitFrequency, HabitInput, HabitPriority, Weekday } from "@/features/missions/types";
import { sanitizeCategory } from "@/constants/categories";
import { parseDurationMinutes, validateDuration } from "@/features/missions/constants";
import { safeDate, safeDateKey, safeISOString } from "@/utils/safeDate";

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
const STORAGE_KEY = "titan_local_habits";

function ensureValidUUID(id?: string | null): string {
  if (!id || !UUID_REGEX.test(id)) {
    return LOCAL_FALLBACK_UUID;
  }
  return id;
}

function getLocalStoredHabits(): Habit[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) return [];

    return parsed.map((h: any) => ({
      ...h,
      createdAt: safeDate(h?.createdAt, "localStorage.habit.createdAt") ?? new Date(),
      completedAt: safeDate(h?.completedAt, "localStorage.habit.completedAt") ?? undefined,
      history: Array.isArray(h?.history)
        ? h.history.map((c: any) => ({
            ...c,
            completedOn: c?.completedOn || safeDateKey(c?.completedAt, safeDateKey(new Date())),
            completedAt: safeDate(c?.completedAt, "localStorage.completion.completedAt") ?? new Date(),
          }))
        : [],
    }));
  } catch (err) {
    console.warn("Failed to read local habits:", err);
    return [];
  }
}

function setLocalStoredHabits(habits: Habit[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  } catch (err) {
    console.warn("Failed to save local habits:", err);
  }
}

const asCompletion = (row: CompletionRow): HabitCompletion => {
  const validCompletedAt = safeDate(row.completed_at, "Supabase.habit_completions.completed_at");
  const fallbackKey = safeDateKey(new Date());
  const validCompletedOn = row.completed_on && row.completed_on.trim() !== ""
    ? row.completed_on
    : (validCompletedAt ? safeDateKey(validCompletedAt, fallbackKey) : fallbackKey);

  return {
    id: row.id,
    habitId: row.habit_id,
    completedOn: validCompletedOn,
    completedAt: validCompletedAt ?? new Date(),
  };
};

function calculateStreak(completions: HabitCompletion[]): number {
  const completionDays = new Set(
    (completions || [])
      .map((c) => c.completedOn)
      .filter((day) => Boolean(day) && day.trim() !== "" && day !== "—" && day !== "No Date")
  );

  let streak = 0;
  const cursor = new Date();
  let iterations = 0;
  const maxDays = 3650; // 10 years maximum lookback safeguard

  while (iterations < maxDays) {
    const key = safeDateKey(cursor, "INVALID_KEY");
    if (key === "INVALID_KEY" || key === "" || !completionDays.has(key)) {
      break;
    }
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
    iterations += 1;
  }

  return streak;
}

function mapHabits(rows: HabitRow[], completions: CompletionRow[]): Habit[] {
  const today = safeDateKey(new Date());
  return (rows || []).map((row) => {
    const history = (completions || [])
      .filter((completion) => completion && completion.habit_id === row.id)
      .map(asCompletion);

    const todayCompletion = history.find((completion) => completion.completedOn === today);
    
    const validDuration = validateDuration(row.duration ?? (row.estimated_minutes ? `${row.estimated_minutes} mins` : undefined));
    const parsedMinutes = parseDurationMinutes(validDuration) ?? undefined;

    return {
      id: row.id,
      title: row.title || "Untitled Mission",
      description: row.description ?? undefined,
      category: sanitizeCategory(row.category),
      priority: row.priority || "Medium",
      xp: typeof row.xp === "number" && row.xp > 0 ? row.xp : 100,
      frequency: row.frequency || "daily",
      weeklyDays: Array.isArray(row.weekly_days) ? row.weekly_days : [],
      duration: validDuration,
      estimatedMinutes: parsedMinutes,
      completed: Boolean(todayCompletion),
      createdAt: safeDate(row.created_at, "Supabase.habits.created_at") ?? new Date(),
      completedAt: todayCompletion?.completedAt,
      history,
    };
  });
}

export const useHabitStore = create<HabitStore>((set, get) => ({
  habits: getLocalStoredHabits(),
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

    let remoteHabits: Habit[] = [];
    let completions: CompletionRow[] = [];

    try {
      const [{ data: habitRows }, { data: completionRows }] = await Promise.all([
        supabase.from("habits").select("*").eq("user_id", targetUserId).order("created_at", { ascending: false }),
        supabase.from("habit_completions").select("*").eq("user_id", targetUserId).order("completed_on", { ascending: false }),
      ]);

      completions = (completionRows ?? []) as CompletionRow[];
      remoteHabits = mapHabits((habitRows ?? []) as HabitRow[], completions);
    } catch (err) {
      console.warn("Supabase loadHabits warning:", err);
    }

    const localHabits = getLocalStoredHabits();

    // Merge remote and local habits by ID
    const mergedMap = new Map<string, Habit>();
    localHabits.forEach((h) => mergedMap.set(h.id, h));
    remoteHabits.forEach((h) => mergedMap.set(h.id, h));

    const habits = Array.from(mergedMap.values());
    setLocalStoredHabits(habits);

    const completedToday = habits.filter((habit) => habit.completed).length;
    const totalXP = habits.reduce((total, habit) => total + (Array.isArray(habit.history) ? habit.history.length : 0) * habit.xp, 0);
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

    const newHabit: Habit = {
      id: `mission-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: input.title.trim(),
      description: input.description?.trim() || undefined,
      category: validCategory,
      priority: validPriority,
      xp: validXP,
      frequency: validFrequency,
      weeklyDays: validFrequency === "weekly" ? input.weeklyDays : [],
      duration: validDuration,
      estimatedMinutes: parsedMins ?? undefined,
      completed: false,
      createdAt: new Date(),
      history: [],
    };

    // 1. Instantly update local state & localStorage
    set((state) => {
      const nextHabits = [newHabit, ...state.habits.filter((h) => h.id !== newHabit.id)];
      setLocalStoredHabits(nextHabits);
      const completedToday = nextHabits.filter((h) => h.completed).length;
      const totalXP = nextHabits.reduce((total, habit) => total + (Array.isArray(habit.history) ? habit.history.length : 0) * habit.xp, 0);
      const focusScore = nextHabits.length ? Math.round((completedToday / nextHabits.length) * 100) : 0;
      return { habits: nextHabits, totalXP, focusScore };
    });

    // 2. Insert into Supabase in background
    if (targetUserId !== LOCAL_FALLBACK_UUID) {
      const payload = {
        user_id: targetUserId,
        title: newHabit.title,
        description: newHabit.description ?? null,
        category: validCategory,
        priority: validPriority,
        xp: validXP,
        frequency: validFrequency,
        weekly_days: newHabit.weeklyDays,
        duration: validDuration,
        estimated_minutes: parsedMins,
      };

      try {
        const { error } = await supabase.from("habits").insert(payload);
        if (error) {
          console.warn("Primary Supabase insert failed, attempting schema fallback:", error);
          const fallbackPayload = {
            user_id: targetUserId,
            title: newHabit.title,
            description: newHabit.description ?? null,
            category: validCategory,
            priority: validPriority,
            xp: validXP,
            frequency: validFrequency,
            weekly_days: newHabit.weeklyDays,
          };
          await supabase.from("habits").insert(fallbackPayload);
        }
      } catch (err) {
        console.warn("Supabase background insert warning:", err);
      }
    }

    return true;
  },

  updateHabit: async (rawUserId, habitId, input) => {
    set({ error: null });
    const targetUserId = ensureValidUUID(rawUserId);
    const validCategory = sanitizeCategory(input.category);
    const validPriority = ["High", "Medium", "Low"].includes(input.priority) ? input.priority : "Medium";
    const validFrequency: HabitFrequency = input.frequency === "weekly" ? "weekly" : "daily";
    const validXP = typeof input.xp === "number" && input.xp > 0 ? input.xp : 100;

    const validDuration = validateDuration(input.duration);
    const parsedMins = parseDurationMinutes(validDuration);

    set((state) => {
      const nextHabits = state.habits.map((h) =>
        h.id === habitId
          ? {
              ...h,
              title: input.title.trim(),
              description: input.description?.trim() || undefined,
              category: validCategory,
              priority: validPriority,
              xp: validXP,
              frequency: validFrequency,
              weeklyDays: validFrequency === "weekly" ? input.weeklyDays : [],
              duration: validDuration,
              estimatedMinutes: parsedMins ?? undefined,
            }
          : h
      );
      setLocalStoredHabits(nextHabits);
      const completedToday = nextHabits.filter((h) => h.completed).length;
      const totalXP = nextHabits.reduce((total, habit) => total + (Array.isArray(habit.history) ? habit.history.length : 0) * habit.xp, 0);
      const focusScore = nextHabits.length ? Math.round((completedToday / nextHabits.length) * 100) : 0;
      return { habits: nextHabits, totalXP, focusScore };
    });

    if (targetUserId !== LOCAL_FALLBACK_UUID) {
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

      try {
        const { error } = await supabase.from("habits").update(payload).eq("id", habitId).eq("user_id", targetUserId);
        if (error) {
          const fallbackPayload = {
            title: input.title.trim(),
            description: input.description?.trim() || null,
            category: validCategory,
            priority: validPriority,
            xp: validXP,
            frequency: validFrequency,
            weekly_days: validFrequency === "weekly" ? input.weeklyDays : [],
          };
          await supabase.from("habits").update(fallbackPayload).eq("id", habitId).eq("user_id", targetUserId);
        }
      } catch (err) {
        console.warn("Supabase background update warning:", err);
      }
    }

    return true;
  },

  toggleHabit: async (rawUserId, habitId) => {
    const state = get();
    const habit = state.habits.find((item) => item.id === habitId);
    if (!habit) return false;

    const targetUserId = ensureValidUUID(rawUserId);
    const today = safeDateKey(new Date());

    const nextCompleted = !habit.completed;
    const now = new Date();

    set((s) => {
      const nextHabits = s.habits.map((h) => {
        if (h.id !== habitId) return h;
        const currentHistory = Array.isArray(h.history) ? h.history : [];
        const newHistory = nextCompleted
          ? [{ id: `comp-${Date.now()}`, habitId, completedOn: today, completedAt: now }, ...currentHistory]
          : currentHistory.filter((c) => c.completedOn !== today);
        return { ...h, completed: nextCompleted, completedAt: nextCompleted ? now : undefined, history: newHistory };
      });
      setLocalStoredHabits(nextHabits);

      const completedToday = nextHabits.filter((h) => h.completed).length;
      const totalXP = nextHabits.reduce((total, item) => total + (Array.isArray(item.history) ? item.history.length : 0) * item.xp, 0);
      const focusScore = nextHabits.length ? Math.round((completedToday / nextHabits.length) * 100) : 0;

      return { habits: nextHabits, totalXP, focusScore };
    });

    if (targetUserId !== LOCAL_FALLBACK_UUID) {
      if (nextCompleted) {
        const payload = {
          user_id: targetUserId,
          habit_id: habit.id,
          completed_on: today,
          completed_at: safeISOString(now),
        };
        try {
          await supabase.from("habit_completions").insert(payload);
        } catch (err) {
          console.warn("Supabase insert completion fallback:", err);
        }
      } else {
        try {
          await supabase
            .from("habit_completions")
            .delete()
            .eq("habit_id", habit.id)
            .eq("user_id", targetUserId)
            .eq("completed_on", today);
        } catch (err) {
          console.warn("Supabase delete completion fallback:", err);
        }
      }
    }

    return true;
  },

  deleteHabit: async (rawUserId, habitId) => {
    set({ error: null });
    const targetUserId = ensureValidUUID(rawUserId);

    set((state) => {
      const nextHabits = state.habits.filter((h) => h.id !== habitId);
      setLocalStoredHabits(nextHabits);
      const completedToday = nextHabits.filter((h) => h.completed).length;
      const totalXP = nextHabits.reduce((total, habit) => total + (Array.isArray(habit.history) ? habit.history.length : 0) * habit.xp, 0);
      const focusScore = nextHabits.length ? Math.round((completedToday / nextHabits.length) * 100) : 0;
      return { habits: nextHabits, totalXP, focusScore };
    });

    if (targetUserId !== LOCAL_FALLBACK_UUID) {
      try {
        await supabase.from("habits").delete().eq("id", habitId).eq("user_id", targetUserId);
      } catch (err) {
        console.warn("Supabase habits delete warning:", err);
      }
    }

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
