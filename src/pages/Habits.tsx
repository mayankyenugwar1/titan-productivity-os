import { useState } from "react";
import { Plus, Flame, Star } from "lucide-react";

import HabitCard from "@/features/habits/components/HabitCard";
import HabitModal from "@/features/habits/components/HabitModal";
import { useHabitStore } from "@/store/habitStore";

export default function Habits() {
  const [open, setOpen] = useState(false);

  const {
    habits,
    addHabit,
    toggleHabit,
    deleteHabit,
    totalXP,
    streak,
  } = useHabitStore();

  const completed = habits.filter((habit) => habit.completed).length;

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm uppercase tracking-[0.35em] text-yellow-400">
            TITAN
          </p>

          <h1 className="mt-2 text-5xl font-black text-white">
            Mission Control
          </h1>

          <p className="mt-3 text-zinc-500">
            Build consistency. Earn XP. Level up.
          </p>

        </div>

        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-3 rounded-2xl bg-yellow-400 px-6 py-4 font-bold text-black transition hover:scale-105"
        >
          <Plus size={22} />

          New Mission
        </button>

      </div>

      {/* Stats */}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

        <div className="rounded-3xl border border-zinc-800 bg-[#111111] p-6">

          <p className="text-sm text-zinc-500">
            Total XP
          </p>

          <div className="mt-4 flex items-center gap-3">

            <Star className="text-yellow-400" />

            <h2 className="text-4xl font-black text-white">
              {totalXP}
            </h2>

          </div>

        </div>

        <div className="rounded-3xl border border-zinc-800 bg-[#111111] p-6">

          <p className="text-sm text-zinc-500">
            Current Streak
          </p>

          <div className="mt-4 flex items-center gap-3">

            <Flame className="text-orange-400" />

            <h2 className="text-4xl font-black text-white">
              {streak}
            </h2>

          </div>

        </div>

        <div className="rounded-3xl border border-zinc-800 bg-[#111111] p-6">

          <p className="text-sm text-zinc-500">
            Completed Today
          </p>

          <h2 className="mt-4 text-4xl font-black text-white">
            {completed}/{habits.length}
          </h2>

        </div>

      </div>

      {/* Habits */}

      <div className="space-y-5">

        {habits.length === 0 ? (

          <div className="rounded-3xl border border-dashed border-zinc-700 p-16 text-center">

            <h2 className="text-3xl font-bold text-white">
              No Missions Yet
            </h2>

            <p className="mt-3 text-zinc-500">
              Create your first mission to begin your TITAN journey.
            </p>

          </div>

        ) : (

          habits.map((habit) => (

            <HabitCard
              key={habit.id}
              habit={habit}
              onToggle={toggleHabit}
              onDelete={deleteHabit}
            />

          ))

        )}

      </div>

      <HabitModal
        open={open}
        onClose={() => setOpen(false)}
        onCreate={addHabit}
      />

    </div>
  );
}