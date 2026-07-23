import {
  Plus,
  Timer,
  Dumbbell,
  BookOpen,
  ArrowRight,
} from "lucide-react";

const actions = [
  {
    title: "Add Habit",
    description: "Create a new daily habit",
    icon: Plus,
  },
  {
    title: "Start Focus",
    description: "Launch a Pomodoro session",
    icon: Timer,
  },
  {
    title: "Workout",
    description: "Log today's workout",
    icon: Dumbbell,
  },
  {
    title: "Journal",
    description: "Write today's reflection",
    icon: BookOpen,
  },
];

export default function QuickActions() {
  return (
    <section className="rounded-[32px] border border-yellow-500/20 bg-zinc-900/60 p-8 backdrop-blur-sm">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.35em] text-yellow-400">
          ACTION CENTER
        </p>

        <h2 className="mt-3 text-3xl font-bold text-white">
          Quick Actions
        </h2>

        <p className="mt-2 text-zinc-400">
          Jump into your most-used productivity tools.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.title}
              className="group rounded-2xl border border-zinc-800 bg-black/40 p-6 text-left transition-all duration-300 hover:-translate-y-2 hover:border-yellow-400 hover:bg-yellow-400/10"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-400/15">
                <Icon size={24} className="text-yellow-400" />
              </div>

              <h3 className="mt-5 text-xl font-semibold text-white">
                {action.title}
              </h3>

              <p className="mt-2 text-sm text-zinc-400">
                {action.description}
              </p>

              <div className="mt-6 flex items-center gap-2 text-yellow-400 opacity-0 transition-all duration-300 group-hover:opacity-100">
                <span className="text-sm font-medium">Open</span>
                <ArrowRight size={16} />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}