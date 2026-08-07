import { useMemo } from "react";
import { Activity, Zap } from "lucide-react";
import { useHabitStore } from "@/store/missionStore";
import type { Habit } from "@/features/missions/types";
import { calculateMissionXP } from "@/services/xpEngineService";
import { EmptyState, SectionHeader, TitanBadge } from "@/components/ui";
import { safeDate, safeDateString } from "@/utils/safeDate";

export default function XPActivityLog() {
  const { habits } = useHabitStore();

  const xpActivities = useMemo(() => {
    return (habits || [])
      .filter((h: Habit) => h.completed || (h.history && h.history.length > 0))
      .map((habit: Habit) => {
        const xp = calculateMissionXP(habit);
        const coins = Math.round(xp / 10);
        const d = safeDate(habit.completedAt) || safeDate(habit.createdAt);
        const completedDate = d || new Date(0);

        return {
          id: habit.id,
          title: habit.title,
          xpEarned: xp,
          coinEarned: coins,
          category: habit.category,
          date: completedDate,
          timestamp: completedDate.getTime(),
          reason: "Tactical Operation Accomplished",
        };
      })
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [habits]);

  return (
    <div className="rounded-3xl border border-zinc-800/80 bg-[#070709] p-6 sm:p-8 shadow-2xl shadow-black font-mono space-y-6">
      <SectionHeader
        badge="Progression Core Log"
        title="XP Activity Telemetry"
        description="Historical real-time ledger of all XP yield transactions and tactical rank experience gains."
      />

      {xpActivities.length === 0 ? (
        <EmptyState
          icon={<Activity className="size-8 text-[#e5c158]" />}
          title="No XP Transactions Logged"
          description="Operator, complete active missions to record XP telemetry and advance your rank level."
        />
      ) : (
        <div className="space-y-3">
          {xpActivities.map((act) => {
            const formattedDate = safeDateString(act.date, {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={act.id}
                className="group flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-800/80 bg-[#0c0c0f] p-4 transition duration-300 hover:border-[#d4af37]/40 hover:bg-[#111116]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#d4af37]/30 bg-[#d4af37]/10 text-[#e5c158] shadow-[0_0_12px_rgba(212,175,55,0.15)]">
                    <Zap className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-xs">
                      <TitanBadge variant="zinc" size="sm">
                        {act.category}
                      </TitanBadge>
                      <span className="text-[10px] text-zinc-500">{formattedDate}</span>
                    </div>
                    <h4 className="mt-1 font-sans text-base font-bold text-zinc-100">
                      {act.title}
                    </h4>
                    <p className="text-[11px] text-zinc-400 font-sans">{act.reason}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-bold font-mono">
                  <div className="flex items-center gap-1 text-[#e5c158]">
                    <Zap className="size-3.5" />
                    <span>+{act.xpEarned} XP</span>
                  </div>
                  <div className="flex items-center gap-1 text-zinc-200">
                    <span>🪙 +{act.coinEarned} COINS</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
