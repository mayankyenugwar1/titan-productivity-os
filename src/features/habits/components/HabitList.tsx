import { useState } from "react";
import { Plus } from "lucide-react";

import HabitCard from "./HabitCard";
import HabitModal from "./HabitModal";

import { useHabitStore } from "@/store/habitStore";

export default function HabitList() {
  const habits = useHabitStore((state) => state.habits);
  const addHabit = useHabitStore((state) => state.addHabit);
  const toggleHabit = useHabitStore((state) => state.toggleHabit);
  const deleteHabit = useHabitStore((state) => state.deleteHabit);

  const [open, setOpen] = useState(false);

  return (
    <>
      <section className="space-y-6">

        <div className="flex items-center justify-between">

          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-yellow-400">
              Mission Control
            </p>

            <h2 className="mt-2 text-3xl font-bold text-white">
              Today's Missions
            </h2>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 font-semibold text-black transition hover:scale-105"
          >
            <Plus size={18} />
            Create Mission
          </button>

        </div>

        {habits.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-700 py-16 text-center">

            <h3 className="text-xl font-semibold text-white">
              No Missions Yet
            </h3>

            <p className="mt-3 text-zinc-500">
              Create your first mission to begin earning XP.
            </p>

          </div>
        ) : (
          <div className="space-y-4">
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onToggle={toggleHabit}
                onDelete={deleteHabit}
              />
            ))}
          </div>
        )}

      </section>

      <HabitModal
        open={open}
        onClose={() => setOpen(false)}
        onCreate={addHabit}
      />
    </>
  );
}