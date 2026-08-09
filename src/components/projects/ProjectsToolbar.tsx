import { Calendar, Columns, Map, Plus, Search, Target } from "lucide-react";
import { TitanButton } from "@/components/ui";
import type { ProjectViewMode } from "@/store/projectStore";
import { ALLOWED_CATEGORIES } from "@/constants/categories";

interface ProjectsToolbarProps {
  activeView: ProjectViewMode;
  onViewChange: (view: ProjectViewMode) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  categoryFilter: string;
  onCategoryChange: (cat: string) => void;
  onNewProject: () => void;
}

export default function ProjectsToolbar({
  activeView,
  onViewChange,
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  onNewProject,
}: ProjectsToolbarProps) {
  const views: { id: ProjectViewMode; label: string; icon: any }[] = [
    { id: "kanban", label: "MISSION BOARD", icon: Columns },
    { id: "timeline", label: "TIMELINE", icon: Calendar },
    { id: "roadmap", label: "ROADMAP", icon: Map },
    { id: "goals", label: "GOALS & OKRS", icon: Target },
  ];

  const categories = ["ALL", ...ALLOWED_CATEGORIES];

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-zinc-800/80 bg-[#070709] p-5 shadow-2xl shadow-black font-mono">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 size-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Search projects & goals..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-64 rounded-xl border border-zinc-800 bg-[#0c0c0f] py-2 pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:border-[#d4af37] focus:outline-none"
        />
      </div>

      {/* View Switcher Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-zinc-800 bg-[#0c0c0f] p-1.5 text-xs">
        {views.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onViewChange(id)}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-bold transition ${
              activeView === id
                ? "border border-[#d4af37]/40 bg-[#d4af37] text-zinc-950 shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Icon className="size-3.5" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <select
          value={categoryFilter}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="rounded-xl border border-zinc-800 bg-[#0c0c0f] px-3 py-2 text-xs text-white focus:border-[#d4af37] focus:outline-none font-mono"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              Sector: {c}
            </option>
          ))}
        </select>

        <TitanButton size="sm" leftIcon={<Plus className="size-4" />} onClick={onNewProject}>
          NEW PROJECT
        </TitanButton>
      </div>
    </div>
  );
}
