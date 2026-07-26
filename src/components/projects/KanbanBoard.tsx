import { ChevronLeft, ChevronRight, Clock, Flag } from "lucide-react";
import type { Project, ProjectStatus } from "@/services/projects/projectService";
import { calculateProjectProgress } from "@/services/projects/progressService";
import { TitanBadge, TitanProgress } from "@/components/ui";

interface KanbanBoardProps {
  projects: Project[];
  onStatusChange: (id: string, status: ProjectStatus) => void;
}

export default function KanbanBoard({ projects, onStatusChange }: KanbanBoardProps) {
  const columns: { status: ProjectStatus; label: string; color: string }[] = [
    { status: "Backlog", label: "BACKLOG", color: "text-zinc-500 border-zinc-700" },
    { status: "Planned", label: "PLANNED", color: "text-sky-400 border-sky-500/40" },
    { status: "Active", label: "ACTIVE IN PROGRESS", color: "text-[#e5c158] border-[#d4af37]/40" },
    { status: "Review", label: "IN REVIEW", color: "text-purple-400 border-purple-500/40" },
    { status: "Completed", label: "ACCOMPLISHED", color: "text-emerald-400 border-emerald-500/40" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 font-mono text-xs">
      {columns.map((col) => {
        const colProjects = projects.filter((p) => p.status === col.status);
        return (
          <div
            key={col.status}
            className="flex flex-col rounded-3xl border border-zinc-800/80 bg-[#070709] p-4.5 space-y-3.5 shadow-2xl shadow-black min-h-[500px]"
          >
            {/* Column Header */}
            <div className={`flex items-center justify-between border-b pb-2.5 ${col.color}`}>
              <span className="font-bold uppercase tracking-[0.18em]">{col.label}</span>
              <span className="rounded-full bg-zinc-900 px-2 py-0.5 font-bold text-zinc-300">
                {colProjects.length}
              </span>
            </div>

            {/* Column Items */}
            <div className="space-y-3 flex-1">
              {colProjects.map((p) => {
                const progress = calculateProjectProgress(p);
                return (
                  <div
                    key={p.id}
                    className="group rounded-2xl border border-zinc-800/80 bg-[#0c0c0f] p-4 space-y-3 shadow-lg hover:border-[#d4af37]/40 transition duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <TitanBadge variant={p.priority === "High" ? "red" : "gold"} size="sm">
                        {p.category}
                      </TitanBadge>

                      <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition">
                        {col.status !== "Backlog" && (
                          <button
                            onClick={() => {
                              const prevIdx = columns.findIndex((c) => c.status === col.status) - 1;
                              if (prevIdx >= 0) onStatusChange(p.id, columns[prevIdx].status);
                            }}
                            className="p-1 hover:text-white"
                          >
                            <ChevronLeft className="size-3.5" />
                          </button>
                        )}
                        {col.status !== "Completed" && (
                          <button
                            onClick={() => {
                              const nextIdx = columns.findIndex((c) => c.status === col.status) + 1;
                              if (nextIdx < columns.length) onStatusChange(p.id, columns[nextIdx].status);
                            }}
                            className="p-1 hover:text-white"
                          >
                            <ChevronRight className="size-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <h4 className="font-sans font-bold text-sm text-zinc-100">{p.name}</h4>
                    <p className="text-[11px] text-zinc-400 font-sans line-clamp-2">{p.description}</p>

                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-zinc-500 font-bold">Progress</span>
                        <span className="text-[#e5c158] font-bold">{progress}%</span>
                      </div>
                      <TitanProgress value={progress} />
                    </div>

                    <div className="flex items-center justify-between border-t border-zinc-800/60 pt-2 text-[10px] text-zinc-500 font-mono">
                      <span className="flex items-center gap-1">
                        <Flag className="size-3 text-sky-400" /> {p.milestones.length} Milestones
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" /> {p.endDate}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
