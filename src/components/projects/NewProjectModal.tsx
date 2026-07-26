import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FolderPlus, X } from "lucide-react";
import { TitanButton } from "@/components/ui";
import { dialogEntrance } from "@/animations/motionSystem";
import { CATEGORY_OPTIONS } from "@/constants/categories";

interface NewProjectModalProps {
  open: boolean;
  onClose: () => void;
  onCreateProject: (project: any) => void;
}

export default function NewProjectModal({ open, onClose, onCreateProject }: NewProjectModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Operations");
  const [priority, setPriority] = useState<"High" | "Medium" | "Low">("High");

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const today = new Date().toISOString().split("T")[0];
    onCreateProject({
      name: name.trim(),
      description: description.trim(),
      category,
      priority,
      status: "Active",
      startDate: today,
      endDate: today,
      color: "#d4af37",
      tags: [category.toLowerCase()],
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
              <FolderPlus className="size-5 text-[#e5c158]" />
              <h3 className="text-lg font-bold text-white font-sans">New Project Initiative</h3>
            </div>
            <button onClick={onClose} className="rounded-xl p-1.5 text-zinc-500 hover:text-white">
              <X className="size-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-zinc-400 font-bold uppercase tracking-wider mb-2">
                Project Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Knowledge OS Semantic Search"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-[#070709] p-3 text-white placeholder-zinc-600 focus:border-[#d4af37] focus:outline-none font-sans text-sm"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-bold uppercase tracking-wider mb-2">
                Description & Scope
              </label>
              <textarea
                rows={3}
                placeholder="Describe project objectives..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-[#070709] p-3 text-white placeholder-zinc-600 focus:border-[#d4af37] focus:outline-none font-sans text-xs resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-400 font-bold uppercase tracking-wider mb-2">
                  Category Sector
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
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
                  Priority Clearance
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as "High" | "Medium" | "Low")}
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
                CREATE PROJECT
              </TitanButton>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
