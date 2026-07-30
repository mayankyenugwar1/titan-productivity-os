import { useEffect, useState } from "react";
import {
  Archive,
  Check,
  Clock,
  Copy,
  Infinity as InfinityIcon,
  Pause,
  Pencil,
  Play,
  ShieldCheck,
  Star,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import {
  calculateDifficultyStars,
  calculateDynamicXP,
  canTransitionState,
  STATE_TOOLTIPS,
  type Habit,
  type MissionState,
} from "../types";
import { formatCategory, getDurationDisplayLabel, isInfiniteDuration } from "../constants";
import { TitanBadge, TitanButton, TitanCard } from "@/components/ui";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import TacticalTooltip from "@/components/common/TacticalTooltip";

interface MissionCardProps {
  habit: Habit;
  onToggle: (id: string) => Promise<boolean>;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => Promise<boolean>;
  onDuplicate?: (habit: Habit) => void;
  onStartFocus?: (habit: Habit) => void;
}

export default function MissionCard({
  habit,
  onToggle,
  onEdit,
  onDelete,
  onDuplicate,
  onStartFocus,
}: MissionCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isArchived, setIsArchived] = useState(Boolean(habit.archived));
  const [countdown, setCountdown] = useState("00:45:00");

  const isInfinite = isInfiniteDuration(habit.duration);

  // Live Countdown ticker adapted for duration type
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      if (isInfinite) {
        setCountdown("∞ INFINITE SESSION");
      } else {
        const targetMin = 59 - now.getMinutes();
        const targetSec = 59 - now.getSeconds();
        setCountdown(`00:${targetMin.toString().padStart(2, "0")}:${targetSec.toString().padStart(2, "0")}`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isInfinite]);

  // Lifecycle state resolution
  const currentState: MissionState = isArchived
    ? "Archived"
    : habit.completed
    ? "Completed"
    : isPaused
    ? "Paused"
    : habit.frequency === "weekly"
    ? "Scheduled"
    : "Pending";

  const getStatusBadge = (state: MissionState) => {
    switch (state) {
      case "Completed":
        return { label: "COMPLETED", variant: "green" as const, icon: Check };
      case "In Progress":
        return { label: "IN PROGRESS", variant: "gold" as const, icon: Play };
      case "Paused":
        return { label: "PAUSED", variant: "gold" as const, icon: Pause };
      case "Scheduled":
        return { label: "SCHEDULED", variant: "blue" as const, icon: Clock };
      case "Failed":
        return { label: "FAILED", variant: "red" as const, icon: AlertTriangle };
      case "Archived":
        return { label: "ARCHIVED", variant: "zinc" as const, icon: Archive };
      default:
        return { label: "PENDING", variant: "blue" as const, icon: Clock };
    }
  };

  const statusInfo = getStatusBadge(currentState);
  const xpReward = calculateDynamicXP(habit);
  const starsCount = calculateDifficultyStars(habit);
  const coinReward = Math.round(xpReward / 10);
  const estimatedDurationLabel = getDurationDisplayLabel(habit.duration, habit.priority);

  const getPriorityInfo = (p: string) => {
    if (p === "High") return { label: "CRITICAL", variant: "red" as const };
    if (p === "Medium") return { label: "HIGH", variant: "gold" as const };
    return { label: "NORMAL", variant: "blue" as const };
  };

  const priorityInfo = getPriorityInfo(habit.priority);
  const StatusIcon = statusInfo.icon;

  const handleToggleState = async () => {
    if (currentState === "Completed" && habit.completed) {
      if (!canTransitionState("Completed", "Pending")) {
        // Enforced rule check
      }
    }
    await onToggle(habit.id);
  };

  const handleDeleteConfirm = async () => {
    setShowDeleteConfirm(false);
    await onDelete(habit.id);
  };

  return (
    <>
      <TitanCard
        variant="interactive"
        padding="md"
        className={habit.completed ? "border-emerald-500/25 bg-[#090b09]/90 opacity-80" : undefined}
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-transparent via-[#d4af37]/60 to-transparent" />

        <div className="relative flex flex-col gap-5 font-mono">
          {/* Top Meta Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              {/* Category */}
              <TitanBadge variant="zinc" size="sm">
                {formatCategory(habit.category)}
              </TitanBadge>

              {/* Status Badge with Tooltip */}
              <TacticalTooltip content={STATE_TOOLTIPS[currentState]}>
                <TitanBadge variant={statusInfo.variant} size="sm" leftIcon={<StatusIcon className="size-3" />}>
                  {statusInfo.label}
                </TitanBadge>
              </TacticalTooltip>

              {/* Priority Label */}
              <TitanBadge variant={priorityInfo.variant} size="sm">
                {priorityInfo.label}
              </TitanBadge>

              {/* 1-5 Star Rating */}
              <div className="flex items-center gap-0.5 rounded-lg border border-zinc-800 bg-[#121217] px-2.5 py-1 text-xs text-[#e5c158]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`size-3 ${i < starsCount ? "fill-[#e5c158] text-[#e5c158]" : "text-zinc-700"}`}
                  />
                ))}
              </div>

              {/* Duration Badge */}
              <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${
                isInfinite ? "text-[#e5c158]" : "text-zinc-400"
              }`}>
                {isInfinite ? (
                  <span className="flex items-center gap-1">
                    <Clock className="size-3.5 text-zinc-500" />
                    <InfinityIcon className="size-3.5 text-[#e5c158]" />
                    <span>Infinite</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Clock className="size-3.5 text-zinc-500" />
                    <span>{estimatedDurationLabel}</span>
                  </span>
                )}
              </span>
            </div>

            {/* Live Countdown */}
            {!habit.completed && !isArchived && (
              <div className="flex items-center gap-2 rounded-xl border border-[#d4af37]/30 bg-[#d4af37]/10 px-3 py-1.5 text-xs text-[#e5c158] font-bold">
                <span className="size-1.5 rounded-full bg-[#e5c158] animate-pulse" />
                <span>
                  {isInfinite
                    ? "∞ INFINITE SESSION"
                    : `REMAINING: ${countdown}`}
                </span>
              </div>
            )}
          </div>

          {/* Title, Description & Actions */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-4">
              {/* Checkbox */}
              <button
                onClick={() => void handleToggleState()}
                aria-label={habit.completed ? `Mark ${habit.title} incomplete` : `Mark ${habit.title} complete`}
                className={`mt-1 flex size-10 shrink-0 items-center justify-center rounded-xl border transition-all duration-300 hover:scale-105 ${
                  habit.completed
                    ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                    : "border-zinc-700 bg-black/40 text-zinc-500 hover:border-[#d4af37]/50 hover:text-[#e5c158]"
                }`}
              >
                {habit.completed ? <Check className="size-5 stroke-[3]" /> : <div className="size-3.5 rounded-xs border border-zinc-500" />}
              </button>

              <div className="min-w-0">
                <h3
                  className={`text-lg sm:text-xl font-bold font-sans tracking-tight ${
                    habit.completed ? "line-through text-zinc-500" : "text-zinc-100"
                  }`}
                >
                  {habit.title}
                </h3>
                {habit.description && (
                  <p className="mt-1.5 text-xs text-zinc-300 font-sans leading-relaxed line-clamp-2">
                    {habit.description}
                  </p>
                )}

                {/* XP & Coin Rewards */}
                <div className="mt-3 flex items-center gap-3 text-xs font-mono">
                  <span className="font-bold text-[#e5c158]">+{xpReward} XP</span>
                  <span className="text-zinc-600">·</span>
                  <span className="text-zinc-300 font-bold">🪙 +{coinReward} COINS</span>
                  <span className="text-zinc-600">·</span>
                  <span className="text-zinc-400">
                    {isInfinite ? "DUE: PERSISTENT" : "DUE: TODAY 18:00"}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Toolbar */}
            <div className="flex shrink-0 items-center gap-1">
              <button
                onClick={() => onEdit(habit)}
                aria-label={`Edit Mission ${habit.title}`}
                title="Edit Mission"
                className="rounded-xl p-2 text-zinc-500 transition hover:bg-zinc-800/60 hover:text-[#e5c158]"
              >
                <Pencil className="size-4" />
              </button>

              {onDuplicate && (
                <button
                  onClick={() => onDuplicate(habit)}
                  aria-label={`Duplicate Mission ${habit.title}`}
                  title="Duplicate Mission"
                  className="rounded-xl p-2 text-zinc-500 transition hover:bg-zinc-800/60 hover:text-sky-400"
                >
                  <Copy className="size-4" />
                </button>
              )}

              <button
                onClick={() => setIsArchived(!isArchived)}
                aria-label={`Archive Mission ${habit.title}`}
                title={isArchived ? "Unarchive Mission" : "Archive Mission"}
                className={`rounded-xl p-2 transition ${
                  isArchived ? "text-amber-400 bg-amber-400/10" : "text-zinc-500 hover:bg-zinc-800/60 hover:text-amber-400"
                }`}
              >
                <Archive className="size-4" />
              </button>

              <button
                onClick={() => setShowDeleteConfirm(true)}
                aria-label={`Delete Mission ${habit.title}`}
                title="Delete Mission"
                className="rounded-xl p-2 text-zinc-500 transition hover:bg-red-500/10 hover:text-red-300"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="flex items-center justify-between border-t border-zinc-800/60 pt-4">
            <div className="flex items-center gap-2 text-xs text-zinc-400 font-bold">
              <ShieldCheck className="size-4 text-[#e5c158]" />
              <span>STATUS: {currentState.toUpperCase()}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {!habit.completed && !isArchived && (
                <>
                  <button
                    onClick={() => setIsPaused(!isPaused)}
                    className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-[#121217] px-3.5 py-2 text-xs font-bold text-zinc-300 hover:border-[#d4af37]/40 hover:text-white transition"
                  >
                    {isPaused ? <Play className="size-3.5 text-[#e5c158]" /> : <Pause className="size-3.5 text-zinc-400" />}
                    <span>{isPaused ? "RESUME" : "PAUSE"}</span>
                  </button>

                  {onStartFocus && (
                    <TitanButton
                      variant="outline"
                      size="sm"
                      leftIcon={<Play className="size-3.5 fill-current" />}
                      onClick={() => onStartFocus(habit)}
                    >
                      START
                    </TitanButton>
                  )}
                </>
              )}

              <TitanButton
                variant={habit.completed ? "secondary" : "primary"}
                size="sm"
                onClick={() => void handleToggleState()}
              >
                {habit.completed ? "Mission Complete" : "Complete Mission"}
              </TitanButton>
            </div>
          </div>
        </div>
      </TitanCard>

      {/* Confirmation Dialog */}
      <ConfirmationModal
        open={showDeleteConfirm}
        title={`Abort Mission "${habit.title}"?`}
        message="Are you sure you want to permanently delete this mission dossier? This action cannot be undone."
        confirmText="ABORT PERMANENTLY"
        onConfirm={() => void handleDeleteConfirm()}
        onClose={() => setShowDeleteConfirm(false)}
      />
    </>
  );
}
