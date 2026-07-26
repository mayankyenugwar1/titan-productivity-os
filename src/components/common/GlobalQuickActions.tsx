import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  Bot,
  Compass,
  Plus,
  Sparkles,
  X,
  Zap,
} from "lucide-react";

export default function GlobalQuickActions() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const actions = [
    {
      label: "Create Mission",
      icon: Plus,
      color: "bg-[#d4af37] text-zinc-950",
      onClick: () => {
        navigate("/habits");
        setIsOpen(false);
      },
    },
    {
      label: "Start Focus Mode",
      icon: Sparkles,
      color: "bg-emerald-500 text-zinc-950",
      onClick: () => {
        navigate("/habits");
        setIsOpen(false);
      },
    },
    {
      label: "AI Commander",
      icon: Bot,
      color: "bg-amber-400 text-zinc-950",
      onClick: () => {
        navigate("/dashboard");
        setIsOpen(false);
      },
    },
    {
      label: "Open Analytics",
      icon: Activity,
      color: "bg-sky-400 text-zinc-950",
      onClick: () => {
        navigate("/analytics");
        setIsOpen(false);
      },
    },
    {
      label: "Command Center",
      icon: Compass,
      color: "bg-purple-400 text-zinc-950",
      onClick: () => {
        navigate("/command-center");
        setIsOpen(false);
      },
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40 font-mono">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="mb-3 space-y-2"
          >
            {actions.map((act) => {
              const IconComp = act.icon;
              return (
                <button
                  key={act.label}
                  onClick={act.onClick}
                  className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-[#0c0c0f] px-4 py-2.5 shadow-2xl shadow-black text-xs font-bold text-zinc-100 hover:border-[#d4af37]/40 hover:bg-[#121217] transition ml-auto"
                >
                  <span className="font-sans">{act.label}</span>
                  <span className={`flex size-7 items-center justify-center rounded-xl font-bold ${act.color}`}>
                    <IconComp className="size-4" />
                  </span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={toggleMenu}
        aria-label="Global Quick Actions"
        className="flex size-14 items-center justify-center rounded-full border border-[#d4af37]/40 bg-[#d4af37] text-zinc-950 shadow-2xl shadow-black transition hover:scale-105 hover:bg-[#e5c158]"
      >
        {isOpen ? <X className="size-6 stroke-[2.5]" /> : <Zap className="size-6 fill-zinc-950" />}
      </button>
    </div>
  );
}
