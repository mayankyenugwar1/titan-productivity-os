import { useState } from "react";
import { Target, X } from "lucide-react";

import {
  HABIT_CATEGORIES,
  HABIT_PRIORITIES,
} from "../constants";

import type {
  HabitCategory,
  HabitPriority,
} from "../types";

interface HabitModalProps {
  open: boolean;
  onClose: () => void;

  onCreate: (
    title: string,
    xp: number,
    category: HabitCategory,
    priority: HabitPriority,
    description?: string
  ) => void;
}

export default function HabitModal({
  open,
  onClose,
  onCreate,
}: HabitModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [category, setCategory] =
    useState<HabitCategory>("Personal");

  const [priority, setPriority] =
    useState<HabitPriority>("Medium");

  const [xp, setXp] = useState(50);

  if (!open) return null;

  function handleSubmit() {
    if (!title.trim()) return;

    onCreate(
      title,
      xp,
      category,
      priority,
      description
    );

    setTitle("");
    setDescription("");
    setCategory("Personal");
    setPriority("Medium");
    setXp(50);

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-3xl border border-yellow-500/20 bg-[#111111] p-8 shadow-2xl">

        <div className="mb-8 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-yellow-500/10 p-3">
              <Target className="h-6 w-6 text-yellow-400" />
            </div>

            <div>

              <p className="text-xs uppercase tracking-[0.35em] text-yellow-400">
                TITAN
              </p>

              <h2 className="text-2xl font-bold text-white">
                Create Mission
              </h2>

            </div>

          </div>

          <button onClick={onClose}>
            <X className="text-zinc-500 hover:text-white" />
          </button>

        </div>

        <div className="space-y-5">

          <div>

            <label className="mb-2 block text-sm text-zinc-400">
              Mission Name
            </label>

            <input
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="Morning Workout"
              className="w-full rounded-xl border border-zinc-800 bg-[#181818] px-4 py-3 text-white outline-none focus:border-yellow-500"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm text-zinc-400">
              Description
            </label>

            <textarea
              rows={3}
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Optional description..."
              className="w-full rounded-xl border border-zinc-800 bg-[#181818] px-4 py-3 text-white outline-none focus:border-yellow-500"
            />

          </div>

          <div className="grid grid-cols-2 gap-4">

            <div>

              <label className="mb-2 block text-sm text-zinc-400">
                Category
              </label>

              <select
                value={category}
                onChange={(e) =>
                  setCategory(
                    e.target.value as HabitCategory
                  )
                }
                className="w-full rounded-xl border border-zinc-800 bg-[#181818] px-4 py-3 text-white"
              >
                {HABIT_CATEGORIES.map((item) => (
                  <option key={item}>
                    {item}
                  </option>
                ))}
              </select>

            </div>

            <div>

              <label className="mb-2 block text-sm text-zinc-400">
                Priority
              </label>

              <select
                value={priority}
                onChange={(e) =>
                  setPriority(
                    e.target.value as HabitPriority
                  )
                }
                className="w-full rounded-xl border border-zinc-800 bg-[#181818] px-4 py-3 text-white"
              >
                {HABIT_PRIORITIES.map((item) => (
                  <option key={item}>
                    {item}
                  </option>
                ))}
              </select>

            </div>

          </div>

          <div>

            <label className="mb-2 block text-sm text-zinc-400">
              XP Reward
            </label>

            <select
              value={xp}
              onChange={(e) =>
                setXp(Number(e.target.value))
              }
              className="w-full rounded-xl border border-zinc-800 bg-[#181818] px-4 py-3 text-white"
            >
              <option value={25}>25 XP</option>
              <option value={50}>50 XP</option>
              <option value={75}>75 XP</option>
              <option value={100}>100 XP</option>
              <option value={150}>150 XP</option>
            </select>

          </div>

        </div>

        <button
          onClick={handleSubmit}
          className="mt-8 w-full rounded-xl bg-yellow-400 py-4 text-lg font-bold text-black transition hover:scale-[1.02]"
        >
          Create Mission
        </button>

      </div>
    </div>
  );
}