import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Flame, Shield, Trophy, X, Zap } from "lucide-react";
import { TitanBadge, TitanButton, TitanProgress } from "@/components/ui";
import { useHabitStore } from "@/store/missionStore";
import { getProgressionDetails } from "@/services/xpEngineService";

export default function MissionCompletionModal() {
  const { lastCompletedMission, clearCompletionModal } = useHabitStore();

  if (!lastCompletedMission) return null;

  const { title, xpEarned, newTotalXP, streak } = lastCompletedMission;

  // Global Progression Engine Telemetry
  const progression = getProgressionDetails(newTotalXP);
  const coinReward = Math.round(xpEarned / 10);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md font-mono">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-[#d4af37]/35 bg-[#0b0b0e] p-8 shadow-2xl shadow-black/95"
        >
          {/* Subtle Ambient Lighting */}
          <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-[#d4af37]/[0.05] blur-[100px]" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 size-64 rounded-full bg-emerald-500/[0.05] blur-[100px]" />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#d4af37]/80 via-emerald-400/80 to-[#d4af37]/80" />

          {/* Close Button */}
          <button
            onClick={clearCompletionModal}
            className="absolute right-5 top-5 rounded-xl p-2 text-zinc-500 hover:bg-zinc-800/60 hover:text-white transition"
          >
            <X className="size-5" />
          </button>

          {/* Header Banner */}
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 300 }}
              className="mb-4 flex size-20 items-center justify-center rounded-3xl border border-emerald-400/30 bg-emerald-500/10 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.2)]"
            >
              <CheckCircle2 className="size-10 stroke-[2.5]" />
            </motion.div>

            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-400">
              OPERATIONAL SUCCESS
            </span>

            <h2 className="mt-2 text-3xl font-black tracking-tight text-zinc-100 sm:text-4xl">
              MISSION COMPLETE
            </h2>

            <p className="mt-2 text-base font-semibold text-zinc-300 font-sans">
              "{title}"
            </p>
          </div>

          {/* XP & Coin Rewards */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            {/* XP Earned */}
            <div className="rounded-2xl border border-[#d4af37]/30 bg-[#d4af37]/10 p-4 text-center shadow-lg">
              <div className="flex items-center justify-center gap-1.5 text-xs text-[#e5c158]">
                <Zap className="size-4" />
                <span className="font-semibold uppercase tracking-wider">XP Earned</span>
              </div>
              <p className="mt-2 text-3xl font-extrabold text-[#e5c158]">
                +{xpEarned} XP
              </p>
            </div>

            {/* Coin Reward */}
            <div className="rounded-2xl border border-zinc-800/80 bg-[#121217] p-4 text-center shadow-lg">
              <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-400">
                <Flame className="size-4 text-[#e5c158]" />
                <span className="font-semibold uppercase tracking-wider">Coin Yield</span>
              </div>
              <p className="mt-2 text-3xl font-bold text-zinc-100">
                🪙 +{coinReward}
              </p>
            </div>
          </div>

          {/* Level & Operator Rank Progress */}
          <div className="mt-6 rounded-2xl border border-zinc-800/80 bg-[#121217] p-5 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-zinc-400">
                <Trophy className="size-4 text-[#e5c158]" />
                <span className="font-semibold uppercase tracking-wider">Operator Rank</span>
              </div>
              <div className="flex items-center gap-2">
                <TitanBadge variant="gold" size="sm">
                  {progression.rank.toUpperCase()}
                </TitanBadge>
                <span className="font-bold text-zinc-100">
                  Level {progression.level}
                </span>
              </div>
            </div>

            <div>
              <TitanProgress value={progression.progressPercent} />
            </div>

            <div className="flex justify-between text-[11px] text-zinc-500 font-medium">
              <span>{progression.currentLevelXP} / {progression.xpRequired} XP to Level {progression.level + 1}</span>
              <span>Streak: {streak} Days</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-8">
            <TitanButton
              fullWidth
              size="lg"
              leftIcon={<Shield className="size-5" />}
              onClick={clearCompletionModal}
            >
              ACKNOWLEDGE DIRECTIVE
            </TitanButton>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
