import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Infinity as InfinityIcon,
  Pause,
  Play,
  Shield,
  Star,
} from "lucide-react";
import { TitanBadge, TitanButton } from "@/components/ui";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { useAuth } from "@/context/AuthContext";
import { useHabitStore } from "@/store/missionStore";
import {
  calculateDifficultyStars,
  calculateDynamicXP,
  type Habit,
} from "@/features/missions/types";
import { formatCategory, isInfiniteDuration, parseDurationMinutes } from "@/features/missions/constants";

type FocusModeOverlayProps = {
  habit: Habit | null;
  onClose: () => void;
};

export default function FocusModeOverlay({ habit, onClose }: FocusModeOverlayProps) {
  const { user } = useAuth();
  const { toggleHabit } = useHabitStore();

  const isInfinite = isInfiniteDuration(habit?.duration);

  // Duration in seconds
  const totalSeconds = useMemo(() => {
    if (!habit || isInfinite) return 0;
    const mins = parseDurationMinutes(habit.duration) ?? (habit.priority === "High" ? 90 : habit.priority === "Medium" ? 45 : 20);
    return mins * 60;
  }, [habit, isInfinite]);

  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [showAbortConfirm, setShowAbortConfirm] = useState(false);
  const [showCompletionOverlay, setShowCompletionOverlay] = useState(false);

  useEffect(() => {
    setSecondsLeft(totalSeconds);
    setElapsedSeconds(0);
    setIsRunning(true);
    setShowCompletionOverlay(false);
  }, [habit, totalSeconds]);

  // Timer Tick & Cleanup
  useEffect(() => {
    if (!isRunning || showCompletionOverlay) return;

    const interval = setInterval(() => {
      if (!isInfinite && secondsLeft > 0) {
        setSecondsLeft((prev) => Math.max(0, prev - 1));
      }
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, isInfinite, secondsLeft, showCompletionOverlay]);

  if (!habit) return null;

  // Format Helper
  const formatTime = (secs: number) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;

    if (hrs > 0) {
      return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${mins.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const formattedRemaining = isInfinite ? "∞ Infinite Session" : formatTime(secondsLeft);
  const formattedElapsed = formatTime(elapsedSeconds);

  // SVG Progress Ring Calculation
  const progressPercent = isInfinite ? 100 : totalSeconds > 0 ? Math.min(100, Math.max(0, ((totalSeconds - secondsLeft) / totalSeconds) * 100)) : 100;
  const strokeDashoffset = 440 - (440 * progressPercent) / 100;

  const xpReward = calculateDynamicXP(habit);
  const coinReward = Math.round(xpReward / 10);
  const starsCount = calculateDifficultyStars(habit);

  const getPriorityBadge = (p: string) => {
    if (p === "High") return { label: "CRITICAL", variant: "red" as const };
    if (p === "Medium") return { label: "HIGH", variant: "gold" as const };
    return { label: "NORMAL", variant: "blue" as const };
  };

  const priorityInfo = getPriorityBadge(habit.priority);

  // Actions
  const handleComplete = async () => {
    setIsRunning(false);
    setShowCompletionOverlay(true);
    if (user) {
      await toggleHabit(user.id, habit.id);
    }
  };

  const handleAbortConfirm = () => {
    setShowAbortConfirm(false);
    setIsRunning(false);
    setSecondsLeft(totalSeconds);
    setElapsedSeconds(0);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex flex-col justify-between bg-[#050507] p-6 sm:p-10 font-mono text-zinc-100 backdrop-blur-3xl overflow-y-auto"
      >
        {/* Soft Ambient Lighting Glows */}
        <div className="pointer-events-none absolute -right-40 -top-40 size-96 rounded-full bg-[#d4af37]/[0.04] blur-[160px]" />
        <div className="pointer-events-none absolute -left-40 -bottom-40 size-96 rounded-full bg-emerald-500/[0.04] blur-[160px]" />

        {/* 1. TOP HEADER BAR */}
        <div className="flex w-full items-center justify-between border-b border-zinc-800/80 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl border border-[#d4af37]/30 bg-[#d4af37]/10 text-[#e5c158]">
              <Shield className="size-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#e5c158]">
                WAYNE OS // ACTIVE MISSION CONSOLE
              </span>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium">
                DISTRACTION-FREE OPERATION ENCLOSURE
              </p>
            </div>
          </div>

          {/* Abort Button */}
          <button
            onClick={() => setShowAbortConfirm(true)}
            className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-400 hover:bg-red-500/20 transition"
          >
            <AlertTriangle className="size-4 text-red-400" />
            <span>ABORT MISSION</span>
          </button>
        </div>

        {/* 2. CENTER MISSION DISPLAY & SVG PROGRESS RING */}
        <div className="my-auto flex flex-col items-center py-6 text-center">
          {/* Mission Meta Readout Header */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 text-xs">
            <TitanBadge variant="zinc" size="sm">
              {formatCategory(habit.category)}
            </TitanBadge>

            <TitanBadge variant={priorityInfo.variant} size="sm">
              {priorityInfo.label}
            </TitanBadge>

            {/* 1-5 Star Difficulty */}
            <div className="flex items-center gap-0.5 rounded-md border border-zinc-800 bg-[#121217] px-2 py-0.5 text-[10px] text-[#e5c158]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`size-3 ${i < starsCount ? "fill-[#e5c158] text-[#e5c158]" : "text-zinc-700"}`}
                />
              ))}
            </div>

            <TitanBadge variant={isRunning ? "gold" : "zinc"} size="sm">
              STATUS: {isRunning ? "IN PROGRESS" : "PAUSED"}
            </TitanBadge>
          </div>

          {/* Mission Title */}
          <h1 className="mt-4 font-sans text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl max-w-3xl">
            {habit.title}
          </h1>

          {/* Circular Progress Ring */}
          <div className="relative mt-8 flex size-72 items-center justify-center sm:size-80">
            <svg className="size-full -rotate-90" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r="70"
                className="stroke-zinc-900"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                className="stroke-[#d4af37] transition-all duration-1000 ease-linear shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                strokeWidth="8"
                strokeDasharray="440"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
              />
            </svg>

            {/* Large Countdown / Session Readout */}
            <div className="absolute flex flex-col items-center">
              {isInfinite ? (
                <div className="flex flex-col items-center space-y-1">
                  <InfinityIcon className="size-12 text-[#e5c158] animate-pulse" />
                  <span className="text-xl font-bold tracking-wider text-zinc-100">
                    No Time Limit
                  </span>
                </div>
              ) : (
                <span className="text-5xl font-black tracking-wider text-zinc-100 sm:text-6xl">
                  {formattedRemaining}
                </span>
              )}
              <span className="mt-2 text-xs font-bold uppercase tracking-[0.25em] text-[#e5c158]">
                {isInfinite ? "INFINITE SESSION" : "REMAINING DURATION"}
              </span>
            </div>
          </div>

          {/* Telemetry Grid: Elapsed Time, Remaining Time, XP, Coins */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 max-w-2xl w-full text-xs">
            <div className="rounded-xl border border-zinc-800/80 bg-[#0d0d10] p-3 text-center">
              <span className="block text-[10px] text-zinc-500 uppercase tracking-wider">Elapsed Time</span>
              <span className="mt-1 font-bold text-zinc-200">{formattedElapsed}</span>
            </div>

            <div className="rounded-xl border border-zinc-800/80 bg-[#0d0d10] p-3 text-center">
              <span className="block text-[10px] text-zinc-500 uppercase tracking-wider">Remaining Time</span>
              <span className="mt-1 font-bold text-[#e5c158]">
                {isInfinite ? "No Limit" : formattedRemaining}
              </span>
            </div>

            <div className="rounded-xl border border-[#d4af37]/30 bg-[#d4af37]/10 p-3 text-center">
              <span className="block text-[10px] text-[#e5c158] uppercase tracking-wider">XP Yield</span>
              <span className="mt-1 font-extrabold text-[#e5c158]">+{xpReward} XP</span>
            </div>

            <div className="rounded-xl border border-zinc-800/80 bg-[#0d0d10] p-3 text-center">
              <span className="block text-[10px] text-zinc-500 uppercase tracking-wider">Coin Yield</span>
              <span className="mt-1 font-bold text-zinc-200">🪙 +{coinReward} COINS</span>
            </div>
          </div>
        </div>

        {/* 3. BOTTOM CONTROL BAR */}
        <div className="flex w-full max-w-md items-center justify-center gap-4 mx-auto pt-4 border-t border-zinc-800/80">
          <TitanButton
            variant="secondary"
            size="lg"
            leftIcon={isRunning ? <Pause className="size-5" /> : <Play className="size-5" />}
            onClick={() => setIsRunning(!isRunning)}
            className="w-1/2"
          >
            {isRunning ? "PAUSE" : "RESUME"}
          </TitanButton>

          <TitanButton
            variant="primary"
            size="lg"
            leftIcon={<CheckCircle2 className="size-5" />}
            onClick={() => void handleComplete()}
            className="w-1/2"
          >
            COMPLETE MISSION
          </TitanButton>
        </div>

        {/* 4. MISSION COMPLETION OVERLAY */}
        <AnimatePresence>
          {showCompletionOverlay && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 p-6 backdrop-blur-2xl"
            >
              <div className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-emerald-500/40 bg-[#0b0b0e] p-8 text-center shadow-2xl shadow-emerald-500/10">
                <div className="mb-4 flex size-20 items-center justify-center rounded-3xl border border-emerald-400/30 bg-emerald-500/15 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)] mx-auto">
                  <CheckCircle2 className="size-10 stroke-[2.5]" />
                </div>

                <span className="text-xs font-bold uppercase tracking-[0.4em] text-emerald-400">
                  TACTICAL SUCCESS
                </span>

                <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">
                  MISSION COMPLETE
                </h2>

                <p className="mt-2 text-base font-semibold text-zinc-300 font-sans">
                  "{habit.title}"
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl border border-[#d4af37]/30 bg-[#d4af37]/10 p-3.5 text-center">
                    <span className="block text-[10px] text-[#e5c158] uppercase">XP Earned</span>
                    <span className="text-2xl font-extrabold text-[#e5c158]">+{xpReward} XP</span>
                  </div>

                  <div className="rounded-xl border border-zinc-800 bg-[#121217] p-3.5 text-center">
                    <span className="block text-[10px] text-zinc-400 uppercase">Coins Earned</span>
                    <span className="text-2xl font-extrabold text-white">🪙 +{coinReward}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-xl border border-zinc-800/80 bg-[#121217] p-3 text-xs">
                  <span className="text-zinc-500">Mission Duration</span>
                  <span className="font-bold text-zinc-200">{formattedElapsed}</span>
                </div>

                <div className="mt-2 flex items-center justify-between rounded-xl border border-zinc-800/80 bg-[#121217] p-3 text-xs">
                  <span className="text-zinc-500">Status Updated</span>
                  <span className="font-bold text-emerald-400">COMPLETED</span>
                </div>

                <div className="mt-6">
                  <TitanButton
                    fullWidth
                    size="lg"
                    leftIcon={<Clock className="size-5" />}
                    onClick={onClose}
                  >
                    RETURN TO MISSION CONTROL
                  </TitanButton>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 5. ABORT CONFIRMATION MODAL */}
        <ConfirmationModal
          open={showAbortConfirm}
          title={`Abort Focus Mode for "${habit.title}"?`}
          message="Are you sure you want to abort this active focus mode? The mission timer will reset and the mission will return to Pending."
          confirmText="ABORT MISSION"
          onConfirm={handleAbortConfirm}
          onClose={() => setShowAbortConfirm(false)}
        />
      </motion.div>
    </AnimatePresence>
  );
}
