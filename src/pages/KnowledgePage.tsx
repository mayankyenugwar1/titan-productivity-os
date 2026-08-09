import { useEffect, useMemo, useState } from "react";
import { useKnowledgeStore } from "@/store/knowledgeStore";
import { SectionHeader, TitanButton } from "@/components/ui";
import KnowledgeSidebar from "@/components/knowledge/KnowledgeSidebar";
import KnowledgeEditor from "@/components/knowledge/KnowledgeEditor";
import KnowledgeGraphWidget from "@/components/knowledge/KnowledgeGraphWidget";
import AISecondBrainPanel from "@/components/knowledge/AISecondBrainPanel";
import KnowledgeTemplateGrid, { type KnowledgeTemplate } from "@/components/knowledge/KnowledgeTemplateGrid";
import { Plus, Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function KnowledgePage() {
  const { user } = useAuth();
  const userId = user?.id || "local_user";

  const {
    items: notes,
    activeItemId,
    editorMode,
    searchQuery,
    setActiveItemId,
    setSearchQuery,
    loadNotes,
    createNote: storeCreateNote,
    updateNote: storeUpdateNote,
    deleteNote: storeDeleteNote,
    togglePin: storeTogglePin,
    toggleFavorite: storeToggleFavorite,
  } = useKnowledgeStore();

  useEffect(() => {
    loadNotes(userId);
  }, [loadNotes, userId]);

  const [activeTab, setActiveTab] = useState<"EDITOR" | "GRAPH" | "AI_ASSISTANT" | "TEMPLATES">("EDITOR");

  const activeNote = useMemo(() => {
    return notes.find((n) => n.id === activeItemId) || notes[0] || null;
  }, [notes, activeItemId]);

  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes;
    return notes.filter(
      (n) =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [notes, searchQuery]);

  return (
    <div className="space-y-8 py-4 font-mono text-zinc-100">
      <SectionHeader
        badge="AI-Powered Second Brain"
        title="Knowledge OS Vault & Intelligence"
        description="Centralized knowledge repository with markdown editor, interactive graph matrix, AI summarization, and template marketplace."
      />

      {/* Control Bar: Workspace Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-zinc-800/80 bg-[#070709] p-5 shadow-2xl shadow-black">
        <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-zinc-800 bg-[#0c0c0f] p-1.5 text-xs font-bold">
          <button
            onClick={() => setActiveTab("EDITOR")}
            className={`rounded-xl px-4 py-2 transition ${
              activeTab === "EDITOR"
                ? "bg-[#d4af37] text-zinc-950 shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            NOTE EDITOR & VAULT
          </button>
          <button
            onClick={() => setActiveTab("GRAPH")}
            className={`rounded-xl px-4 py-2 transition ${
              activeTab === "GRAPH"
                ? "bg-[#d4af37] text-zinc-950 shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            KNOWLEDGE GRAPH
          </button>
          <button
            onClick={() => setActiveTab("AI_ASSISTANT")}
            className={`rounded-xl px-4 py-2 transition ${
              activeTab === "AI_ASSISTANT"
                ? "bg-[#d4af37] text-zinc-950 shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            AI SECOND BRAIN
          </button>
          <button
            onClick={() => setActiveTab("TEMPLATES")}
            className={`rounded-xl px-4 py-2 transition ${
              activeTab === "TEMPLATES"
                ? "bg-[#d4af37] text-zinc-950 shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            TEMPLATES
          </button>
        </div>

        <TitanButton
          size="sm"
          leftIcon={<Plus className="size-4" />}
          onClick={() => storeCreateNote(userId, "New Knowledge Note", "Start drafting operational notes...", "Document", "Operations")}
        >
          NEW KNOWLEDGE NOTE
        </TitanButton>
      </div>

      {activeTab === "GRAPH" && (
        <KnowledgeGraphWidget
          notes={notes}
          onSelectNote={(n) => {
            setActiveItemId(n.id);
            setActiveTab("EDITOR");
          }}
        />
      )}

      {activeTab === "AI_ASSISTANT" && <AISecondBrainPanel note={activeNote} />}

      {activeTab === "TEMPLATES" && (
        <KnowledgeTemplateGrid
          onUseTemplate={(tmpl: KnowledgeTemplate) => {
            storeCreateNote(userId, tmpl.name, tmpl.initialContent, "Document", tmpl.category, ["template"]);
            setActiveTab("EDITOR");
          }}
        />
      )}

      {activeTab === "EDITOR" && (
        <div className="space-y-4">
          {/* Global Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-2.5 size-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search Knowledge OS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-[#0c0c0f] py-2 pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:border-[#d4af37] focus:outline-none"
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Notes Vault Sidebar */}
            <KnowledgeSidebar
              items={filteredNotes}
              activeItemId={activeItemId}
              onSelect={(id) => setActiveItemId(id)}
              onTogglePin={(id) => storeTogglePin(userId, id)}
              onToggleFavorite={(id) => storeToggleFavorite(userId, id)}
              onDelete={(id) => storeDeleteNote(userId, id)}
            />

            {/* Main Dual Visual/Markdown Editor */}
            <div className="flex-1">
              <KnowledgeEditor
                note={activeNote}
                editorMode={editorMode}
                onUpdate={(id, updates) => storeUpdateNote(userId, id, updates)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
