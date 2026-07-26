import { CheckCircle2 } from "lucide-react";
import { TitanCard, TitanProgress } from "@/components/ui";

const missions = [
  "Workout (90 mins)",
  "Read 20 mins",
  "Drink 3L Water",
  "Build TITAN",
  "Sleep before 11 PM",
];

export default function TodaysMission() {
  return (
    <TitanCard variant="callout" padding="lg">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-yellow-400">
            Today's Missions
          </p>
          <h2 className="mt-2 text-3xl font-bold text-white">
            Become 1% Better.
          </h2>
        </div>
        <div className="text-5xl">🦇</div>
      </div>

      <div className="space-y-4">
        {missions.map((mission) => (
          <div
            key={mission}
            className="flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-950/40 p-4 transition hover:border-yellow-500/40"
          >
            <CheckCircle2 className="text-yellow-400" size={22} />
            <span className="text-zinc-200">{mission}</span>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <div className="mb-2 flex justify-between text-sm">
          <span className="text-zinc-400">Completion</span>
          <span className="font-semibold text-yellow-400">58%</span>
        </div>
        <TitanProgress value={58} />
      </div>
    </TitanCard>
  );
}