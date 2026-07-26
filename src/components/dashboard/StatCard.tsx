import type { LucideIcon } from "lucide-react";
import { TitanCard, TitanProgress } from "@/components/ui";

type StatCardProps = {
  title: string;
  value: string;
  icon: LucideIcon;
  progress: number;
  level: string;
  gain: string;
};

export default function StatCard({
  title,
  value,
  icon: Icon,
  progress,
  level,
  gain,
}: StatCardProps) {
  return (
    <TitanCard variant="callout" padding="lg">
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

        <div className="mt-2">
          <TitanProgress value={progress} />
        </div>

        <p className="mt-3 text-sm text-zinc-400">
          {gain}
        </p>
      </div>
    </TitanCard>
  );
}