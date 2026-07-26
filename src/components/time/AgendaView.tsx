import { useAgenda } from "@/hooks/time/useAgenda";
import { TitanBadge } from "@/components/ui";
import TimeBlock from "./TimeBlock";

export default function AgendaView() {
  const { morning, afternoon, evening, night, completed } = useAgenda();

  const sections = [
    { title: "MORNING DIRECTIVES (06:00 - 12:00)", events: morning, badge: "gold" as const },
    { title: "AFTERNOON DIRECTIVES (12:00 - 17:00)", events: afternoon, badge: "blue" as const },
    { title: "EVENING DIRECTIVES (17:00 - 21:00)", events: evening, badge: "gold" as const },
    { title: "NIGHT DIRECTIVES (21:00 - 06:00)", events: night, badge: "zinc" as const },
    { title: "COMPLETED OPERATIONS", events: completed, badge: "green" as const },
  ];

  return (
    <div className="space-y-6 font-mono text-zinc-100">
      {sections.map((sec) => (
        <div key={sec.title} className="rounded-3xl border border-zinc-800/80 bg-[#070709] p-6 shadow-2xl shadow-black space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#e5c158]">
              {sec.title}
            </span>
            <TitanBadge variant={sec.badge} size="sm">
              {sec.events.length} DIRECTIVES
            </TitanBadge>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sec.events.length === 0 ? (
              <p className="text-xs text-zinc-500 italic p-2">No directives scheduled in this section.</p>
            ) : (
              sec.events.map((ev) => <TimeBlock key={ev.id} event={ev} />)
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
