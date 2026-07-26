import { Code, Eye, LayoutTemplate, Plus, Search } from "lucide-react";
import { TitanButton } from "@/components/ui";

interface KnowledgeToolbarProps {
  typeFilter: string;
  onTypeFilterChange: (type: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  editorMode: "visual" | "markdown";
  onEditorModeChange: (mode: "visual" | "markdown") => void;
  onNewNote: () => void;
  onOpenTemplates: () => void;
}

export default function KnowledgeToolbar({
  typeFilter,
  onTypeFilterChange,
  searchQuery,
  onSearchChange,
  editorMode,
  onEditorModeChange,
  onNewNote,
  onOpenTemplates,
}: KnowledgeToolbarProps) {
  const types = ["ALL", "Document", "Journal", "CodeSnippet", "Research"];

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-zinc-800/80 bg-[#070709] p-5 shadow-2xl shadow-black font-mono">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 size-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Search knowledge base..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-64 rounded-xl border border-zinc-800 bg-[#0c0c0f] py-2 pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:border-[#d4af37] focus:outline-none"
        />
      </div>

      {/* Type Filters */}
      <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-zinc-800 bg-[#0c0c0f] p-1.5 text-xs">
        {types.map((t) => (
          <button
            key={t}
            onClick={() => onTypeFilterChange(t)}
            className={`rounded-xl px-3 py-1.5 font-bold transition ${
              typeFilter === t
                ? "border border-[#d4af37]/40 bg-[#d4af37] text-zinc-950 shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Mode Switcher & Actions */}
      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-xl border border-zinc-800 bg-[#0c0c0f] p-1 text-xs">
          <button
            onClick={() => onEditorModeChange("visual")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-bold transition ${
              editorMode === "visual" ? "bg-[#d4af37]/15 text-[#e5c158]" : "text-zinc-400"
            }`}
          >
            <Eye className="size-3.5" /> VISUAL
          </button>

          <button
            onClick={() => onEditorModeChange("markdown")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-bold transition ${
              editorMode === "markdown" ? "bg-sky-400/15 text-sky-300" : "text-zinc-400"
            }`}
          >
            <Code className="size-3.5" /> MARKDOWN
          </button>
        </div>

        <TitanButton
          size="sm"
          variant="outline"
          leftIcon={<LayoutTemplate className="size-4" />}
          onClick={onOpenTemplates}
        >
          TEMPLATES
        </TitanButton>

        <TitanButton size="sm" leftIcon={<Plus className="size-4" />} onClick={onNewNote}>
          NEW NOTE
        </TitanButton>
      </div>
    </div>
  );
}
