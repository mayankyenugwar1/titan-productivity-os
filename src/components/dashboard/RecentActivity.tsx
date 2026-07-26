import {
  CheckCircle2,
  Dumbbell,
  BookOpen,
  Flame,
  Trophy,
} from "lucide-react";
import { ICON_SIZES, SectionHeader, TitanBadge, TitanCard } from "@/components/ui";
import { useHabitStore } from "@/store/missionStore";
import type { Habit } from "@/features/missions/types";

const defaultActivities = [
  {
    title: "Completed Workout",
    time: "08:30 AM",
    xp: "+120 XP",
    icon: Dumbbell,
  },
  {
    title: "Read 20 Minutes",
    time: "11:10 AM",
    xp: "+40 XP",
    icon: BookOpen,
  },
  {
    title: "Reached 10K Steps",
    time: "06:15 PM",
    xp: "+80 XP",
    icon: CheckCircle2,
  },
  {
    title: "17 Day Combat Streak",
    time: "09:00 PM",
    xp: "Achievement",
    icon: Flame,
  },
  {
    title: "Level Up",
    time: "09:02 PM",
    xp: "Level 12",
    icon: Trophy,
  },
];

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

export default function RecentActivity() {
  const { habits } = useHabitStore();

  const realActivities = habits
    .flatMap((habit: Habit) =>
      habit.history.map((completion) => ({
        id: completion.id,
        title: habit.title,
        time: timeFormatter.format(completion.completedAt),
        xp: `+${habit.xp} XP`,
        icon: CheckCircle2,
        date: completion.completedAt,
      }))
    )
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);

  const displayActivities = realActivities.length > 0 ? realActivities : defaultActivities;

  return (
    <TitanCard variant="callout" padding="lg">
      <SectionHeader
        badge="TIMELINE TELEMETRY"
        title="Recent Activity"
        description="Sequential log of completed operations and milestones."
        className="mb-10"
      />

      <div className="relative border-l border-zinc-800 pl-8">
        {displayActivities.map((activity, index) => {
          const Icon = activity.icon;

          return (
            <div key={index} className="group relative mb-10 last:mb-0">
              {/* Timeline Connector Icon Node */}
              <div className="absolute -left-[44px] flex size-10 items-center justify-center rounded-full border border-yellow-500/30 bg-zinc-900 shadow-lg shadow-black/50 transition duration-300 group-hover:border-yellow-400 group-hover:bg-yellow-400/10">
                <Icon size={ICON_SIZES.sm} className="text-yellow-400" />
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5 transition-all duration-300 hover:border-yellow-400/40 hover:bg-zinc-900/60">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-base font-bold text-white sm:text-lg">
                    {activity.title}
                  </h3>

                  <TitanBadge variant="gold" size="sm" glow>
                    {activity.xp}
                  </TitanBadge>
                </div>

                <p className="mt-2 text-xs font-medium text-zinc-500">
                  {activity.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </TitanCard>
  );
}