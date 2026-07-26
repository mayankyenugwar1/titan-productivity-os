import { Calendar, Flag } from "lucide-react";
import type { Project } from "@/services/projects/projectService";
import { calculateProjectProgress } from "@/services/projects/progressService";
import { TitanBadge } from "@/components/ui";

interface ProjectTimelineProps {
  projects: Project[];
}

export default function ProjectTimeline({ projects }: ProjectTimelineProps) {
  return (
    <div className="rounded-3xl border border-zinc-800/80 bg-[#070709] p-6.5 shadow-2xl shadow-black font-mono space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3.5">
        <div className="flex items-center gap-2">
          <Calendar className="size-4 text-[#e5c158]" />
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#e5c158]">
            PROJECT MILESTONE TIMELINE VISUALIZER
          </span>
        </div>
        <TitanBadge variant="gold" size="sm">
          TIMELINE
        </TitanBadge>
      </div>

      <div className="space-y-6">
        {projects.map((p) => {
          const progress = calculateProjectProgress(p);
          return (
            <div key={p.id} className="rounded-2xl border border-zinc-800/80 bg-[#0c0c0f] p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-sans font-bold text-base text-zinc-100">{p.name}</h4>
                  <p className="text-xs text-zinc-400 font-sans">{p.description}</p>
                </div>
                <div className="text-right font-mono text-xs">
                  <span className="font-bold text-[#e5c158]">{progress}% Completed</span>
                  <p className="text-[10px] text-zinc-500">{p.startDate} — {p.endDate}</p>
                </div>
              </div>

              {/* Milestones List */}
              <div className="space-y-2 border-t border-zinc-800/60 pt-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  MILESTONES ({p.milestones.length})
                </span>
                <div className="grid gap-2 sm:grid-cols-2">
                  {p.milestones.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between rounded-xl border border-zinc-800/60 bg-[#070709] p-2.5 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Flag className={`size-3.5 ${m.completed ? "text-emerald-400" : "text-[#e5c158]"}`} />
                        <span className={m.completed ? "line-through text-zinc-500" : "text-zinc-200"}>
                          {m.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono">+{m.xpReward} XP</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
