import { CheckCircle2, Trash2, Circle } from "lucide-react";
import type { Habit } from "../types";

interface HabitCardProps {
  habit: Habit;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function HabitCard({
  habit,
  onToggle,
  onDelete,
}: HabitCardProps) {
  return (
    <div
      className={`group rounded-2xl border p-5 transition-all duration-300 ${
        habit.completed
          ? "border-green-500/30 bg-green-500/5"
          : "border-zinc-800 bg-[#111111] hover:border-yellow-500/30"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <button onClick={() => onToggle(habit.id)}>
            {habit.completed ? (
              <CheckCircle2 className="h-7 w-7 text-green-400" />
            ) : (
              <Circle className="h-7 w-7 text-zinc-500 hover:text-yellow-400" />
            )}
          </button>

          <div>
            <h3
              className={`text-lg font-semibold ${
                habit.completed
                  ? "line-through text-zinc-500"
                  : "text-white"
              }`}
            >
              {habit.title}
            </h3>

            {habit.description && (
              <p className="mt-1 text-sm text-zinc-500">
                {habit.description}
              </p>
            )}

            <div className="mt-3 inline-flex rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-400">
              +{habit.xp} XP
            </div>
          </div>
        </div>

        <button
          onClick={() => onDelete(habit.id)}
          className="opacity-0 transition group-hover:opacity-100"
        >
          <Trash2 className="h-5 w-5 text-red-400 hover:text-red-500" />
        </button>
      </div>
    </div>
  );
}