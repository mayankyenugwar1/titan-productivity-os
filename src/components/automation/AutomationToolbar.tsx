import { LayoutTemplate, Plus, Search } from "lucide-react";
import { TitanButton } from "@/components/ui";

interface AutomationToolbarProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onNewWorkflow: () => void;
  onOpenTemplates: () => void;
}

export default function AutomationToolbar({
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  onNewWorkflow,
  onOpenTemplates,
}: AutomationToolbarProps) {
  const filters = ["ALL", "ACTIVE", "INACTIVE"];

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-zinc-800/80 bg-[#070709] p-5 shadow-2xl shadow-black font-mono">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 size-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Search automation workflows..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-64 rounded-xl border border-zinc-800 bg-[#0c0c0f] py-2 pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:border-[#d4af37] focus:outline-none"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 rounded-2xl border border-zinc-800 bg-[#0c0c0f] p-1.5 text-xs">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => onFilterChange(f)}
            className={`rounded-xl px-3 py-1.5 font-bold transition ${
              activeFilter === f
                ? "border border-[#d4af37]/40 bg-[#d4af37] text-zinc-950 shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <TitanButton
          size="sm"
          variant="outline"
          leftIcon={<LayoutTemplate className="size-4" />}
          onClick={onOpenTemplates}
        >
          TEMPLATES
        </TitanButton>

        <TitanButton size="sm" leftIcon={<Plus className="size-4" />} onClick={onNewWorkflow}>
          NEW WORKFLOW
        </TitanButton>
      </div>
    </div>
  );
}
