import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string;
  icon: LucideIcon;
  progress: number;
  level: string;
  gain: string;
};

function StatCard({
  title,
  value,
  icon: Icon,
  progress,
  level,
  gain,
}: StatCardProps) {
  return (
    <div
      className="
      rounded-3xl
      border
      border-yellow-500/20
      bg-zinc-900/80
      p-8
      transition-all
      duration-300
      hover:-translate-y-1
      hover:border-yellow-400/60
      hover:shadow-[0_0_30px_rgba(255,193,7,0.15)]
      "
    >
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
          {title}
        </p>

        <Icon className="h-6 w-6 text-yellow-400" />
      </div>

      <h2 className="mt-5 text-5xl font-bold text-yellow-400">
        {value}
      </h2>

      <div className="mt-8">
        <div className="flex justify-between text-xs text-zinc-500">
          <span>{level}</span>
          <span>{progress}%</span>
        </div>

        <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-yellow-400 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="mt-3 text-sm text-zinc-400">
          {gain}
        </p>
      </div>
    </div>
  );
}

export default StatCard;