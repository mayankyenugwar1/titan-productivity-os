import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Zap } from "lucide-react";
import { TitanButton } from "@/components/ui";
import { dialogEntrance } from "@/animations/motionSystem";
import type { EventType } from "@/services/automation/eventBusService";

interface NewWorkflowModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (workflow: any) => void;
}

export default function NewWorkflowModal({ open, onClose, onCreate }: NewWorkflowModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [eventType, setEventType] = useState<EventType>("MISSION_COMPLETED");

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onCreate({
      name: name.trim(),
      description: description.trim() || "Custom Automation OS Protocol",
      enabled: true,
      trigger: {
        eventType,
        label: eventType.replace("_", " "),
      },
      conditions: [
        { field: "priority", operator: "equals", value: "High" },
      ],
      actions: [
        { actionType: "AWARD_XP", label: "Award +100 XP Payload", params: { xp: 100 } },
      ],
    });

    setName("");
    setDescription("");
    onClose();
  };

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
              <Zap className="size-5 text-[#e5c158]" />
              <h3 className="text-lg font-bold text-white font-sans">New Automation Protocol</h3>
            </div>
            <button onClick={onClose} className="rounded-xl p-1.5 text-zinc-500 hover:text-white">
              <X className="size-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-zinc-400 font-bold uppercase tracking-wider mb-2">
                Protocol Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g., High Priority Mission Reward"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-[#070709] p-3 text-white placeholder-zinc-600 focus:border-[#d4af37] focus:outline-none font-sans text-sm"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-bold uppercase tracking-wider mb-2">
                Description
              </label>
              <textarea
                rows={3}
                placeholder="Describe trigger and action steps..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-[#070709] p-3 text-white placeholder-zinc-600 focus:border-[#d4af37] focus:outline-none font-sans text-xs resize-none"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-bold uppercase tracking-wider mb-2">
                Trigger Event
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value as EventType)}
                className="w-full rounded-xl border border-zinc-800 bg-[#070709] p-3 text-white focus:border-[#d4af37] focus:outline-none"
              >
                <option value="MISSION_COMPLETED">MISSION COMPLETED</option>
                <option value="MISSION_CREATED">MISSION CREATED</option>
                <option value="STREAK_MILESTONE">STREAK MILESTONE</option>
                <option value="SCHEDULED_TICK">SCHEDULED TICK</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800/80">
              <TitanButton variant="secondary" size="sm" type="button" onClick={onClose}>
                CANCEL
              </TitanButton>
              <TitanButton size="sm" type="submit">
                CREATE PROTOCOL
              </TitanButton>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
