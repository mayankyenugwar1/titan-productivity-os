import { BookOpen, Pin, Star, Trash2 } from "lucide-react";
import type { KnowledgeItem } from "@/services/knowledge/knowledgeService";
import { TitanBadge } from "@/components/ui";

interface KnowledgeSidebarProps {
  items: KnowledgeItem[];
  activeItemId: string | null;
  onSelect: (id: string) => void;
  onTogglePin: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function KnowledgeSidebar({
  items,
  activeItemId,
  onSelect,
  onTogglePin,
  onToggleFavorite,
  onDelete,
}: KnowledgeSidebarProps) {
  return (
    <aside className="w-full lg:w-80 shrink-0 rounded-3xl border border-zinc-800/80 bg-[#070709] p-5 shadow-2xl shadow-black font-mono space-y-4 text-xs">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2">
          <BookOpen className="size-4 text-[#e5c158]" />
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#e5c158]">
            KNOWLEDGE VAULT
          </span>
        </div>
        <TitanBadge variant="gold" size="sm">
          {items.length} ENTRIES
        </TitanBadge>
      </div>

      <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
        {items.length === 0 ? (
          <p className="text-xs text-zinc-500 italic p-4 text-center">No knowledge entries found.</p>
        ) : (
          items.map((item) => {
            const isActive = item.id === activeItemId;
            return (
              <div
                key={item.id}
                onClick={() => onSelect(item.id)}
                className={`group rounded-2xl border p-3.5 space-y-2 cursor-pointer transition duration-300 ${
                  isActive
                    ? "border-[#d4af37]/40 bg-[#d4af37]/10 shadow-lg shadow-black"
                    : "border-zinc-800/60 bg-[#0c0c0f] hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <TitanBadge variant={item.pinned ? "gold" : "blue"} size="sm">
                    {item.type}
                  </TitanBadge>

                  <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onTogglePin(item.id);
                      }}
                      className={`p-1 hover:text-[#e5c158] ${item.pinned ? "text-[#e5c158]" : "text-zinc-500"}`}
                    >
                      <Pin className="size-3.5" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(item.id);
                      }}
                      className={`p-1 hover:text-amber-400 ${item.favorite ? "text-amber-400 fill-amber-400" : "text-zinc-500"}`}
                    >
                      <Star className="size-3.5" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(item.id);
                      }}
                      className="p-1 text-zinc-500 hover:text-red-400"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>

                <h4 className="font-sans font-bold text-sm text-zinc-100 truncate">{item.title}</h4>

                <div className="flex items-center justify-between text-[10px] text-zinc-400 border-t border-zinc-800/60 pt-2 font-mono">
                  <span>{item.wordCount} words</span>
                  <span>{item.readingTimeMins} min read</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
