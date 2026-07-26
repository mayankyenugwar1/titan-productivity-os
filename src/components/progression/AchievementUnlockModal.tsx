import { AnimatePresence, motion } from "framer-motion";
import { Award, Shield, Trophy, X, Zap } from "lucide-react";
import { TitanButton } from "@/components/ui";
import type { Achievement } from "@/services/achievementService";

interface AchievementUnlockModalProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export default function AchievementUnlockModal({
  achievement,
  onClose,
}: AchievementUnlockModalProps) {
  if (!achievement) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md font-mono">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-[#d4af37]/40 bg-[#0b0b0e] p-8 shadow-2xl shadow-black/95 text-zinc-100"
        >
          {/* Subtle Ambient Glows */}
          <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-[#d4af37]/[0.08] blur-[100px]" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 size-64 rounded-full bg-emerald-500/[0.05] blur-[100px]" />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#d4af37] via-amber-400 to-[#d4af37]" />

          <button
            onClick={onClose}
            className="absolute right-5 top-5 rounded-xl p-2 text-zinc-500 hover:bg-zinc-800 hover:text-white transition"
          >
            <X className="size-5" />
          </button>

          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 300 }}
              className="mb-4 flex size-20 items-center justify-center rounded-3xl border border-[#d4af37]/40 bg-[#d4af37]/15 text-[#e5c158] shadow-[0_0_30px_rgba(212,175,55,0.25)]"
            >
              <Trophy className="size-10 stroke-[2]" />
            </motion.div>

            <span className="text-xs font-bold uppercase tracking-[0.35em] text-[#e5c158]">
              SYSTEM CLEARANCE UNLOCKED
            </span>

            <h2 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
              ACHIEVEMENT UNLOCKED
            </h2>

            <h3 className="mt-3 text-xl font-bold text-[#e5c158] font-sans">
              "{achievement.title}"
            </h3>

            <p className="mt-2 max-w-sm text-xs text-zinc-300 font-sans leading-relaxed">
              {achievement.description}
            </p>
          </div>

          {/* Reward Readout Grid */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-[#d4af37]/30 bg-[#d4af37]/10 p-4 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-[#e5c158]">
                <Zap className="size-4" />
                <span className="font-bold uppercase tracking-wider">XP Reward</span>
              </div>
              <p className="mt-2 text-2xl font-black text-[#e5c158]">
                +{achievement.xpReward} XP
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-[#121217] p-4 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-400">
                <Award className="size-4 text-zinc-300" />
                <span className="font-bold uppercase tracking-wider">Coin Yield</span>
              </div>
              <p className="mt-2 text-2xl font-black text-white">
                🪙 +{achievement.coinReward}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <TitanButton fullWidth size="lg" leftIcon={<Shield className="size-5" />} onClick={onClose}>
              CLAIM SYSTEM CLEARANCE
            </TitanButton>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
