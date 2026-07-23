import {
  CheckCircle2,
  Dumbbell,
  BookOpen,
  Flame,
  Trophy,
} from "lucide-react";

const activities = [
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
    title: "17 Day Streak",
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

export default function RecentActivity() {
  return (
    <section className="rounded-[32px] border border-yellow-500/20 bg-zinc-900/60 p-8 backdrop-blur-sm">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.35em] text-yellow-400">
          TODAY
        </p>

        <h2 className="mt-3 text-3xl font-bold text-white">
          Recent Activity
        </h2>

        <p className="mt-2 text-zinc-400">
          Everything you've accomplished today.
        </p>
      </div>

      <div className="relative border-l border-zinc-800 pl-8">
        {activities.map((activity, index) => {
          const Icon = activity.icon;

          return (
            <div
              key={index}
              className="group relative mb-10 last:mb-0"
            >
              <div className="absolute -left-[44px] flex h-10 w-10 items-center justify-center rounded-full border border-yellow-500/30 bg-zinc-900 shadow-lg">
                <Icon size={18} className="text-yellow-400" />
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-black/30 p-5 transition-all duration-300 hover:border-yellow-400/50 hover:bg-black/50">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">
                    {activity.title}
                  </h3>

                  <span className="text-yellow-400 font-medium">
                    {activity.xp}
                  </span>
                </div>

                <p className="mt-2 text-sm text-zinc-500">
                  {activity.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}