import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Activity, Crosshair, Flame, History, Plus, Shield, Star } from "lucide-react";

import MissionCard from "@/features/missions/components/MissionCard";
import MissionModal from "@/features/missions/components/MissionModal";
import type { Habit, HabitCompletion, HabitInput, Weekday } from "@/features/missions/types";
import { useAuth } from "@/context/AuthContext";
import { useHabitStore } from "@/store/missionStore";
import { EmptyState, LoadingState, TitanBadge, TitanButton, TitanCard } from "@/components/ui";

const weekday = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(new Date()).toLowerCase() as Weekday;
const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

export default function MissionControlPage() {
  const { user } = useAuth();
  const { habits, addHabit, updateHabit, toggleHabit, deleteHabit, totalXP, streak, loading, error, loadHabits } = useHabitStore();
  const [open, setOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const userId = user?.id || "local_user";

  useEffect(() => {
    void loadHabits(userId);
  }, [loadHabits, userId]);

  const todaysHabits = useMemo(() => habits.filter((habit: Habit) => habit.frequency === "daily" || habit.weeklyDays.includes(weekday)), [habits]);
  const completed = todaysHabits.filter((habit: Habit) => habit.completed).length;
  const completionRate = todaysHabits.length ? Math.round((completed / todaysHabits.length) * 100) : 0;
  const history = useMemo(
    () =>
      habits
        .flatMap((habit: Habit) => habit.history.map((completion: HabitCompletion) => ({ ...completion, title: habit.title, xp: habit.xp })))
        .sort((a: { completedAt: Date }, b: { completedAt: Date }) => b.completedAt.getTime() - a.completedAt.getTime())
        .slice(0, 12),
    [habits]
  );

  const submit = async (input: HabitInput) => {
    if (editingHabit) {
      return updateHabit(userId, editingHabit.id, input);
    }
    return addHabit(userId, input);
  };

  const closeModal = () => {
    setOpen(false);
    setEditingHabit(null);
  };

  const editHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setOpen(true);
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Hero Section */}
      <TitanCard variant="hero" padding="lg">
        <div className="absolute -right-24 -top-20 size-72 rounded-full bg-yellow-400/[0.055] blur-[100px]" />
        <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-yellow-400/60 to-transparent" />
        <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 text-yellow-400">
              <Shield className="size-5" />
              <p className="text-xs font-bold uppercase tracking-[0.38em]">TITAN // Command sector</p>
            </div>
            <h1 className="mt-5 text-4xl font-black tracking-[-0.045em] text-zinc-100 sm:text-6xl">
              MISSION CONTROL
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-zinc-400">
              Every completed mission strengthens the operator.
            </p>
          </div>
          <TitanButton
            size="lg"
            leftIcon={<Plus className="size-5" />}
            onClick={() => setOpen(true)}
          >
            Create Mission
          </TitanButton>
        </div>
      </TitanCard>

      {/* KPI Grid */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Total XP" value={totalXP} icon={<Star />} />
        <Stat label="Combat Streak" value={`${streak} Days`} icon={<Flame />} />
        <Stat label="Completed Today" value={`${completed}/${todaysHabits.length}`} icon={<Crosshair />} />
        <Stat label="Mission Completion" value={`${completionRate}%`} icon={<Activity />} />
      </section>

      {error && (
        <p className="rounded-2xl border border-red-500/25 bg-red-500/[0.08] px-5 py-4 text-sm text-red-200">
          {error}
        </p>
      )}

      {/* Active Operations */}
      <section className="space-y-5">
        <div className="flex items-end justify-between border-b border-zinc-800 pb-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-yellow-400">Active operations</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-zinc-100">Today&apos;s Missions</h2>
          </div>
          <p className="hidden text-sm text-zinc-500 sm:block">
            {completed} of {todaysHabits.length} missions resolved
          </p>
        </div>

        {loading ? (
          <LoadingState message="Loading mission dossiers..." />
        ) : todaysHabits.length ? (
          <div className="space-y-4">
            {todaysHabits.map((habit: Habit) => (
              <MissionCard
                key={habit.id}
                habit={habit}
                onToggle={(id: string) => toggleHabit(userId, id)}
                onEdit={editHabit}
                onDelete={(id: string) => deleteHabit(userId, id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Active Missions"
            description="Deploy a new classified mission to begin strengthening the operator."
            actionText="Create Mission"
            onAction={() => setOpen(true)}
          />
        )}
      </section>

      {/* Mission Log */}
      <TitanCard variant="default" padding="md">
        <div className="flex items-center gap-4">
          <div className="flex size-11 items-center justify-center rounded-2xl border border-yellow-400/20 bg-yellow-400/[0.08]">
            <History className="size-5 text-yellow-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-yellow-400">Classified records</p>
            <h2 className="mt-1 text-2xl font-bold text-zinc-100">Mission Log</h2>
          </div>
        </div>

        {history.length ? (
          <div className="mt-7 divide-y divide-zinc-800/80">
            {history.map((item: { id: string; title: string; completedAt: Date; xp: number }) => (
              <div key={item.id} className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className="font-semibold text-zinc-200">{item.title}</p>
                  <p className="mt-1 text-sm text-zinc-600">
                    Mission Complete · {dateFormatter.format(item.completedAt)}
                  </p>
                </div>
                <TitanBadge variant="gold" glow>
                  +{item.xp} XP
                </TitanBadge>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-7 text-sm text-zinc-500">Completed mission records will be secured here.</p>
        )}
      </TitanCard>

      <MissionModal open={open} habit={editingHabit} onClose={closeModal} onSubmit={submit} />
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: string | number; icon: ReactNode }) {
  return (
    <TitanCard variant="stat" padding="sm">
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-500">{label}</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-zinc-100">{value}</h2>
        </div>
        <div className="rounded-xl border border-yellow-400/15 bg-yellow-400/[0.07] p-2.5 text-yellow-400">{icon}</div>
      </div>
    </TitanCard>
  );
}
