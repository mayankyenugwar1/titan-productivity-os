import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useHabitStore } from "@/store/missionStore";
import { TitanButton } from "@/components/ui";
import { dialogEntrance } from "@/animations/motionSystem";
import type { HabitCategory, HabitPriority, Weekday } from "@/features/missions/types";
import { CATEGORY_OPTIONS } from "@/constants/categories";

interface QuickAddDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function QuickAddDialog({ open, onClose }: QuickAddDialogProps) {
  const { user } = useAuth();
  const { addHabit } = useHabitStore();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<HabitCategory>("Operations");
  const [priority, setPriority] = useState<HabitPriority>("Medium");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const xp = priority === "High" ? 150 : priority === "Medium" ? 100 : 50;
    const userId = user?.id || "local_user";
    const allDays: Weekday[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

    await addHabit(userId, {
      title: title.trim(),
      description: "Quick scheduled via Time OS",
      category,
      priority,
      xp,
      frequency: "daily",
      weeklyDays: allDays,
    });

    setTitle("");
    onClose();
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xl font-mono">
        <motion.div
          variants={dialogEntrance}
          initial="initial"
          animate="animate"
          exit="exit"
          className="relative w-full max-w-md rounded-3xl border border-[#d4af37]/40 bg-[#0d0d10] p-6.5 shadow-2xl shadow-black space-y-5"
        >
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3.5">
            <div className="flex items-center gap-2">
              <Plus className="size-5 text-[#e5c158]" />
              <h3 className="text-lg font-bold text-white font-sans">Quick Schedule Directive</h3>
            </div>
            <button onClick={onClose} className="rounded-xl p-1.5 text-zinc-500 hover:text-white">
              <X className="size-4" />
            </button>
          </div>

          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4 text-xs">
            <div>
              <label className="block text-zinc-400 font-bold uppercase tracking-wider mb-2">
                Directive Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Codebase Refactoring Session"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-[#070709] p-3 text-white placeholder-zinc-600 focus:border-[#d4af37] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-400 font-bold uppercase tracking-wider mb-2">
                  Category Sector
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as HabitCategory)}
                  className="w-full rounded-xl border border-zinc-800 bg-[#070709] p-3 text-white focus:border-[#d4af37] focus:outline-none"
                >
                  {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 font-bold uppercase tracking-wider mb-2">
                  Priority Clearances
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as HabitPriority)}
                  className="w-full rounded-xl border border-zinc-800 bg-[#070709] p-3 text-white focus:border-[#d4af37] focus:outline-none"
                >
                  <option value="High">High (Critical)</option>
                  <option value="Medium">Medium (Normal)</option>
                  <option value="Low">Low (Low)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800/80">
              <TitanButton variant="secondary" size="sm" type="button" onClick={onClose}>
                CANCEL
              </TitanButton>
              <TitanButton size="sm" type="submit">
                SCHEDULE DIRECTIVE
              </TitanButton>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
