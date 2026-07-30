import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, Shield, X, Zap } from "lucide-react";

import {
  getDurationDefaults,
  getDurationDisplayLabel,
  HABIT_CATEGORIES,
  MISSION_DURATIONS,
  validateDuration,
  WEEKDAYS,
} from "../constants";
import type { Habit, HabitCategory, HabitFrequency, HabitInput, HabitPriority, Weekday } from "../types";
import { TitanButton, TitanInput, TitanSelect, TitanTextarea } from "@/components/ui";

interface MissionModalProps {
  open: boolean;
  habit?: Habit | null;
  onClose: () => void;
  onSubmit: (input: HabitInput) => Promise<boolean>;
}

const defaults: HabitInput = {
  title: "",
  description: "",
  category: "Operations",
  priority: "High",
  xp: 100,
  frequency: "daily",
  weeklyDays: [],
  duration: "45 mins",
};

export default function MissionModal({ open, habit, onClose, onSubmit }: MissionModalProps) {
  const [form, setForm] = useState<HabitInput>(defaults);
  const [saving, setSaving] = useState(false);

  // Extended console states
  const [difficulty, setDifficulty] = useState("Medium");
  const [energyCost, setEnergyCost] = useState("Medium");
  const [dueDate, setDueDate] = useState("Today");

  useEffect(() => {
    if (!open) return;
    if (habit) {
      const initialDuration = validateDuration(
        habit.duration || (habit.estimatedMinutes ? `${habit.estimatedMinutes} mins` : "45 mins")
      );
      const scaling = getDurationDefaults(initialDuration);

      setForm({
        title: habit.title,
        description: habit.description ?? "",
        category: habit.category,
        priority: habit.priority,
        xp: habit.xp || scaling.xp,
        frequency: habit.frequency,
        weeklyDays: habit.weeklyDays,
        duration: initialDuration,
      });
      setDifficulty(habit.difficulty || scaling.difficulty);
      setEnergyCost(habit.energyCost || scaling.energyCost);
    } else {
      const defaultDuration = "45 mins";
      const scaling = getDurationDefaults(defaultDuration);
      setForm({
        ...defaults,
        duration: defaultDuration,
        xp: scaling.xp,
      });
      setDifficulty(scaling.difficulty);
      setEnergyCost(scaling.energyCost);
    }
  }, [habit, open]);

  if (!open) return null;

  const update = <K extends keyof HabitInput>(key: K, value: HabitInput[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const handleDurationChange = (selectedDuration: string) => {
    const valid = validateDuration(selectedDuration);
    const scaling = getDurationDefaults(valid);

    setForm((current) => ({
      ...current,
      duration: valid,
      xp: scaling.xp,
    }));
    setDifficulty(scaling.difficulty);
    setEnergyCost(scaling.energyCost);
  };

  const toggleDay = (day: Weekday) =>
    update(
      "weeklyDays",
      form.weeklyDays.includes(day)
        ? form.weeklyDays.filter((item) => item !== day)
        : [...form.weeklyDays, day]
    );

  const submit = async () => {
    if (!form.title.trim() || (form.frequency === "weekly" && !form.weeklyDays.length)) return;
    setSaving(true);
    if (await onSubmit(form)) onClose();
    setSaving(false);
  };

  const coinReward = Math.round(form.xp / 10);
  const currentDurationDisplayLabel = getDurationDisplayLabel(form.duration, form.priority);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-md">
        {/* Backdrop Click */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Sliding Command Console */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="relative z-10 flex h-full w-full max-w-2xl flex-col border-l border-zinc-800/80 bg-[#09090b] p-6 sm:p-8 shadow-2xl shadow-black overflow-y-auto"
        >
          {/* Ambient Header Glow */}
          <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-[#d4af37]/[0.05] blur-[100px]" />

          {/* Console Header */}
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-5">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl border border-[#d4af37]/30 bg-[#d4af37]/10 text-[#e5c158]">
                <Shield className="size-5" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#e5c158]">
                  WAYNE ENTERPRISES // COMMAND CONSOLE
                </p>
                <h2 className="text-xl font-bold text-zinc-100 sm:text-2xl">
                  {habit ? "Edit Mission Dossier" : "Deploy Mission Console"}
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Abort mission creation"
              className="rounded-xl p-2 text-zinc-500 hover:bg-zinc-800 hover:text-white transition"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Form Fields Grid */}
          <div className="mt-6 space-y-5 font-mono text-xs">
            {/* 1. Mission Name */}
            <TitanInput
              label="Mission Name"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="e.g. Executive Conditioning Routine"
            />

            {/* 2. Notes / Description */}
            <TitanTextarea
              label="Mission Briefing & Notes"
              rows={2}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Classified notes or specific objective targets..."
            />

            {/* 3. Category & Priority */}
            <div className="grid grid-cols-2 gap-4">
              <TitanSelect
                label="Mission Category"
                value={form.category}
                onChange={(e) => update("category", e.target.value as HabitCategory)}
              >
                {HABIT_CATEGORIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </TitanSelect>

              <TitanSelect
                label="Priority Engine Level"
                value={form.priority}
                onChange={(e) => update("priority", e.target.value as HabitPriority)}
              >
                <option value="High">CRITICAL / HIGH</option>
                <option value="Medium">NORMAL</option>
                <option value="Low">OPTIONAL</option>
              </TitanSelect>
            </div>

            {/* 4. Estimated Duration (Fully Controlled Dropdown) */}
            <div className="grid grid-cols-2 gap-4">
              <TitanSelect
                label="Estimated Duration"
                value={form.duration || "45 mins"}
                onChange={(e) => handleDurationChange(e.target.value)}
              >
                {MISSION_DURATIONS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </TitanSelect>

              <TitanSelect
                label="Operation Difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="Extreme">Extreme</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </TitanSelect>
            </div>

            {/* 5. Energy Cost & XP Reward */}
            <div className="grid grid-cols-2 gap-4">
              <TitanSelect
                label="Estimated Energy Cost"
                value={energyCost}
                onChange={(e) => setEnergyCost(e.target.value)}
              >
                <option value="High">High Reserves</option>
                <option value="Medium">Medium Reserves</option>
                <option value="Low">Low Reserves</option>
              </TitanSelect>

              <TitanSelect
                label="XP Yield Reward"
                value={form.xp}
                onChange={(e) => update("xp", Number(e.target.value))}
              >
                {[25, 50, 75, 100, 125, 150, 175, 200, 250].map((v) => (
                  <option key={v} value={v}>
                    +{v} XP
                  </option>
                ))}
              </TitanSelect>
            </div>

            {/* Live Mission Time Summary Box */}
            <div className="rounded-2xl border border-zinc-800/90 bg-[#0d0d12] p-4 text-xs font-mono space-y-2.5 shadow-lg shadow-black/40">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2 text-[#e5c158] font-bold">
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-[#e5c158]" />
                  <span className="tracking-wider uppercase">MISSION ESTIMATE</span>
                </div>
                <span className="text-[10px] text-zinc-400">AUTO-SCALED</span>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-zinc-300">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Duration</span>
                  <span className="font-bold text-white">{currentDurationDisplayLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Difficulty</span>
                  <span className="font-bold text-white">{difficulty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Energy Cost</span>
                  <span className="font-bold text-white">{energyCost}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">XP Reward</span>
                  <span className="font-bold text-[#e5c158]">+{form.xp} XP</span>
                </div>
                <div className="col-span-2 flex justify-between border-t border-zinc-800/60 pt-2 text-[#e5c158]">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Zap className="size-3.5" />
                    Coin Reward Yield
                  </span>
                  <span className="font-extrabold">🪙 +{coinReward} COINS</span>
                </div>
              </div>
            </div>

            {/* 6. Due Date & Repeat Schedule */}
            <div className="grid grid-cols-2 gap-4">
              <TitanSelect
                label="Due Target Date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              >
                <option value="Today">Today (Immediate)</option>
                <option value="Tomorrow">Tomorrow</option>
                <option value="This Week">End of Week</option>
              </TitanSelect>

              <TitanSelect
                label="Recurrence Pattern"
                value={form.frequency}
                onChange={(e) => update("frequency", e.target.value as HabitFrequency)}
              >
                <option value="daily">Daily Schedule</option>
                <option value="weekly">Weekly Schedule</option>
              </TitanSelect>
            </div>

            {/* Weekly Days Selection */}
            {form.frequency === "weekly" && (
              <fieldset className="space-y-2">
                <legend className="text-xs font-semibold uppercase text-zinc-400">
                  Select Active Operational Days
                </legend>
                <div className="flex flex-wrap gap-2">
                  {WEEKDAYS.map((day) => (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => toggleDay(day.value)}
                      className={`rounded-xl border px-3.5 py-2 text-xs font-semibold transition ${
                        form.weeklyDays.includes(day.value)
                          ? "border-[#d4af37] bg-[#d4af37] text-zinc-950 font-bold"
                          : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-[#d4af37]/40 hover:text-white"
                      }`}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}
          </div>

          {/* Action Buttons: ABORT & DEPLOY MISSION */}
          <div className="mt-8 flex items-center justify-end gap-3 border-t border-zinc-800/80 pt-5">
            <TitanButton variant="secondary" size="md" onClick={onClose}>
              ABORT
            </TitanButton>

            <TitanButton
              variant="primary"
              size="md"
              loading={saving}
              disabled={!form.title.trim() || (form.frequency === "weekly" && !form.weeklyDays.length)}
              onClick={() => void submit()}
            >
              {habit ? "SAVE MISSION" : "DEPLOY MISSION"}
            </TitanButton>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
