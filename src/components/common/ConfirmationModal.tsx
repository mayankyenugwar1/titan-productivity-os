import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { TitanButton } from "@/components/ui";
import { dialogEntrance } from "@/animations/motionSystem";

interface ConfirmationModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmationModal({
  open,
  title,
  message,
  confirmText = "ABORT MISSION",
  cancelText = "CANCEL",
  onConfirm,
  onClose,
}: ConfirmationModalProps) {
  // Keydown Escape handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xl font-mono">
        <motion.div
          variants={dialogEntrance}
          initial="initial"
          animate="animate"
          exit="exit"
          className="relative w-full max-w-md overflow-hidden rounded-3xl border border-red-500/40 bg-[#0d0d10] p-6.5 shadow-2xl shadow-black"
        >
          {/* Ambient Red Glow */}
          <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-red-500/10 blur-[80px]" />

          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-xl p-2 text-zinc-500 hover:bg-zinc-800 hover:text-white transition"
          >
            <X className="size-4" />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="flex size-10 items-center justify-center rounded-xl border border-red-500/40 bg-red-500/10 text-red-400">
              <AlertTriangle className="size-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-400">
                CONFIRM DESTRUCTIVE ACTION
              </p>
              <h3 className="text-lg font-bold text-zinc-100 font-sans mt-0.5">{title}</h3>
            </div>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-zinc-300 font-sans">{message}</p>

          <div className="mt-6 flex items-center justify-end gap-3 border-t border-zinc-800/80 pt-4">
            <TitanButton variant="secondary" size="sm" onClick={onClose}>
              {cancelText}
            </TitanButton>
            <TitanButton variant="danger" size="sm" onClick={onConfirm}>
              {confirmText}
            </TitanButton>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
