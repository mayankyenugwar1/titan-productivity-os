import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Activity, Crosshair, Flame, History, Plus, Shield, Star } from "lucide-react";

import MissionCard from "@/features/missions/components/MissionCard";
import MissionModal from "@/features/missions/components/MissionModal";
import type { Habit, HabitCompletion, HabitInput, Weekday } from "@/features/missions/types";
import { useAuth } from "@/context/AuthContext";
import { useHabitStore } from "@/store/missionStore";
import { EmptyState, LoadingState, TitanBadge, TitanButton, TitanCard } from "@/components/ui";
import { safeDate, safeDateString, safeFormat } from "@/utils/safeDate";

const weekday = safeFormat(new Date(), { weekday: "long" }, "Monday").toLowerCase() as Weekday;

export default function MissionControlPage() {
  const { user } = useAuth();
  const { habits, addHabit, updateHabit, toggleHabit, deleteHabit, totalXP, streak, loading, error, loadHabits } = useHabitStore();
  const [open, setOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const userId = user?.id || "local_user";

  useEffect(() => {
    void loadHabits(userId);
  }, [loadHabits, userId]);

  const todaysHabits = useMemo(() => (habits || []).filter((habit: Habit) => habit.frequency === "daily" || habit.weeklyDays.includes(weekday)), [habits]);
  const completed = todaysHabits.filter((habit: Habit) => habit.completed).length;
  const completionRate = todaysHabits.length ? Math.round((completed / todaysHabits.length) * 100) : 0;
  const history = useMemo(
    () =>
      (habits || [])
        .flatMap((habit: Habit) =>
          (habit.history || []).map((completion: HabitCompletion) => {
            const d = safeDate(completion.completedAt);
            return {
              ...completion,
              title: habit.title,
              xp: habit.xp,
              timestamp: d ? d.getTime() : 0,
            };
          })
        )
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 12),
    [habits]
  );

  const submit = async (input: HabitInput) => {
    if (editingHabit) {
      return updateHabit(userId, editingHabit.id, input);
    }
    return addHabit(userId, input);
  };

  const edit = (habit: Habit) => {
    setEditingHabit(habit);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setEditingHabit(null);
  };

  if (loading && habits.length === 0) {
    return <LoadingState message="Initialising mission directives..." />;
  }

  return (
    <div className="space-[#070708] space-y-8 font-sans">
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-yellow-500/20 bg-gradient-to-r from-yellow-500/10 via-zinc-950 to-zinc-950 p-7 lg:flex-row lg:items-center">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.25em] text-yellow-400">
            <Shield className="size-4" /> Tactical Operations Console
          </div>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">Mission Control</h1>
          <p className="mt-2 text-sm font-medium text-zinc-400">
            Execute tactical directives, acquire experience, and maintain operational discipline.
          </p>
        </div>
        <TitanButton size="lg" leftIcon={<Plus className="size-5" />} onClick={() => setOpen(true)}>
          Deploy New Mission
        </TitanButton>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300 font-mono">
          [TELEMETRY ALERT]: {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 font-mono">
        <MetricTile icon={<Crosshair className="size-5 text-yellow-400" />} label="Active Directives" value={todaysHabits.length} sub={`${completed} completed today`} />
        <MetricTile icon={<Activity className="size-5 text-yellow-400" />} label="Execution Rate" value={`${completionRate}%`} sub="Daily tactical score" />
        <MetricTile icon={<Star className="size-5 text-yellow-400" />} label="Total XP Earned" value={totalXP.toLocaleString()} sub="Lifetime experience" />
        <MetricTile icon={<Flame className="size-5 text-yellow-400" />} label="Combat Streak" value={`${streak} Days`} sub="Unbroken operational chain" />
      </div>

      <div>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[#e5c158] font-mono">Daily Directives</h2>
            <p className="mt-0.5 text-xs text-zinc-400">Scheduled operations for current cycle</p>
          </div>
          <TitanBadge variant="gold" size="sm" className="font-mono">
            {todaysHabits.length} ACTIVE
          </TitanBadge>
        </div>

        {todaysHabits.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {todaysHabits.map((habit: Habit) => (
              <MissionCard
                key={habit.id}
                habit={habit}
                onToggle={() => toggleHabit(userId, habit.id)}
                onEdit={() => edit(habit)}
                onDelete={() => deleteHabit(userId, habit.id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Directives Scheduled"
            description="No active missions assigned for today's operational window."
            actionText="Deploy First Mission"
            onAction={() => setOpen(true)}
          />
        )}
      </div>

      <TitanCard variant="default" padding="md">
        <div className="flex items-center gap-4 font-mono">
          <div className="flex size-11 items-center justify-center rounded-2xl border border-yellow-400/20 bg-yellow-400/[0.08]">
            <History className="size-5 text-yellow-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-yellow-400">Classified records</p>
            <h2 className="mt-1 text-2xl font-bold text-zinc-100 font-sans">Mission Log</h2>
          </div>
        </div>

        {history.length ? (
          <div className="mt-7 divide-y divide-zinc-800/80">
            {history.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4 py-4 font-mono">
                <div>
                  <p className="font-semibold text-zinc-200 font-sans">{item.title}</p>
                  <p className="mt-1 text-xs text-zinc-500">
                    Mission Complete · {safeDateString(item.completedAt, { month: "short", day: "numeric" })}
                  </p>
                </div>
                <TitanBadge variant="gold" glow>
                  +{item.xp} XP
                </TitanBadge>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-7 text-sm text-zinc-500 font-mono">Completed mission records will be secured here.</p>
        )}
      </TitanCard>

      <MissionModal open={open} habit={editingHabit} onClose={closeModal} onSubmit={submit} />
    </div>
  );
}

function MetricTile({ icon, label, value, sub }: { icon: ReactNode; label: string; value: string | number; sub: string }) {
  return (
    <TitanCard variant="callout" padding="sm" className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">{label}</span>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-black text-white">{value}</p>
        <p className="mt-1 text-[11px] text-zinc-500">{sub}</p>
      </div>
    </TitanCard>
  );
}
