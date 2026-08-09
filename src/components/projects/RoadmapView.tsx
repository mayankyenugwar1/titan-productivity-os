import { Map, Target, Folder } from "lucide-react";
import type { Goal, Project } from "@/services/projects/projectService";
import { calculateGoalProgress, calculateProjectProgress } from "@/services/projects/progressService";
import { TitanBadge, TitanProgress } from "@/components/ui";

interface RoadmapViewProps {
  goals: Goal[];
  projects: Project[];
}

export default function RoadmapView({ goals, projects }: RoadmapViewProps) {
  const unlinkedProjects = projects.filter(
    (p) => !p.goalId || !goals.some((g) => g.id === p.goalId)
  );

  return (
    <div className="rounded-3xl border border-zinc-800/80 bg-[#070709] p-6.5 shadow-2xl shadow-black font-mono space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3.5">
        <div className="flex items-center gap-2">
          <Map className="size-4 text-[#e5c158]" />
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#e5c158]">
            STRATEGIC ROADMAP ENGINE
          </span>
        </div>
        <TitanBadge variant="gold" size="sm">
          ROADMAP
        </TitanBadge>
      </div>

      <div className="space-y-6">
        {goals.map((goal) => {
          const linkedProjects = projects.filter((p) => p.goalId === goal.id);
          const goalProgress = calculateGoalProgress(goal);

          return (
            <div key={goal.id} className="rounded-2xl border border-zinc-800/80 bg-[#0c0c0f] p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
                <div className="flex items-center gap-3">
                  <Target className="size-5 text-[#e5c158]" />
                  <div>
                    <h4 className="font-sans font-bold text-base text-zinc-100">{goal.title}</h4>
                    <p className="text-xs text-zinc-400 font-sans">{goal.description}</p>
                  </div>
                </div>
                <TitanBadge variant="gold" size="sm">
                  {goalProgress}% GOAL INDEX
                </TitanBadge>
              </div>

              {/* Linked Projects Matrix */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  LINKED PROJECTS ({linkedProjects.length})
                </span>

                <div className="grid gap-3 sm:grid-cols-2">
                  {linkedProjects.map((proj) => {
                    const pProgress = calculateProjectProgress(proj);
                    return (
                      <div key={proj.id} className="rounded-xl border border-zinc-800/60 bg-[#070709] p-3.5 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-sans font-bold text-xs text-zinc-200">{proj.name}</span>
                          <span className="text-[10px] font-bold text-[#e5c158]">{pProgress}%</span>
                        </div>
                        <TitanProgress value={pProgress} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {unlinkedProjects.length > 0 && (
          <div className="rounded-2xl border border-zinc-800/80 bg-[#0c0c0f] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
              <div className="flex items-center gap-3">
                <Folder className="size-5 text-sky-400" />
                <div>
                  <h4 className="font-sans font-bold text-base text-zinc-100">Standalone Initiatives & Directives</h4>
                  <p className="text-xs text-zinc-400 font-sans">Active operational projects without specific goal mapping.</p>
                </div>
              </div>
              <TitanBadge variant="blue" size="sm">
                {unlinkedProjects.length} INITIATIVES
              </TitanBadge>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {unlinkedProjects.map((proj) => {
                const pProgress = calculateProjectProgress(proj);
                return (
                  <div key={proj.id} className="rounded-xl border border-zinc-800/60 bg-[#070709] p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-sans font-bold text-xs text-zinc-200">{proj.name}</span>
                      <span className="text-[10px] font-bold text-[#e5c158]">{pProgress}%</span>
                    </div>
                    <TitanProgress value={pProgress} />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
