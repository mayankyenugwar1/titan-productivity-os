import { CheckCircle2 } from "lucide-react";

const missions = [
  "Workout (90 mins)",
  "Read 20 mins",
  "Drink 3L Water",
  "Build TITAN",
  "Sleep before 11 PM",
];

export default function TodaysMission() {
  return (
    <div className="rounded-3xl border border-yellow-500/20 bg-zinc-900/70 p-8 backdrop-blur-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-yellow-400 uppercase tracking-[0.25em] text-xs">
            Today's Mission
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
        <div className="mb-2 flex justify-between">
          <span className="text-zinc-400">Completion</span>

          <span className="text-yellow-400 font-semibold">
            58%
          </span>
        </div>

        <div className="h-3 rounded-full bg-zinc-800">
          <div className="h-full w-[58%] rounded-full bg-yellow-400"></div>
        </div>
      </div>
    </div>
  );
}