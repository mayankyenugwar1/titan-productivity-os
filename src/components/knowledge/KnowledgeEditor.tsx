import { useState, useEffect } from "react";
import { Bold, Code, Heading, Italic, List, Quote, Save } from "lucide-react";
import type { KnowledgeItem } from "@/services/knowledge/knowledgeService";
import { TitanBadge } from "@/components/ui";

interface KnowledgeEditorProps {
  note: KnowledgeItem | null;
  editorMode: "visual" | "markdown";
  onUpdate: (id: string, updates: Partial<KnowledgeItem>) => void;
}

export default function KnowledgeEditor({ note, editorMode, onUpdate }: KnowledgeEditorProps) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [isSaved, setIsSaved] = useState(true);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setIsSaved(true);
    }
  }, [note?.id]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    setIsSaved(false);
    if (note) onUpdate(note.id, { title: val });
  };

  const handleContentChange = (val: string) => {
    setContent(val);
    setIsSaved(false);
    if (note) onUpdate(note.id, { content: val });
  };

  if (!note) {
    return (
      <div className="flex h-96 items-center justify-center rounded-3xl border border-zinc-800/80 bg-[#070709] p-8 text-center text-zinc-500 font-mono text-xs">
        No active note selected. Select a note from the Knowledge Vault or create a new entry.
      </div>
    );
  }

  const insertFormatting = (prefix: string, suffix = "") => {
    const nextContent = `${content}\n${prefix}sample text${suffix}`;
    handleContentChange(nextContent);
  };

  return (
    <div className="rounded-3xl border border-zinc-800/80 bg-[#070709] p-6.5 shadow-2xl shadow-black space-y-5 font-mono">
      {/* Header Controls & Formatting Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => insertFormatting("# ")}
            className="rounded-xl border border-zinc-800 bg-[#0c0c0f] p-2 text-zinc-400 hover:border-[#d4af37]/40 hover:text-white transition"
            title="Heading 1"
          >
            <Heading className="size-4" />
          </button>

          <button
            onClick={() => insertFormatting("**", "**")}
            className="rounded-xl border border-zinc-800 bg-[#0c0c0f] p-2 text-zinc-400 hover:border-[#d4af37]/40 hover:text-white transition"
            title="Bold"
          >
            <Bold className="size-4" />
          </button>

          <button
            onClick={() => insertFormatting("*", "*")}
            className="rounded-xl border border-zinc-800 bg-[#0c0c0f] p-2 text-zinc-400 hover:border-[#d4af37]/40 hover:text-white transition"
            title="Italic"
          >
            <Italic className="size-4" />
          </button>

          <button
            onClick={() => insertFormatting("```\n", "\n```")}
            className="rounded-xl border border-zinc-800 bg-[#0c0c0f] p-2 text-zinc-400 hover:border-[#d4af37]/40 hover:text-white transition"
            title="Code Block"
          >
            <Code className="size-4" />
          </button>

          <button
            onClick={() => insertFormatting("- ")}
            className="rounded-xl border border-zinc-800 bg-[#0c0c0f] p-2 text-zinc-400 hover:border-[#d4af37]/40 hover:text-white transition"
            title="Bullet List"
          >
            <List className="size-4" />
          </button>

          <button
            onClick={() => insertFormatting("> ")}
            className="rounded-xl border border-zinc-800 bg-[#0c0c0f] p-2 text-zinc-400 hover:border-[#d4af37]/40 hover:text-white transition"
            title="Quote"
          >
            <Quote className="size-4" />
          </button>
        </div>

        {/* Autosave Indicator */}
        <div className="flex items-center gap-2 text-xs font-bold text-zinc-400">
          <Save className={`size-4 ${isSaved ? "text-emerald-400" : "text-[#e5c158] animate-pulse"}`} />
          <span>{isSaved ? "AUTOSAVED" : "SAVING..."}</span>
        </div>
      </div>

      {/* Note Title Input */}
      <input
        type="text"
        placeholder="Note Title..."
        value={title}
        onChange={(e) => handleTitleChange(e.target.value)}
        className="w-full bg-transparent font-sans text-2xl font-black text-white placeholder-zinc-600 focus:outline-none"
      />

      {/* Editor Body */}
      {editorMode === "visual" ? (
        <textarea
          rows={16}
          placeholder="Start writing note entry..."
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          className="w-full rounded-2xl border border-zinc-800/80 bg-[#0c0c0f] p-5 text-sm text-zinc-100 font-sans leading-relaxed placeholder-zinc-600 focus:border-[#d4af37] focus:outline-none resize-none"
        />
      ) : (
        <div className="min-h-96 rounded-2xl border border-zinc-800/80 bg-[#0c0c0f] p-5 font-mono text-xs text-zinc-200 leading-relaxed whitespace-pre-wrap">
          {content}
        </div>
      )}

      {/* Footer Telemetry Stats */}
      <div className="flex flex-wrap items-center justify-between border-t border-zinc-800/80 pt-4 text-xs font-mono text-zinc-400">
        <div className="flex items-center gap-4">
          <span>Words: {note.wordCount}</span>
          <span>Chars: {content.length}</span>
          <span>Reading Time: {note.readingTimeMins} min</span>
        </div>

        <TitanBadge variant="gold" size="sm">
          {note.category} SECTOR
        </TitanBadge>
      </div>
    </div>
  );
}
